import { contact } from '@/lib/site-data'
import { Eyebrow, ParallaxImage, Reveal, RevealText } from './motion-primitives'

const facts = [
  { value: '01', unit: 'min', label: 'Walk to the Colchis Fountain' },
  { value: '15', unit: 'min', label: 'From Kutaisi International Airport' },
  { value: contact.checkIn, unit: '', label: 'Check-in, with a personal welcome' },
  { value: '24', unit: '/7', label: 'Host on call via WhatsApp' },
]

export function Intro() {
  return (
    <section className="relative bg-ivory text-ink" aria-labelledby="intro-title">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <Eyebrow className="text-ink/60">The House</Eyebrow>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <RevealText
              text={'A private address on the oldest square of Georgia’s oldest city — where *quiet* luxury is measured in light, timber and time.'}
              className="text-balance font-serif text-4xl font-light leading-[1.1] md:text-6xl lg:text-7xl"
            />
            <span id="intro-title" className="sr-only">
              About the residence
            </span>
          </div>
        </div>

        <div className="mt-24 grid items-end gap-10 md:mt-32 md:grid-cols-12">
          <ParallaxImage
            src="/images/redesign/suite-living.webp"
            alt="The salon with velvet sofa and ornate plaster ceiling"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] md:col-span-6"
          />
          <div className="flex flex-col gap-10 md:col-span-5 md:col-start-8">
            <ParallaxImage
              src="/images/redesign/detail.webp"
              alt="Morning coffee on a marble windowsill above the square"
              sizes="(min-width: 768px) 35vw, 100vw"
              strength={18}
              className="aspect-square w-3/4 self-end"
            />
            <Reveal>
              <p className="max-w-md text-pretty text-base leading-relaxed text-ink/70">
                Behind a 19th-century façade on Central Square, our residences are restored with oak, linen and stone. Mornings
                begin with espresso on the windowsill; evenings end with Imeretian wine as the fountain turns to gold.
              </p>
            </Reveal>
          </div>
        </div>

        <dl className="mt-24 grid grid-cols-2 border-t border-ink/15 md:mt-32 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08} className="border-b border-ink/15 py-8 pr-6 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <p className="font-serif text-6xl font-light md:text-7xl">
                  {f.value}
                  <span className="text-2xl italic text-bronze">{f.unit}</span>
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/60">{f.label}</p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
