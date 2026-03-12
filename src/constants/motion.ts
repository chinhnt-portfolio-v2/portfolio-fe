import type { Transition } from 'framer-motion'

export const SPRING_GENTLE: Transition = { type: 'spring', stiffness: 300, damping: 30 }
export const SPRING_SNAPPY: Transition = { type: 'spring', stiffness: 400, damping: 25 }
export const SPRING_BOUNCY: Transition = { type: 'spring', stiffness: 200, damping: 15 }
