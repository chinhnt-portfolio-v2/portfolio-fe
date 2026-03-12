import type { Transition } from 'framer-motion'

export type SpringToken = Transition & { type: 'spring' }

export type SpringPreset = 'gentle' | 'snappy' | 'bouncy'
