'use client'

import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { testimonials } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { Eyebrow, ease } from './motion-primitives'

const DURATION = 8000

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % testimonials.length), DURATION)
    return () => window.clearTimeout(t)
  }, [index, paused])

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length)
  const t = testimonials[index]

  return (
    <section
      aria-labelledby="testimonials-title"
      aria-roledescription="carousel"
      className="grain relative overflow-hidden bg-ink py-28 md:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Image src="/images/redesign/hero.webp" alt="" fill sizes="100vw" className="object-cover opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-10">
        <Eyebrow className="justify-center text-bronze">Guest Voices</Eyebrow>
        <h2 id="testimonials-title" className="sr-only">
          What our guests say
        </h2>

        <div className="mt-10 flex justify-center gap-1 text-bronze" aria-label="Five star stay">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 fill-current" aria-hidden="true" />
          ))}
        </div>

        <div className="relative mt-10 min-h-[22rem] md:min-h-[18rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.9, ease }}
            >
              <blockquote className="text-balance font-serif text-3xl font-light italic leading-snug text-ivory md:text-5xl">
                {`“${t.quote}”`}
              </blockquote>
              <figcaption className="mt-10">
                <span className="block text-sm font-medium uppercase tracking-[0.25em] text-ivory">{t.name}</span>
                <span className="mt-1 block text-xs text-stone">{t.origin}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex size-11 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-bronze hover:text-bronze"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index}
                className="relative h-px w-14 overflow-hidden bg-ivory/20 py-2 bg-clip-content"
              >
                <span
                  key={`${index}-${paused}`}
                  className={cn(
                    'absolute inset-x-0 top-1/2 h-px origin-left bg-bronze',
                    i < index && 'scale-x-100',
                    i > index && 'scale-x-0',
                  )}
                  style={
                    i === index
                      ? { animation: paused ? 'none' : `progress ${DURATION}ms linear forwards`, transform: paused ? 'scaleX(1)' : undefined }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex size-11 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-bronze hover:text-bronze"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
      <style>{'@keyframes progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }'}</style>
    </section>
  )
}
