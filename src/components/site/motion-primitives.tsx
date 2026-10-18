'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

export const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.1, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealText({
  text,
  className,
  delay = 0,
  as: Tag = 'h2',
  animateOnMount = false,
}: {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
  animateOnMount?: boolean
}) {
  const lines = text.split('\n')
  let wordIndex = 0
  const trigger = animateOnMount
    ? { animate: { y: '0%' } }
    : { whileInView: { y: '0%' }, viewport: { once: true, margin: '-10% 0px' } }

  return (
    <Tag className={className} aria-label={text.replace(/\n/g, ' ').replace(/\*/g, '')}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(' ').map((word, wi) => {
            const i = wordIndex++
  const match = word.match(/^\*(.+)\*(\W*)$/)
  const italic = Boolean(match)
  return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className="inline-block"
  data-emphasis={italic || undefined}
                  initial={{ y: '110%' }}
                  {...trigger}
                  transition={{ duration: 1.1, delay: delay + i * 0.06, ease }}
                >
                  {match ? (
  <>
  <span className="italic text-bronze">{match[1]}</span>
  <span className="not-italic text-current">{match[2]}</span>
  </>
  ) : (
  word
  )}
                  {'\u00A0'}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

export function ParallaxImage({
  src,
  alt,
  className,
  strength = 12,
  sizes = '100vw',
  priority,
}: {
  src: string
  alt: string
  className?: string
  strength?: number
  sizes?: string
  priority?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y }} className="absolute -inset-y-[15%] inset-x-0">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </div>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em]', className)}>
      <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
      {children}
    </p>
  )
}
