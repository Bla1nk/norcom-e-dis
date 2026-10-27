export function Footer() {
  return (
    <footer className="bg-ink text-footer-text">
      <div className="max-w-[1200px] mx-auto px-8 py-10 flex flex-wrap justify-between gap-4 text-[0.875rem]">
        <span>© 2026 NorCom Information Technology GmbH &amp; Co. KGaA</span>
        <div className="flex gap-6">
          <a href="https://www.norcom.de/impressum" className="text-white">
            Impressum
          </a>
          <a href="https://www.norcom.de/datenschutzerklaerung" className="text-white">
            Datenschutzerklärung
          </a>
        </div>
      </div>
    </footer>
  )
}
