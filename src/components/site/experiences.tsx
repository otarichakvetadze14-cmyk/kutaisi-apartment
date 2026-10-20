import Image from 'next/image'
import { Eyebrow, Reveal, RevealText } from './motion-primitives'

type Language = 'ge' | 'en'

type Restaurant = {
  imagePath: string
  title: Record<Language, string>
  cuisine: Record<Language, string>
  addressUrl: string
}

export function Experiences({
  restaurants,
  language,
  text,
}: {
  restaurants: readonly Restaurant[]
  language: Language
  text: Record<string, string>
}) {
  return (
    <section id="experiences" aria-labelledby="experiences-title" className="relative bg-ink-soft py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-24 text-center md:mb-32">
          <Reveal>
            <Eyebrow className="justify-center text-bronze">{text.restaurantsEyebrow}</Eyebrow>
          </Reveal>
          <RevealText
            as="h2"
            text={text.restaurantsTitle}
            className="mt-6 font-serif text-5xl font-light text-ivory md:text-8xl"
          />
          <span id="experiences-title" className="sr-only">
            {text.restaurantsTitle}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.map((restaurant, index) => (
            <Reveal key={restaurant.title.en} delay={index * 0.08}>
              <a
                href={restaurant.addressUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ivory/10">
                  <Image
                    src={restaurant.imagePath}
                    alt={restaurant.title[language]}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-5 font-serif text-2xl text-ivory">{restaurant.title[language]}</h3>
                <p className="mt-1 text-sm text-stone">{restaurant.cuisine[language]}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
