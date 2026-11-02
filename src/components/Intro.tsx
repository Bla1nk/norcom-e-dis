import { useEffect, useRef } from 'react'
import { markIntroSeen, releaseIntro } from '../lib/intro'
import { lockScroll, unlockScroll } from '../lib/lenis'

// Konzept „Data Assembly“: Verstreute Datenpunkte und Dateikürzel fliegen ein und setzen sich zum Wort „DaSense“
// zusammen, während die Zähler hochlaufen. Dann wird das Wort scharf, und die schwarze Fläche zieht nach oben weg.
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const ASSEMBLE = 2.4 // Sekunden bis alles sitzt
const POUR = 3.05 // Sekunden: Wort löst sich auf, Punkte strömen ins Demo-Video, Vorhang zieht weg
const LIFT = 1000 // ms Wegziehen
const SWEEP_AT = 1.3 // Sekunden nach POUR: Scan über das Video
const END = 2.7 // Sekunden nach POUR: Intro entfernen
const DOCS = 1284503
const TAGS = ['PDF', 'MSG', 'XLSX', 'EML', 'DOCX', 'PST', 'ZIP', 'JPG', 'PPTX', 'CSV', 'TXT', 'WAV', 'HTML', 'MP4', 'RTF', 'XML']

type P = { x0: number; y0: number; x: number; y: number; d: number; t: number; ph: number; vx: number; vy: number; pd: number; pt: number; cx: number; cy: number; e: number }
type Chip = { label: string; x0: number; y0: number; x: number; y: number; d: number; t: number }

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const easeOut = (v: number) => 1 - Math.pow(1 - v, 4)
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE')

export function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const fx = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const docs = useRef<HTMLSpanElement>(null)
  const pct = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const wrap = panel.current!
    const fxEl = fx.current!
    let poured = false
    let swept = false
    let tgt = { l: 0, t: 0, w: 0, h: 0 }
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

    // Endlage des Demo-Videos (Hero schiebt es beim Einstieg noch nach unten; die aktuelle Verschiebung rechnen wir heraus)
    const measure = () => {
      const v = document.querySelector('video.m1-hero-video') as HTMLElement | null
      const box = v?.parentElement as HTMLElement | null
      const r = v?.getBoundingClientRect()
      if (!r || !box) return { l: W * 0.1, t: H * 0.7, w: W * 0.8, h: H * 0.25 }
      const tf = getComputedStyle(box).transform
      const shift = tf && tf !== 'none' ? new DOMMatrix(tf).m42 : 0 // aktuelle Verschiebung, auch mitten in der Animation
      const top = r.top - shift
      const t = Math.min(Math.max(top, 0), H - 120)
      const b = Math.min(top + r.height, H - 14)
      return { l: r.left, t, w: r.width, h: Math.max(80, b - t) }
    }

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
      tgt = measure()
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
            vx: tgt.l + 12 + Math.random() * Math.max(10, tgt.w - 24),
            vy: tgt.t + 12 + Math.random() * Math.max(10, tgt.h - 24),
            pd: ((x - (cx - fs * 1.8)) / (fs * 3.6)) * 0.55 + Math.random() * 0.25,
            pt: 0.9 + Math.random() * 0.5,
            cx: 0,
            cy: 0,
            e: 0,
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

    // Scan über das Video: Linie läuft von oben nach unten, dahinter ein violetter Schweif, am Ende ein Rahmen-Impuls
    const sweep = () => {
      const m = measure()
      const box = document.createElement('div')
      box.style.cssText = `position:fixed;left:${m.l}px;top:${m.t}px;width:${m.w}px;height:${m.h}px;overflow:hidden;border-radius:12px;pointer-events:none`
      const trail = document.createElement('div')
      trail.style.cssText = 'position:absolute;left:0;right:0;top:-140px;height:140px;background:linear-gradient(to bottom,rgba(96,21,113,0),rgba(96,21,113,0.16))'
      const bar = document.createElement('div')
      bar.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg,transparent,#601571 20%,#c79ad6 50%,#601571 80%,transparent);box-shadow:0 0 28px 6px rgba(96,21,113,0.35)'
      trail.appendChild(bar)
      const ring = document.createElement('div')
      ring.style.cssText = 'position:absolute;inset:0;border-radius:12px;box-shadow:inset 0 0 0 2px rgba(96,21,113,0.55);opacity:0'
      box.append(trail, ring)
      fxEl.appendChild(box)
      const run = { duration: 1000, easing: 'cubic-bezier(0.45, 0, 0.25, 1)', fill: 'forwards' as const }
      trail.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${m.h + 140}px)` }], run)
      ring.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 1300, fill: 'forwards' })
    }

    const draw = (now: number) => {
      if (cancelled) return
      if (!started) started = now
      const s = (now - started) / 1000
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Punkte: erst zum Wort, dann (POUR) ins Demo-Video
      const size = Math.max(1.6, Math.max(3, Math.round(fs / 36)) * 0.62)
      const solid = clamp((s - ASSEMBLE) / 0.45)
      const leave = clamp((s - POUR) / 0.2) // Wort wird wieder zu Punkten
      const pouring = s >= POUR
      const smooth = (v: number) => v * v * (3 - 2 * v)
      for (const p of parts) {
        if (!pouring) {
          const e = easeOut(clamp((s - p.d) / p.t))
          const w = (1 - e) * 14
          p.cx = p.x0 + (p.x - p.x0) * e + Math.sin(s * 3 + p.ph) * w
          p.cy = p.y0 + (p.y - p.y0) * e + Math.cos(s * 2.6 + p.ph) * w
          p.e = e
        } else {
          const u = clamp((s - POUR - p.pd) / p.pt)
          const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2
          p.cx = p.x + (p.vx - p.x) * e
          p.cy = p.y + (p.vy - p.y) * e
          p.e = u
        }
      }
      // Stapel 1: im Flug (hell, nach dem Abheben violett), Stapel 2: sitzend (weiß)
      ctx.fillStyle = 'rgba(190,150,205,0.85)'
      if (!pouring) for (const p of parts) if (p.e < 0.999) ctx.fillRect(p.cx, p.cy, size, size)
      if (!pouring) {
        ctx.fillStyle = `rgba(255,255,255,${1 - solid})`
        if (solid < 1) for (const p of parts) if (p.e >= 0.999) ctx.fillRect(p.cx, p.cy, size, size)
      } else {
        for (const p of parts) {
          if (p.e >= 1) continue
          const a = (1 - smooth(clamp((p.e - 0.82) / 0.18))) * (p.e <= 0 ? leave : 1)
          const k = p.e < 0.22 // erst weiß (noch auf Schwarz), dann violett (auf dem hellen Hero)
          ctx.fillStyle = k ? `rgba(255,255,255,${a})` : `rgba(96,21,113,${a})`
          const sz = size * (1 - 0.35 * smooth(p.e))
          ctx.fillRect(p.cx, p.cy, sz, sz)
        }
      }

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
      if (solid > 0 && leave < 1) {
        ctx.font = `700 ${fs}px ${family}`
        if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${-0.045 * fs}px`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = `rgba(255,255,255,${solid * (1 - leave)})`
        ctx.fillText('DaSense', cx, cy)
        if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px'
      }

      // Zähler
      const k = easeOut(clamp((s - 0.1) / (ASSEMBLE - 0.1)))
      if (docs.current) docs.current.textContent = fmt(DOCS * k)
      if (pct.current) pct.current.textContent = String(Math.round(100 * k)).padStart(3, '0')

      if (s >= POUR + 0.1 && !lifting) {
        lifting = true
        poured = true
        releaseIntro()
        // Der Vorhang zieht weg, die Punkte (Canvas) bleiben darüber und strömen weiter ins Video
        wrap
          .animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { duration: LIFT, easing: EASE, fill: 'forwards' })
          .finished.then(() => {
            if (cancelled) return
            document.documentElement.style.overflow = prevOverflow
            unlockScroll()
          })
          .catch(() => {})
      }
      if (poured && !swept && s >= POUR + SWEEP_AT) {
        swept = true
        sweep()
      }
      if (s >= POUR + END) {
        markIntroSeen()
        onDone()
        return
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
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[80] text-white select-none pointer-events-none">
      <div ref={panel} className="absolute inset-0 bg-[#0b0a0e] pointer-events-auto">
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
      <canvas ref={canvas} className="absolute inset-0" />
      <div ref={fx} className="absolute inset-0" />
    </div>
  )
}
