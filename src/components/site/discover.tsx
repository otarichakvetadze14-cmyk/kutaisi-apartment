'use client'

import { ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Eyebrow, Reveal, RevealText } from './motion-primitives'

type Language = 'ge' | 'en'

type Destination = {
  title: Record<Language, string>
  description: Record<Language, string>
  distance: Record<Language, string>
  imagePath: string
  locationUrl: string
}

export function Discover({
  destinations,
  language,
  text,
}: {
  destinations: readonly Destination[]
  language: Language
  text: Record<string, string>
}) {
  const [active, setActive] = useState<number | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 150, damping: 20 })
  const y = useSpring(my, { stiffness: 150, damping: 20 })

  return (
    <section id="discover" aria-labelledby="discover-title" className="relative bg-ivory py-28 text-ink md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow className="mb-6 text-ink/60">{text.discoverEyebrow}</Eyebrow>
            <RevealText
              text={text.discoverTitle}
              className="font-serif text-5xl font-light leading-none md:text-7xl"
            />
            <span id="discover-title" className="sr-only">
              {text.discoverEyebrow}
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/65 md:justify-self-end">
            {text.discoverDescription}
          </p>
        </div>

        <ul
          className="relative border-t border-ink/15"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            mx.set(e.clientX - rect.left)
            my.set(e.clientY - rect.top)
          }}
          onPointerLeave={() => setActive(null)}
        >
          {destinations.map((d, i) => (
            <li key={d.title.en}>
              <Reveal delay={i * 0.05} y={20}>
                <a
                  href={d.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-ink/15 py-6 md:grid-cols-[80px_1fr_1fr_160px_auto] md:gap-8 md:py-9"
                >
                  <span className="font-serif text-sm italic text-ink/50">0{i + 1}</span>
                  <span className="font-serif text-3xl font-light transition-all duration-500 group-hover:translate-x-3 group-hover:italic md:text-5xl">
                    {d.title[language]}
                  </span>
                    <span className="hidden text-sm text-ink/60 md:block">{d.description[language]}</span>
                  <span className="hidden text-right text-[11px] uppercase tracking-[0.2em] text-ink/60 md:block">
                      {d.distance[language]}
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
                    <ArrowUpRight className="size-4" />
                    <span className="sr-only">
                      {text.openInMaps}: {d.title[language]} ({language === 'ge' ? 'იხსნება ახალ ჩანართში' : 'opens in a new tab'})
                    </span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}

          <motion.div
            style={{ x, y }}
            className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
            aria-hidden="true"
          >
            <AnimatePresence>
              {active !== null && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative -ml-40 -mt-56 h-[260px] w-[200px] overflow-hidden lg:-ml-48 lg:h-[320px] lg:w-[250px]"
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={active}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={destinations[active].imagePath}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 250px, 200px"
                        unoptimized
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </ul>

        <div className="mt-16 grid grid-cols-3 gap-3 md:hidden">
          {destinations.slice(0, 3).map((d) => (
            <div key={d.title.en} className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={d.imagePath}
                alt={d.title[language]}
                fill
                sizes="33vw"
                unoptimized
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
