import type { ReactNode } from 'react'
import { t } from '../lib/i18n'

export type Usp = { num: string; title: string; text: string; icon: ReactNode }

const uspIconProps = {
  width: 36,
  height: 36,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#601571',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export const USPS: Usp[] = [
  {
    num: '01',
    title: t('Maximale Datensouveränität. Ohne KI-Kompromisse.', 'Maximum data sovereignty. No AI compromises.'),
    text: t('Sie nutzen leistungsfähige KI und bestimmen selbst, wo Ihre Daten und KI-Modelle verarbeitet werden.', 'You use powerful AI and decide for yourself where your data and AI models are processed.'),
    icon: (
      <svg {...uspIconProps}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    num: '02',
    title: t('Finden, wonach niemand gesucht hat.', 'Find what nobody was looking for.'),
    text: t('Die KI versteht Inhalte statt nur Stichworte. So stoßen Sie auch auf Hinweise, für die Ihnen die passenden Suchbegriffe fehlen.', 'The AI understands content, not just keywords. So you also uncover leads you would not have known the right search terms for.'),
    icon: (
      <svg {...uspIconProps}>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
  {
    num: '03',
    title: t('Weniger Review. Mehr Erkenntnisse. Jederzeit nachvollziehbar.', 'Less review. More insight. Always traceable.'),
    text: t('KI-Analysen reduzieren manuelle Prüfarbeit. Jeder Verarbeitungsschritt wird dokumentiert, jedes Ergebnis bleibt prüfbar.', 'AI analysis reduces manual review work. Every processing step is documented and every result stays verifiable.'),
    icon: (
      <svg {...uspIconProps}>
        <path d="M12 3 3 8l9 5 9-5-9-5z" />
        <path d="m3 13 9 5 9-5" />
        <path d="m3 17.5 9 5 9-5" />
      </svg>
    ),
  },
]

export const USP_INTRO = {
  eyebrow: t('Warum DaSense', 'Why DaSense'),
  heading: t('Mehr finden. Weniger prüfen. Datenhoheit behalten.', 'Find more. Review less. Keep control of your data.'),
  text: t('DaSense kombiniert intelligente Datenanalyse, automatisierte Untersuchungen und souveräne KI-Verarbeitung. So finden Sie schneller relevante Informationen, reduzieren manuelle Prüfarbeit und behalten jederzeit die Kontrolle.', 'DaSense combines intelligent data analysis, automated investigations and sovereign AI processing. So you find relevant information faster, cut down manual review work and stay in control at all times.'),
}
