'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { useCursorStore } from '@/stores/cursorStore'

const LABEL_MAP: Record<string, string> = {
  project: 'View \u2192',
  external: 'Open \u2197',
}

/**
 * Context-aware floating label that appears above the cursor when hovering
 * interactive elements (project cards, external links).
 */
export function CursorLabel() {
  const cursorType = useCursorStore((s) => s.cursorType)
  const isHovering = useCursorStore((s) => s.isHovering)
  const label = useCursorStore((s) => s.label)

  const displayText = label || LABEL_MAP[cursorType] || ''
  const visible = isHovering && displayText !== ''

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed z-[10001] rounded border border-border/30 bg-background/90 px-2 py-1 font-mono text-[11px] text-foreground backdrop-blur-sm"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          data-testid="cursor-label"
        >
          {displayText}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
