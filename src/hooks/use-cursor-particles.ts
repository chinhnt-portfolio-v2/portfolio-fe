import { useCallback, useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  color: string
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc']
const MAX_PARTICLES = 80
const SPAWN_COUNT = 12
const LIFE_DECAY = 0.025

/**
 * Manages a canvas particle burst system using a ref (no React state = no re-renders).
 *
 * Pass the canvas element ref from CursorParticles.tsx so the RAF loop can draw into it.
 * Returns `spawnParticles(x, y)` — call this from the cursor click handler.
 * Pauses RAF when the tab is hidden.
 */
export function useCursorParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const colorIndexRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.96
      p.vy *= 0.96
      p.life -= LIFE_DECAY

      if (p.life <= 0) return false

      ctx.save()
      ctx.globalAlpha = p.life
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      return true
    })
  }, [canvasRef])

  // Stable loop ref via lazy initializer — the initializer function is called once
  // on first render and React stores the result.
  const loopRef = useRef<(() => void) | null>(() => {
    draw()
    rafRef.current = requestAnimationFrame(loopRef.current!)
  })

  // RAF loop lifecycle — starts when canvas is available
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    rafRef.current = requestAnimationFrame(loopRef.current!)

    const handleVisibility = () => {
      if (document.hidden) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      } else {
        rafRef.current = requestAnimationFrame(loopRef.current!)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [canvasRef, draw])

  const spawnParticles = useCallback((x: number, y: number) => {
    const color = COLORS[colorIndexRef.current % COLORS.length]
    colorIndexRef.current++

    const newParticles: Particle[] = Array.from({ length: SPAWN_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 2 + 1
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: Math.random() * 3 + 2,
        color,
      }
    })

    particlesRef.current = [
      ...particlesRef.current.slice(-(MAX_PARTICLES - SPAWN_COUNT)),
      ...newParticles,
    ]
  }, [])

  return { spawnParticles }
}
