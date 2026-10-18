import { cn } from '@/lib/utils'
import { Eyebrow, ParallaxImage, Reveal, RevealText } from './motion-primitives'

type Language = 'ge' | 'en'

type Restaurant = {
  title: Record<Language, string>
  cuisine: Record<Language, string>
  addressUrl: string
}

const chapters = [
  {
    numeral: 'I',
    kicker: 'The Ritual',
    title: 'Slow mornings,\n*restorative* evenings.',
    body: 'Deep travertine tubs, rain showers and linen robes. On request, our host arranges an in-residence massage with a local therapist, or a private visit to the sulphur baths of nearby Tskaltubo.',
    image: '/images/redesign/ritual.webp',
    alt: 'Travertine bathtub lit by candles',
    detail: '/images/redesign/detail.webp',
    detailAlt: 'Morning coffee by the window',
    list: ['In-residence massage', 'Tskaltubo spa transfers', 'Organic bath amenities'],
  },
  {
    numeral: 'II',
    kicker: 'The Table',
    title: 'The flavours\nof *Imereti*.',
    body: 'Imeretian khachapuri, pkhali and amber wine aged in clay qvevri. We welcome every guest with a bottle from a family winery, and keep a hand-written list of the tables locals love most.',
    image: '/images/redesign/dining.webp',
    alt: 'Imeretian feast with khachapuri and qvevri wine',
    detail: '/images/redesign/suite-living.webp',
    detailAlt: 'Salon with a carafe of wine',
    list: null,
  },
]

export function Experiences({ restaurants, language }: { restaurants: readonly Restaurant[]; language: Language }) {
  return (
    <section id="experiences" aria-labelledby="experiences-title" className="relative bg-ink-soft py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-24 text-center md:mb-32">
          <Reveal>
            <Eyebrow className="justify-center text-bronze">Experiences</Eyebrow>
          </Reveal>
          <RevealText
            as="h2"
            text={'Beyond the *stay*.'}
            className="mt-6 font-serif text-5xl font-light text-ivory md:text-8xl"
          />
          <span id="experiences-title" className="sr-only">
            Experiences
          </span>
        </div>

        <div className="flex flex-col gap-32 md:gap-48">
          {chapters.map((c, i) => {
            const flip = i % 2 === 1
            return (
              <article key={c.kicker} className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
                <div className={cn('relative md:col-span-7', flip && 'md:order-2 md:col-start-6')}>
                  <ParallaxImage src={c.image} alt={c.alt} sizes="(min-width: 768px) 58vw, 100vw" className="aspect-[5/4]" />
                  <ParallaxImage
                    src={c.detail}
                    alt={c.detailAlt}
                    sizes="(min-width: 768px) 20vw, 40vw"
                    strength={20}
                    className={cn(
                      'absolute -bottom-12 aspect-[3/4] w-[38%] border-8 border-ink-soft md:-bottom-20',
                      flip ? '-left-2 md:-left-12' : '-right-2 md:-right-12',
                    )}
                  />
                </div>

                <div className={cn('md:col-span-4', flip ? 'md:order-1 md:col-start-1' : 'md:col-start-9')}>
                  <Reveal>
                    <p className="font-serif text-7xl font-light italic text-bronze/40 md:text-8xl" aria-hidden="true">
                      {c.numeral}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.32em] text-bronze">{c.kicker}</p>
                  </Reveal>
                  <RevealText
                    as="h3"
                    text={c.title}
                    className="mt-6 font-serif text-4xl font-light leading-[1.05] text-ivory md:text-5xl"
                  />
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-pretty leading-relaxed text-sand">{c.body}</p>
                    {c.list ? (
                      <ul className="mt-8 flex flex-col border-t border-border">
                        {c.list.map((item) => (
                          <li key={item} className="flex items-center justify-between border-b border-border py-4 text-sm text-ivory">
                            {item}
                            <span className="size-1.5 rounded-full bg-bronze" aria-hidden="true" />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="mt-8 flex flex-col border-t border-border">
                        {restaurants.map((r) => (
                          <li key={r.title.en} className="flex items-baseline justify-between gap-4 border-b border-border py-4">
                            <a href={r.addressUrl} target="_blank" rel="noopener noreferrer" className="font-serif text-2xl text-ivory">
                              {r.title[language]}
                            </a>
                            <span className="text-right text-xs text-stone">{r.cuisine[language]}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Reveal>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
