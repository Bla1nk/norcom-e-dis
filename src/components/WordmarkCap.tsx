// Großes Wortzeichen am Ende des Inhalts, direkt vor dem Reveal-Footer (wie bei apexcollection.de).
export function WordmarkCap({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`overflow-hidden bg-white rounded-b-[2.5rem] pt-10 lg:pt-16 pb-5 sm:pb-8 lg:pb-12 px-4 sm:px-8 text-center select-none ${className}`}>
      <div className="text-[clamp(4.5rem,17vw,16rem)] leading-[0.9] tracking-[-0.055em] font-bold text-ink">DaSense</div>
    </div>
  )
}
