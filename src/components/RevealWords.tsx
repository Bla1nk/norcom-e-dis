import { Fragment } from 'react'

type RevealWordsProps = { text: string }

// Zerlegt den Text in Wörter mit Maske. Die Animation steuert useHeroReveal über .word-inner.
export function RevealWords({ text }: RevealWordsProps) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.13em] -mb-[0.13em]">
            <span className="word-inner inline-block">{word}</span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </>
  )
}
