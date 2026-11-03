import { useEffect, useState, type ReactNode } from 'react'

/** Zählt von 0 auf `to`, sobald `seen` wahr wird (Ease-out). Ohne Animation bei reduzierter Bewegung. */
export function Count({ to, seen, decimals = 0, prefix = '', suffix = '', dur = 1800 }: { to: number; seen: boolean; decimals?: number; prefix?: string; suffix?: string; dur?: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to, dur])
  return (
    <span className="tabular-nums">
      {prefix}
      {v.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

/** Fenster mit Titelleiste (ohne App-Reiter, damit die Referenz nicht als DaSense-Oberfläche erscheint). */
export function Win({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-black/5 shadow-[0_24px_60px_-24px_rgba(40,10,50,0.35)] overflow-hidden text-[0.8125rem]">
      <div className="flex items-center gap-1.5 px-4 h-9 bg-[#f4f1f5] border-b border-line">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto text-[0.75rem] text-muted">{title}</span>
        <span className="w-12" />
      </div>
      {children}
    </div>
  )
}

export function Kpi({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-white p-3.5">
      <div className="text-muted">{label}</div>
      <div className="mt-1 text-[1.375rem] leading-tight font-semibold tracking-[-0.01em]">{children}</div>
    </div>
  )
}

export const KpiGrid = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 py-5">{children}</div>

export const Section = ({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) => (
  <div className="border-t border-line px-5 pt-4 pb-5">
    <div className="mb-3 flex items-center justify-between gap-3">
      <span className="font-medium text-ink">{title}</span>
      {aside && <span className="text-muted">{aside}</span>}
    </div>
    {children}
  </div>
)

export const Illustrative = () => <div className="mt-3 text-right text-[0.6875rem] text-muted/70">Darstellung illustrativ</div>

export const motion = 'transition-all duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none'
