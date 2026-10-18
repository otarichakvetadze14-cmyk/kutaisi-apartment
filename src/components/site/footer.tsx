'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { contact, navLinks } from '@/lib/site-data'

export function Footer() {
  const [submitted, setSubmitted] = useState(false)
  const [year, setYear] = useState('2026')

  useEffect(() => {
    const timeout = window.setTimeout(() => setYear(String(new Date().getFullYear())), 0)
    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <footer className="relative overflow-hidden bg-ink-soft pt-24 text-ivory md:pt-32">
      <div className="flex overflow-hidden border-y border-border py-6" aria-hidden="true">
        <div className="flex shrink-0 animate-marquee gap-12 whitespace-nowrap pr-12 font-serif text-5xl font-light italic text-ivory/80 md:text-7xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex gap-12">
              {['Stay a while', 'Kutaisi', 'Central Square', 'Imereti', 'Since the Golden Age'].map((w) => (
                <span key={w} className="flex items-center gap-12">
                  {w}
                  <span className="size-2 rounded-full bg-bronze not-italic" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-20 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="font-serif text-3xl font-light leading-snug md:text-4xl">
            Letters from Kutaisi — seasonal rates, new residences and the region’s best-kept secrets.
          </p>
          {submitted ? (
            <p className="mt-8 flex items-center gap-3 text-sm text-bronze" role="status">
              <Check className="size-4" /> Thank you — you are on the list.
            </p>
          ) : (
            <form
              className="mt-8 flex border-b border-ivory/30 focus-within:border-bronze"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent py-4 text-ivory placeholder:text-stone focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="px-2 text-ivory transition-colors hover:text-bronze">
                <ArrowRight className="size-5" />
              </button>
            </form>
          )}
        </div>

        <nav aria-label="Footer" className="md:col-span-2 md:col-start-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone">Explore</p>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-bronze">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone">Contact</p>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            <li>{contact.address}</li>
            <li>
              <a href={contact.phoneHref} className="transition-colors hover:text-bronze">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="break-all transition-colors hover:text-bronze">
                {contact.email}
              </a>
            </li>
            <li>
              <a href="/admin" className="transition-colors hover:text-bronze">
                Administration
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p
          className="select-none text-center font-serif text-[15vw] font-light leading-[0.8] tracking-tight text-ivory/[0.06]"
          aria-hidden="true"
        >
          Kutaisi
        </p>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-8 text-xs text-stone md:flex-row">
          <p>© {year} Kutaisi Central Square. All rights reserved.</p>
          <a href="#top" className="uppercase tracking-[0.3em] transition-colors hover:text-ivory">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
