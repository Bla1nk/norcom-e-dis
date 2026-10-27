# DaSense eDiscovery – Demoseite

Landingpage für DaSense eDiscovery (NorCom). React 19, TypeScript, Tailwind CSS 4, Vite, GSAP/Lenis.

## Entwickeln

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # Produktionsbuild nach dist/
pnpm lint
```

## Aufbau

- `src/components/Hero.tsx` – Einstieg mit ruhigem Arbeitsvideo der Plattform
- `src/components/Steps.tsx` – „So funktioniert es“: Collection, Processing (mit AI Navigator), Review, Analysis, Production
- `src/components/steps/` – Bilder, Kleinkarten und Animationen je Schritt
- `src/content/` – Texte der Schritte und USPs
- `public/videos/`, `public/images/` – Clips und Standbilder, gerendert mit dem Projekt App-Previews (Remotion)

Alle Inhalte zeigen den öffentlichen Enron-Datensatz; Zahlen und Abläufe sind illustrativ.

## Deployment (Vercel)

Vercel erkennt Vite automatisch: Build `pnpm build`, Ausgabe `dist`.
