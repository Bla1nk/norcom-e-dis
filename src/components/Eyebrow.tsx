import type { ReactNode } from 'react'

type EyebrowProps = {
  children: ReactNode
  /** Textfarbe als Tailwind-Klasse; Standard ist die Akzentfarbe. */
  colorClass?: string
}

export function Eyebrow({ children, colorClass = 'text-accent' }: EyebrowProps) {
  return (
    <div className={`text-[0.8125rem] font-medium tracking-[0.12em] uppercase ${colorClass}`}>
      {children}
    </div>
  )
}

export const sectionHeadingClass =
  'm-0 text-primary text-[clamp(2rem,3.4vw,2.875rem)] leading-[1.12] tracking-[-0.02em] font-bold'

export const containerClass = 'max-w-[1200px] mx-auto px-8'
