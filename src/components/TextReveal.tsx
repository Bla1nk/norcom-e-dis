import { Fragment, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

/** Wird `true`, sobald das Element ins Bild kommt; mit `immediate` direkt nach dem Einhängen (für Inhalte am Seitenanfang). */
function useOn<T extends Element>(immediate: boolean) {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (immediate) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)))
      return () => cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [immediate])
  return { ref, on }
}

type TextRevealProps = {
  text: string
  as?: ElementType
  id?: string
  className?: string
  /** Verzögerung in ms bis zum ersten Wort */
  delay?: number
  /** Abstand zwischen den Wörtern in ms */
  stagger?: number
  /** Direkt starten statt erst beim Einscrollen */
  immediate?: boolean
  /** Kein eigener Auslöser: läuft, sobald ein übergeordnetes Reveal-Group-Element sichtbar ist */
  inherit?: boolean
}

// Überschrift, deren Wörter einzeln aus einer Maske nach oben laufen (Keyframes/Transition in index.css).
export function TextReveal({ text, as: Tag = 'span', id, className, delay = 0, stagger = 55, immediate = false, inherit = false }: TextRevealProps) {
  const { ref, on } = useOn<HTMLElement>(immediate)
  const words = text.split(' ')
  return (
    <Tag ref={ref} id={id} className={`${on && !inherit ? 'tr-on' : ''} ${className ?? ''}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.16em] -mb-[0.16em]">
            <span className="tr-word" style={{ transitionDelay: `${delay + i * stagger}ms` }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  immediate?: boolean
}

// Einblenden von unten für Fließtext, Buttons und Flächen.
export function Reveal({ children, as: Tag = 'div', className, delay = 0, immediate = false }: RevealProps) {
  const { ref, on } = useOn<HTMLElement>(immediate)
  return (
    <Tag ref={ref} className={`rv ${on ? 'tr-on' : ''} ${className ?? ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

// Gruppe: setzt tr-on, sobald sie ins Bild kommt; Kinder mit .rv-c, .line-draw oder <TextReveal inherit> laufen dann gestaffelt.
export function RevealGroup({ children, as: Tag = 'div', className }: { children: ReactNode; as?: ElementType; className?: string }) {
  const { ref, on } = useOn<HTMLElement>(false)
  return (
    <Tag ref={ref} className={`${on ? 'tr-on' : ''} ${className ?? ''}`}>
      {children}
    </Tag>
  )
}
