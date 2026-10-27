import { USPS, USP_INTRO } from '../content/usps'
import { Eyebrow, sectionHeadingClass } from './Eyebrow'

export function Usps() {
  return (
    <section aria-labelledby="usp-h">
      <div className="max-w-[1200px] mx-auto py-24 px-8 flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-[48rem]">
          <Eyebrow>{USP_INTRO.eyebrow}</Eyebrow>
          <h2 id="usp-h" className={sectionHeadingClass}>
            {USP_INTRO.heading}
          </h2>
          <p className="m-0 text-[1.125rem] text-body">{USP_INTRO.text}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 narrow:grid-cols-1">
          {USPS.map((usp) => (
            <div
              key={usp.num}
              className="min-w-0 border border-card-line rounded-xl p-8 grid row-span-3 grid-rows-subgrid gap-y-4 items-start"
            >
              <div className="flex items-center justify-between">
                {usp.icon}
                <span className="text-[0.875rem] text-muted">{usp.num}</span>
              </div>
              <h3 className="m-0 text-primary text-[1.5rem] font-semibold tracking-[-0.01em] not-supports-[grid-template-rows:subgrid]:min-h-[3.75em]">
                {usp.title}
              </h3>
              <p className="m-0 text-body">{usp.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
