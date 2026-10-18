'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import { type Residence, residences } from '@/lib/site-data'
import { Eyebrow, RevealText } from './motion-primitives'
import { ResidenceDrawer } from './residence-drawer'

function ResidenceCard({
  residence,
  index,
  priceLabel,
  onOpen,
}: {
  residence: Residence
  index: number
  priceLabel: string
  onOpen: () => void
}) {
  return (
    <article className="group w-[82vw] shrink-0 snap-start sm:w-[60vw] lg:w-[min(38vw,46vh)]">
      <button
        type="button"
        onClick={onOpen}
        data-cursor="View"
        className="block w-full text-left"
        aria-label={`View details for ${residence.name}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[52vh]">
          <Image
            src={residence.images[0].src}
            alt={residence.images[0].alt}
            fill
            sizes="(min-width: 1024px) 38vw, 82vw"
            className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 font-serif text-sm italic text-ivory/80">No. 0{index + 1}</span>
          <span className="absolute right-5 top-5 bg-ink/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-ivory backdrop-blur-md">
            {residence.view}
          </span>
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
            <p className="text-sm text-sand">
              from <span className="font-serif text-3xl text-ivory">{priceLabel}</span> / night
            </p>
            <span className="flex size-12 items-center justify-center rounded-full border border-ivory/40 text-ivory transition-all duration-500 group-hover:rotate-45 group-hover:border-bronze group-hover:bg-bronze group-hover:text-ink">
              <ArrowUpRight className="size-5" />
            </span>
          </div>
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-serif text-3xl font-light text-ivory md:text-4xl">{residence.name}</h3>
            <p className="mt-1 text-sm italic text-stone">{residence.tagline}</p>
          </div>
          <p className="shrink-0 pt-2 text-right text-[11px] uppercase leading-relaxed tracking-[0.2em] text-stone">
            {residence.size}
            <br />
            {residence.guests} guests
          </p>
        </div>
      </button>
    </article>
  )
}

export function Residences({ priceLabel }: { priceLabel: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [active, setActive] = useState<Residence | null>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const desktop = window.matchMedia('(min-width: 1024px)').matches
      setDistance(desktop ? Math.max(0, track.scrollWidth - window.innerWidth) : 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      ref={sectionRef}
      id="residences"
      aria-labelledby="residences-title"
      className="relative bg-ink"
      style={{ height: distance ? `calc(100vh + ${distance}px)` : undefined }}
    >
      <div className={distance ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : 'py-28'}>
        <div className="mx-auto mb-12 flex w-full max-w-[1600px] flex-wrap items-end justify-between gap-6 px-5 md:px-10 lg:mb-14">
          <div>
            <Eyebrow className="mb-6 text-bronze">Rooms & Suites</Eyebrow>
            <RevealText
              text={'Three residences,\none *address*.'}
              className="font-serif text-5xl font-light leading-none text-ivory md:text-7xl"
            />
            <span id="residences-title" className="sr-only">
              Residences
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-stone">
            Each residence is individually restored with its own character. Select one to explore the details.
          </p>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x: distance ? x : 0 }}
          className={
            distance
              ? 'flex gap-8 px-10'
              : 'no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 md:gap-8 md:px-10'
          }
        >
          {residences.map((r, i) => (
            <ResidenceCard key={r.id} residence={r} index={i} priceLabel={priceLabel} onOpen={() => setActive(r)} />
          ))}
          <div className="flex w-[70vw] shrink-0 snap-start flex-col justify-center border border-ivory/10 p-10 sm:w-[40vw] lg:w-[26vw]">
            <p className="font-serif text-3xl font-light italic leading-snug text-ivory">
              Planning a longer stay or travelling as a family?
            </p>
            <p className="mt-4 text-sm text-stone">Monthly and multi-residence rates on request.</p>
            <a
              href="#contact"
              className="mt-8 self-start border-b border-bronze pb-1 text-[11px] uppercase tracking-[0.28em] text-bronze transition-colors hover:text-ivory"
            >
              Speak with the host
            </a>
          </div>
        </motion.div>

        {distance > 0 && (
          <div className="mx-auto mt-12 w-full max-w-[1600px] px-10">
            <div className="h-px w-full bg-ivory/10">
              <motion.div style={{ width: progress }} className="h-full bg-bronze" />
            </div>
          </div>
        )}
      </div>

      <ResidenceDrawer
        key={active?.id ?? 'closed'}
        residence={active}
        priceLabel={priceLabel}
        onClose={() => setActive(null)}
        onReserve={() => {
          setActive(null)
          window.setTimeout(() => {
            document.getElementById('check-in')?.focus()
            document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }, 100)
        }}
      />
    </section>
  )
}
