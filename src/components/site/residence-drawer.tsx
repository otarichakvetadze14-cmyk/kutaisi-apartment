'use client'

import { ArrowRight, BedDouble, Eye, Maximize2, Users, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { Residence } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { ease } from './motion-primitives'

export function ResidenceDrawer({
  residence,
  priceLabel,
  onClose,
  onReserve,
}: {
  residence: Residence | null
  priceLabel: string
  onClose: () => void
  onReserve: () => void
}) {
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    if (!residence) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [residence, onClose])

  return (
    <AnimatePresence>
      {residence && (
        <motion.div key="drawer" className="fixed inset-0 z-[60]" initial="closed" animate="open" exit="closed">
          <motion.button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            variants={{ open: { x: 0 }, closed: { x: '100%' } }}
            transition={{ duration: 0.9, ease }}
            className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-ink-soft md:w-[min(720px,60vw)]"
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={imageIndex}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease }}
                  className="absolute inset-0"
                >
                  <Image
                    src={residence.images[imageIndex].src}
                    alt={residence.images[imageIndex].alt}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center rounded-full bg-ink/60 text-ivory backdrop-blur-md transition-colors hover:bg-ivory hover:text-ink"
              >
                <X className="size-5" />
              </button>
              <div className="absolute bottom-5 left-5 z-10 flex gap-2">
                {residence.images.map((img, i) => (
                  <button
                    key={img.src + i}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={i === imageIndex}
                    className={cn(
                      'relative size-14 overflow-hidden border-2 transition-all',
                      i === imageIndex ? 'border-bronze' : 'border-transparent opacity-60 hover:opacity-100',
                    )}
                  >
                    <Image src={img.src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6 md:p-12">
              <motion.div
                variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 20 } }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-bronze">{residence.tagline}</p>
                <h3 id="drawer-title" className="mt-4 font-serif text-5xl font-light text-ivory md:text-6xl">
                  {residence.name}
                </h3>
                <p className="mt-6 max-w-lg text-pretty leading-relaxed text-sand">{residence.description}</p>

                <dl className="mt-10 grid grid-cols-2 gap-px bg-ivory/10 sm:grid-cols-4">
                  {[
                    { icon: Maximize2, label: 'Size', value: residence.size },
                    { icon: Users, label: 'Guests', value: `Up to ${residence.guests}` },
                    { icon: BedDouble, label: 'Bed', value: residence.bed },
                    { icon: Eye, label: 'View', value: residence.view },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-ink-soft p-4">
                      <Icon className="size-4 text-bronze" aria-hidden="true" />
                      <dt className="mt-3 text-[10px] uppercase tracking-[0.25em] text-stone">{label}</dt>
                      <dd className="mt-1 text-sm text-ivory">{value}</dd>
                    </div>
                  ))}
                </dl>

                <h4 className="mt-10 text-[10px] uppercase tracking-[0.3em] text-stone">In the residence</h4>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-ivory">
                  {residence.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-3">
                      <span className="size-1 rounded-full bg-bronze" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8 md:mt-12">
                <p className="text-sm text-stone">
                  from <span className="font-serif text-4xl text-ivory">{priceLabel}</span> / night
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onReserve()
                  }}
                  className="group flex items-center gap-3 bg-bronze px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink transition-colors hover:bg-ivory"
                >
                  Reserve this residence
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
