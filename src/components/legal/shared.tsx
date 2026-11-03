import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { t } from '../../lib/i18n'

/** Fläche unter dem Text eines Abschnitts (wie bei „So funktioniert es“). */
export function Surface({ children, tone = 'mist' }: { children: ReactNode; tone?: 'mist' | 'dark' | 'grid' }) {
  const bg = tone === 'dark' ? 'dot-grid-dark' : tone === 'grid' ? 'dot-grid-light' : 'bg-[#f7f4f8]'
  return <div className={`border-t border-line ${bg} px-5 sm:px-8 lg:px-14 py-12 lg:py-16`}>{children}</div>
}

const BASE_TABS = ['Smart Filter', 'AI Report', t('Entitäten', 'Entities'), t('Verträge', 'Contracts')]

/** Fenster im Stil der DaSense-App; `tab` ist der aktive Reiter. Ist es keine der Standard-Apps, steht die eigene App an zweiter Stelle. */
export function AppWindow({ tab, title, children }: { tab: string; title: string; children: ReactNode }) {
  const TABS = BASE_TABS.includes(tab) ? BASE_TABS : [BASE_TABS[0], tab, ...BASE_TABS.slice(1)]
  return (
    <div className="rounded-xl bg-white ring-1 ring-black/5 shadow-[0_24px_60px_-24px_rgba(40,10,50,0.35)] overflow-hidden text-[0.8125rem]">
      <div className="flex items-center gap-1.5 px-4 h-9 bg-[#f4f1f5] border-b border-line">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto text-[0.75rem] text-muted">{title} · DaSense</span>
        <span className="w-12" />
      </div>
      <div className="flex items-center gap-1 px-3 h-11 border-b border-line overflow-x-auto no-scrollbar">
        <span className="px-2 text-[0.6875rem] font-medium tracking-[0.1em] uppercase text-muted whitespace-nowrap">Enterprise AI</span>
        {TABS.map((tb) => (
          <span
            key={tb}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${tb === tab ? 'bg-primary-tint text-primary font-medium ring-1 ring-primary/20' : 'text-body'}`}
          >
            {tb}
          </span>
        ))}
      </div>
      {children}
    </div>
  )
}

/** Wird wahr, sobald das Element zu 35 % sichtbar ist (für Einlauf-Animationen). */
export function useSeen<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, seen }
}
