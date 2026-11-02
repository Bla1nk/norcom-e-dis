import { useEffect, useRef } from 'react'
import { markIntroSeen, releaseIntro } from '../lib/intro'
import { lockScroll, unlockScroll } from '../lib/lenis'

// Konzept „Data Assembly“: Verstreute Datenpunkte und Dateikürzel fliegen ein und setzen sich zum Wort „DaSense“
// zusammen, während die Zähler hochlaufen. Dann wird das Wort scharf, und die schwarze Fläche zieht nach oben weg.
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const ASSEMBLE = 2.5 // Sekunden bis alles sitzt
const HOLD = 0.55 // Wort steht kurz
const LIFT = 1000 // ms Wegziehen
const DOCS = 1284503
const TAGS = ['PDF', 'MSG', 'XLSX', 'EML', 'DOCX', 'PST', 'ZIP', 'JPG', 'PPTX', 'CSV', 'TXT', 'WAV', 'HTML', 'MP4', 'RTF', 'XML']

type P = { x0: number; y0: number; x: number; y: number; d: number; t: number; ph: number }
type Chip = { label: string; x0: number; y0: number; x: number; y: number; d: number; t: number }

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const easeOut = (v: number) => 1 - Math.pow(1 - v, 4)
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE')

export function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const docs = useRef<HTMLSpanElement>(null)
  const pct = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const wrap = root.current!
    let raf = 0
    let cancelled = false
    let started = 0
    let lifting = false
    let W = 0
    let H = 0
    let dpr = 1
    let fs = 0
    let cx = 0
    let cy = 0
    let parts: P[] = []
    let chips: Chip[] = []
    const family = getComputedStyle(document.body).fontFamily
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const lockRaf = requestAnimationFrame(() => lockScroll())

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      cv.width = W * dpr
      cv.height = H * dpr
      cv.style.width = `${W}px`
      cv.style.height = `${H}px`
      fs = Math.min((W * 0.84) / 3.7, 210)
      cx = W / 2
      cy = H / 2 - fs * 0.04
      // Wort auf Hilfsfläche setzen und Punkte darauf abtasten
      const off = document.createElement('canvas')
      off.width = Math.ceil(W)
      off.height = Math.ceil(H)
      const o = off.getContext('2d', { willReadFrequently: true })!
      o.font = `700 ${fs}px ${family}`
      if ('letterSpacing' in o) (o as unknown as { letterSpacing: string }).letterSpacing = `${-0.045 * fs}px`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillStyle = '#fff'
      o.fillText('DaSense', cx, cy)
      const gap = Math.max(3, Math.round(fs / 36))
      const data = o.getImageData(0, 0, off.width, off.height).data
      const pts: P[] = []
      const diag = Math.hypot(W, H)
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          if (data[(y * off.width + x) * 4 + 3] < 128) continue
          const a = Math.random() * Math.PI * 2
          const r = diag * (0.25 + Math.random() * 0.45)
          pts.push({
            x0: cx + Math.cos(a) * r,
            y0: cy + Math.sin(a) * r * 0.75,
            x,
            y,
            // von links nach rechts, mit Streuung: das Wort baut sich wie ein Scan auf
            d: ((x - (cx - fs * 1.8)) / (fs * 3.6)) * 0.85 + Math.random() * 0.45,
            t: 0.9 + Math.random() * 0.7,
            ph: Math.random() * 6.28,
          })
        }
      }
      parts = pts
      const near = pts.length ? pts : [{ x: cx, y: cy } as P]
      chips = TAGS.map((label, i) => {
        const side = i % 4
        const edge = [
          [Math.random() * W, -40],
          [W + 60, Math.random() * H],
          [Math.random() * W, H + 40],
          [-60, Math.random() * H],
        ][side]
        const tp = near[Math.floor(Math.random() * near.length)]
        return { label, x0: edge[0], y0: edge[1], x: tp.x, y: tp.y, d: 0.05 + (i / TAGS.length) * 1.1, t: 1.0 + Math.random() * 0.6 }
      })
    }

    const draw = (now: number) => {
      if (cancelled) return
      if (!started) started = now
      const s = (now - started) / 1000
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Punkte
      const size = Math.max(1.6, (Math.max(3, Math.round(fs / 36))) * 0.62)
      const fly: P[] = []
      const set: P[] = []
      for (const p of parts) {
        const e = easeOut(clamp((s - p.d) / p.t))
        const w = (1 - e) * 14
        const px = p.x0 + (p.x - p.x0) * e + Math.sin(s * 3 + p.ph) * w
        const py = p.y0 + (p.y - p.y0) * e + Math.cos(s * 2.6 + p.ph) * w
        const item = { ...p, x0: px, y0: py, ph: e } as P
        ;(e >= 0.999 ? set : fly).push(item)
      }
      const solid = clamp((s - ASSEMBLE) / 0.45)
      ctx.fillStyle = 'rgba(190,150,205,0.85)'
      for (const p of fly) ctx.fillRect(p.x0, p.y0, size, size)
      ctx.fillStyle = `rgba(255,255,255,${1 - solid})`
      if (solid < 1) for (const p of set) ctx.fillRect(p.x0, p.y0, size, size)

      // Dateikürzel: fliegen ein und werden vom Wort aufgenommen
      ctx.font = '500 11px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const c of chips) {
        const e = easeOut(clamp((s - c.d) / c.t))
        if (e <= 0 || e >= 1) continue
        const x = c.x0 + (c.x - c.x0) * e
        const y = c.y0 + (c.y - c.y0) * e
        const sc = 1 - 0.75 * Math.pow(e, 3)
        const a = (1 - Math.pow(e, 6)) * 0.95
        const w = 46 * sc
        const h = 22 * sc
        ctx.globalAlpha = a
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 6 * sc)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = '#fff'
        ctx.font = `500 ${11 * sc}px ui-monospace, SFMono-Regular, Menlo, monospace`
        ctx.fillText(c.label, x, y + 0.5)
      }
      ctx.globalAlpha = 1

      // Wort scharf
      if (solid > 0) {
        ctx.font = `700 ${fs}px ${family}`
        if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${-0.045 * fs}px`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = `rgba(255,255,255,${solid})`
        ctx.fillText('DaSense', cx, cy)
        if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px'
      }

      // Zähler
      const k = easeOut(clamp((s - 0.1) / (ASSEMBLE - 0.1)))
      if (docs.current) docs.current.textContent = fmt(DOCS * k)
      if (pct.current) pct.current.textContent = String(Math.round(100 * k)).padStart(3, '0')

      if (s >= ASSEMBLE + HOLD && !lifting) {
        lifting = true
        releaseIntro()
        wrap
          .animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { duration: LIFT, easing: EASE, fill: 'forwards' })
          .finished.then(() => {
            if (cancelled) return
            markIntroSeen()
            document.documentElement.style.overflow = prevOverflow
            unlockScroll()
            onDone()
          })
          .catch(() => {})
      }
      raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (cancelled) return
      setup()
      raf = requestAnimationFrame(draw)
    }
    void document.fonts.load(`700 100px ${family}`, 'DaSense').then(start, start)
    const onResize = () => {
      if (!lifting && parts.length) setup()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(lockRaf)
      window.removeEventListener('resize', onResize)
      document.documentElement.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[80] bg-[#0b0a0e] text-white select-none">
      <canvas ref={canvas} className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 box-border mx-auto flex max-w-[1240px] 2xl:max-w-[1400px] items-end justify-between px-5 sm:px-8 lg:px-12 pb-7 sm:pb-9 text-[0.75rem] font-medium tracking-[0.12em] uppercase text-white/55 tabular-nums">
        <div>
          <div>Dokumente erfasst</div>
          <div className="mt-1.5 text-[1.125rem] sm:text-[1.375rem] tracking-[-0.01em] normal-case text-white"><span ref={docs}>0</span></div>
        </div>
        <div className="text-right">
          <div>Index</div>
          <div className="mt-1.5 text-[1.125rem] sm:text-[1.375rem] tracking-[-0.01em] normal-case text-white"><span ref={pct}>000</span> %</div>
        </div>
      </div>
    </div>
  )
}
