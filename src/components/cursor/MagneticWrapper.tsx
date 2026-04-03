'use client'

import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { useMagnetic } from '@/hooks/use-magnetic'

interface MagneticWrapperProps {
  children: ReactNode
  strength?: number
  radius?: number
  className?: string
}

/**
 * HOC wrapper that adds magnetic pull toward the element's center.
 * Attach it to any interactive element that should attract the cursor.
 *
 * Usage:
 *   <MagneticWrapper strength={0.4} radius={100}>
 *     <button>Magnetically attracted!</button>
 *   </MagneticWrapper>
 */
export function MagneticWrapper({
  children,
  strength,
  radius,
  className,
}: MagneticWrapperProps) {
  const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
    strength,
    radius,
  })

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
