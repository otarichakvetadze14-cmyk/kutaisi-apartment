'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { contact, navLinks } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { ease } from './motion-primitives'

export function Header({
  language,
  setLanguage,
  text,
}: {
  language: 'ge' | 'en'
  setLanguage: (language: 'ge' | 'en') => void
  text: Record<string, string>
}) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const localizedNav = [
    text.navResidences,
    text.navGallery,
    text.navExperiences,
    text.navDiscover,
    text.navContact,
  ]

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(v > 40)
    setHidden(v > 400 && v > prev)
  })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          scrolled && !open ? 'bg-ink/75 backdrop-blur-xl' : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-10">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="group flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory"
          >
            <span className="relative flex h-3 w-7 flex-col justify-between" aria-hidden="true">
              <span
                className={cn(
                  'h-px w-full bg-current transition-transform duration-500',
                  open && 'translate-y-[5.5px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'h-px w-2/3 bg-current transition-all duration-500 group-hover:w-full',
                  open && 'w-full -translate-y-[5.5px] -rotate-45',
                )}
              />
            </span>
            <span className="hidden sm:inline">{open ? text.menuClose : text.menuOpen}</span>
          </button>

          <a href="#top" className="absolute left-1/2 -translate-x-1/2 text-center text-ivory" aria-label={text.homeLink}>
            <span className="block font-serif text-xl font-light leading-none tracking-wide md:text-2xl">
              Kutaisi <span className="italic">Central</span> Square
            </span>
            <span className="mt-1 hidden text-[9px] uppercase tracking-[0.45em] text-stone md:block">{text.headerTagline}</span>
          </a>

          <div className="flex items-center gap-2 md:gap-4">
            <div role="group" aria-label={language === 'ge' ? 'ენის არჩევა' : 'Choose language'} className="flex items-center gap-1">
              {(['ge', 'en'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={language === option}
                  onClick={() => setLanguage(option)}
                  className={`min-h-10 min-w-8 text-[9px] uppercase tracking-[0.15em] transition-colors ${
                    language === option ? 'text-bronze' : 'text-ivory/55 hover:text-ivory'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <a
              href="#reserve"
              className="border border-ivory/30 px-3 py-2.5 text-[9px] font-medium uppercase tracking-[0.2em] text-ivory transition-colors duration-500 hover:border-bronze hover:bg-bronze hover:text-ink sm:px-4 sm:text-[11px] md:px-6"
            >
              {text.reserve}
            </a>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={text.siteMenu}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.9, ease }}
            className="fixed inset-0 z-40 grid bg-ink-soft lg:grid-cols-[1.2fr_1fr]"
          >
            <nav className="flex flex-col justify-center gap-2 px-6 pt-24 md:px-16">
              {navLinks.map((link, i) => (
                <div key={link.href} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease }}
                    className="group flex items-baseline gap-5 font-serif text-5xl font-light text-ivory transition-colors hover:text-bronze md:text-7xl"
                  >
                    <span className="font-sans text-xs tracking-[0.3em] text-stone">0{i + 1}</span>
                    <span className="transition-transform duration-500 group-hover:translate-x-3 group-hover:italic">
                      {localizedNav[i]}
                    </span>
                  </motion.a>
                </div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex flex-col gap-1 text-sm text-stone"
              >
                <a href={contact.phoneHref} className="hover:text-ivory">{contact.phone}</a>
                <a href={`mailto:${contact.email}`} className="hover:text-ivory">{contact.email}</a>
              </motion.div>
            </nav>
            <motion.div
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease }}
              className="relative hidden lg:block"
            >
              <Image src="/images/redesign/suite-square.webp" alt="" fill sizes="45vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-soft to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
