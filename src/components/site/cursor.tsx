'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useSyncExternalStore } from 'react'

function subscribePointerFine(onChange: () => void) {
  const query = window.matchMedia('(pointer: fine)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getPointerFine() {
  return window.matchMedia('(pointer: fine)').matches
}

export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 })
  const [label, setLabel] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)
  const enabled = useSyncExternalStore(subscribePointerFine, getPointerFine, () => false)

  useEffect(() => {
    if (!enabled) return

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button')
      setHovering(Boolean(target))
      setLabel(target?.dataset.cursor ?? null)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [enabled, x, y])

  if (!enabled) return null

  const size = label ? 88 : hovering ? 44 : 10

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[100]"
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full ${
          label ? 'bg-ivory text-ink' : hovering ? 'border border-bronze' : 'bg-bronze'
        }`}
      >
        {label && <span className="text-[10px] font-medium uppercase tracking-[0.2em]">{label}</span>}
      </motion.div>
    </motion.div>
  )
}
