import { useReducedMotion } from 'framer-motion'

export function useMotion() {
  const prefersReduced = useReducedMotion()
  return { enabled: !prefersReduced }
}
