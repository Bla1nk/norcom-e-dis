export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="box-border max-w-[1440px] mx-auto px-8 lg:px-12 py-6 flex items-center">
        <a
          href="https://www.norcom.de"
          className="font-bold text-[1.5rem] tracking-[-0.02em] text-accent no-underline"
        >
          norcom
        </a>
      </div>
    </header>
  )
}
