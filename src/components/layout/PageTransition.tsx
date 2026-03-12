import { motion } from 'framer-motion'

import { SPRING_SNAPPY } from '@/constants/motion'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={SPRING_SNAPPY}
    >
      {children}
    </motion.div>
  )
}
