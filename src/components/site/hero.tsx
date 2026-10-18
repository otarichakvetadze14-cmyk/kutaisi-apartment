'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { BookingWidget } from './booking-widget'
import { ease, RevealText } from './motion-primitives'
import type { BookingWidgetProps } from './booking-widget'

export function Hero({ booking }: { booking: BookingWidgetProps }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} id="top" className="grain relative flex min-h-svh flex-col overflow-hidden">
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, delay: 1.2, ease }}
          className="absolute inset-0"
        >
          <Image
            src="/images/redesign/hero.webp"
            alt="The gilded Colchis Fountain on Kutaisi Central Square at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/50 to-transparent" aria-hidden="true" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 pb-10 pt-32 md:px-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7, ease }}
          className="mb-8 text-[11px] uppercase tracking-[0.4em] text-sand"
        >
          {booking.language === 'ge' ? 'კერძო რეზიდენცია · ქუთაისი, საქართველო' : 'A private residence · Kutaisi, Georgia'}
        </motion.p>
        <RevealText
          as="h1"
          animateOnMount
          delay={1.6}
          text={booking.language === 'ge' ? 'ქალაქის გულში,\nშენი *ისტორია* იწყება.' : 'In the heart of the city,\nyour *story* begins.'}
          className="max-w-5xl text-balance font-serif text-[13vw] font-light leading-[0.92] tracking-tight text-ivory sm:text-7xl md:text-[min(6rem,11vh)] lg:text-[min(8.5rem,12.5vh)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.4 }}
          className="mt-10 flex max-w-md items-start gap-4 text-sm leading-relaxed text-sand"
        >
          <span className="mt-2.5 h-px w-10 shrink-0 bg-bronze" aria-hidden="true" />
          {booking.language === 'ge'
            ? 'მზიანი ოთახები კოლხეთის შადრევნის თავზე, თბილი ხის დეტალები და სიმყუდროვე, რომელიც მოგზაურობას სახლად აქცევს.'
            : 'Sunlit rooms above the Colchis Fountain, warm timber and the small comforts that turn travel into homecoming.'}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2.2, ease }}
        className="relative z-20 mx-auto w-full max-w-[1600px] px-5 pb-6 md:px-10 md:pb-10"
      >
        <BookingWidget {...booking} />
      </motion.div>

      <div
        className="pointer-events-none absolute right-10 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-sand/70 xl:flex"
        style={{ transformOrigin: 'right center' }}
        aria-hidden="true"
      >
        42.27° N — 42.70° E
      </div>
    </section>
  )
}
