import { useEffect, useState } from 'react'

import { motion, AnimatePresence, type Variants } from 'framer-motion'

import { SPRING_BOUNCY } from '@/constants/motion'
import { useMotion } from '@/hooks/useMotion'
import { cn } from '@/lib/utils'

const CHECKMARK_VARIANTS: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      ...SPRING_BOUNCY,
      duration: 0.5,
    },
  },
}

const CONFETTI_VARIANTS: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
    scale: 0,
  },
  visible: (i: number) => ({
    y: [0, -30 - i * 10, -50 - i * 15],
    x: (i - 2.5) * 20,
    opacity: [1, 1, 0],
    scale: [0, 1, 0.5],
    rotate: i * 45,
    transition: {
      ...SPRING_BOUNCY,
      duration: 1.0,
      delay: i * 0.03,
    },
  }),
}

const CONFETTI_COLORS = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#eab308', // yellow
  '#f97316', // orange
  '#ec4899', // pink
]

interface SuccessAnimationProps {
  /** Callback when animation completes */
  onComplete?: () => void
  /** Auto-dismiss delay in milliseconds */
  autoDismissDelay?: number
  /** Whether to show confetti */
  showConfetti?: boolean
  /** Child elements (e.g., "Send another message" button) */
  children?: React.ReactNode
  /** Additional class names */
  className?: string
}

/**
 * SuccessAnimation - Animated success confirmation with confetti and checkmark
 *
 * - Uses spring-bouncy animation (stiffness 200, damping 15)
 * - Respects prefers-reduced-motion via useMotion() hook
 * - Completes within ≤1.5 seconds
 */
export function SuccessAnimation({
  onComplete,
  autoDismissDelay = 2000,
  showConfetti = true,
  children,
  className,
}: SuccessAnimationProps) {
  const { enabled: motionEnabled } = useMotion()
  const [showConfettiParticles, setShowConfettiParticles] = useState(false)

  // Start confetti animation after checkmark appears
  useEffect(() => {
    if (motionEnabled && showConfetti) {
      const timer = setTimeout(() => {
        setShowConfettiParticles(true)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [motionEnabled, showConfetti])

  // Notify parent when animation completes - timing matches AC #3: auto-dismiss after 2 seconds
  useEffect(() => {
    if (!motionEnabled) {
      // Reduced motion: still honor the 2 second auto-dismiss
      const timer = setTimeout(() => {
        onComplete?.()
      }, autoDismissDelay)
      return () => clearTimeout(timer)
    }
    // Full animation completes in ~1.35s, then auto-dismiss at 2s total (AC #3)
    const timer = setTimeout(() => {
      onComplete?.()
    }, autoDismissDelay)

    return () => clearTimeout(timer)
  }, [onComplete, autoDismissDelay, motionEnabled])

  // If reduced motion is preferred, show static content
  if (!motionEnabled) {
    return (
      <div
        className={cn('rounded-lg border bg-green-50 p-6 text-center dark:bg-green-950/20', className)}
        role="status"
        aria-live="polite"
      >
        <div className="mb-2 flex justify-center">
          <svg
            className="h-12 w-12 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-green-800 dark:text-green-200">
          Message sent! I&apos;ll get back to you soon.
        </p>
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn('relative rounded-lg border bg-green-50 p-6 text-center dark:bg-green-950/20', className)}
      role="status"
      aria-live="polite"
    >
      {/* Confetti particles */}
      <AnimatePresence>
        {showConfettiParticles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={CONFETTI_VARIANTS}
                initial="hidden"
                animate="visible"
                className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Checkmark animation */}
      <motion.div
        variants={CHECKMARK_VARIANTS}
        initial="hidden"
        animate="visible"
        className="mb-2 flex justify-center"
      >
        <svg
          className="h-12 w-12 text-green-600 dark:text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <motion.path
            variants={CHECKMARK_VARIANTS}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...SPRING_BOUNCY, duration: 0.5, delay: 0.1 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-green-800 dark:text-green-200"
      >
        Message sent! I&apos;ll get back to you soon.
      </motion.p>

      {children}
    </div>
  )
}
