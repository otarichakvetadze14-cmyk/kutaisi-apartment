'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'
import { Eyebrow, ease, RevealText } from './motion-primitives'

type Language = 'ge' | 'en'
type GalleryPhoto = { imagePath: string; title: Record<Language, string> }

const columns = [
  { items: [0, 3, 6], aspect: ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]'] },
  { items: [1, 4, 7], aspect: ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square'] },
  { items: [2, 5, 8], aspect: ['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]'] },
]

function Lightbox({
  images,
  index,
  language,
  text,
  onClose,
  onNav,
}: {
  images: readonly GalleryPhoto[]
  index: number
  language: Language
  text: Record<string, string>
  onClose: () => void
  onNav: (dir: 1 | -1) => void
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onNav])

  const img = images[index]

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={text.imageViewer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <p className="font-serif text-lg tabular-nums text-ivory">
          {String(index + 1).padStart(2, '0')} <span className="text-stone">/ {String(images.length).padStart(2, '0')}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={text.closeViewer}
          className="flex size-11 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:bg-ivory hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease }}
            className="absolute inset-x-5 inset-y-0 md:inset-x-24"
          >
            <Image src={img.imagePath} alt={img.title[language]} fill sizes="90vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => onNav(dir)}
            aria-label={dir === -1 ? text.previousImage : text.nextImage}
            className={cn(
              'absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-ink/40 text-ivory backdrop-blur-md transition-colors hover:bg-ivory hover:text-ink',
              dir === -1 ? 'left-4 md:left-8' : 'right-4 md:right-8',
            )}
          >
            {dir === -1 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          </button>
        ))}
      </div>
      <p className="px-5 py-6 text-center text-sm italic text-sand">{img.title[language]}</p>
    </motion.div>
  )
}

export function Gallery({
  photos,
  language,
  text,
  galleryIndex,
  setGalleryIndex,
}: {
  photos: readonly GalleryPhoto[]
  language: Language
  text: Record<string, string>
  galleryIndex: number
  setGalleryIndex: Dispatch<SetStateAction<number>>
}) {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['6%', '-12%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['10%', '-16%'])
  const ys = [y1, y2, y3]

  const nav = useCallback(
    (dir: 1 | -1) => {
      if (open === null) return
      const next = (open + dir + photos.length) % photos.length
      setOpen(next)
      setGalleryIndex(next)
    },
    [open, photos.length, setGalleryIndex],
  )
  const close = useCallback(() => setOpen(null), [])

  return (
    <section ref={ref} id="gallery" aria-labelledby="gallery-title" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-20 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow className="mb-6 text-bronze">{text.galleryEyebrow}</Eyebrow>
            <RevealText
              text={text.galleryHeading}
              className="font-serif text-5xl font-light leading-none text-ivory md:text-7xl"
            />
            <span id="gallery-title" className="sr-only">
              {text.galleryEyebrow}
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-stone md:justify-self-end">
            {text.galleryDescription}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
          {columns.map((col, ci) => (
            <motion.div
              key={ci}
              style={{ y: ys[ci] }}
              className={cn('flex flex-col gap-4 md:gap-8', ci === 2 && 'hidden md:flex', ci === 1 && 'md:pt-24')}
            >
              {col.items.map((idx, k) => {
                const img = photos[idx]
                if (!img) return null
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const selectedIndex = galleryIndex === idx ? galleryIndex : idx
                      setOpen(selectedIndex)
                      setGalleryIndex(selectedIndex)
                    }}
                    data-cursor={text.cursorOpen}
                    aria-label={`${text.openImage}: ${img.title[language]}`}
                    className={cn('group relative overflow-hidden', col.aspect[k])}
                  >
                    <Image
                      src={img.imagePath}
                      alt={img.title[language]}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/20" />
                  </button>
                )
              })}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            images={photos}
            index={open}
            language={language}
            text={text}
            onClose={close}
            onNav={nav}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
