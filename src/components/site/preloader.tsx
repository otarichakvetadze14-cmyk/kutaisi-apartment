'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ease } from './motion-primitives'

export function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 1700)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.1, ease }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
        >
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease }}
              className="font-serif text-4xl font-light tracking-wide text-ivory md:text-6xl"
            >
              Kutaisi <span className="italic text-bronze">Central</span> Square
            </motion.p>
          </div>
          <div className="mt-8 h-px w-40 overflow-hidden bg-ivory/10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, ease }}
              className="h-full origin-left bg-bronze"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
