import type { ReactNode } from 'react'

// Gemeinsame Bausteine der Schritt-Abschnitte (Aufbau wie attio.com).

export function SubCard({ title, text, children, className = '' }: { title: string; text: string; children: ReactNode; className?: string }) {
  return (
    <div className={`px-8 lg:px-10 pt-12 pb-10 flex flex-col gap-10 ${className}`}>
      <p className="m-0 max-w-[24rem] text-[1.0625rem] leading-[1.4]">
        <span className="block text-ink font-medium">{title}</span>
        <span className="block text-muted/70">{text}</span>
      </p>
      <div className="flex-1 flex items-center justify-center min-h-[300px]">{children}</div>
    </div>
  )
}
