import { create } from 'zustand'

export type CursorType = 'default' | 'pointer' | 'project' | 'external'

interface CursorState {
  x: number
  y: number
  cursorType: CursorType
  isHovering: boolean
  isClicking: boolean
  label: string
  setPosition: (x: number, y: number) => void
  setCursorType: (type: CursorType) => void
  setHovering: (v: boolean) => void
  setClicking: (v: boolean) => void
  setLabel: (label: string) => void
}

export const useCursorStore = create<CursorState>((set) => ({
  x: -100,
  y: -100,
  cursorType: 'default',
  isHovering: false,
  isClicking: false,
  label: '',
  setPosition: (x, y) => set({ x, y }),
  setCursorType: (cursorType) => set({ cursorType }),
  setHovering: (isHovering) => set({ isHovering }),
  setClicking: (isClicking) => set({ isClicking }),
  setLabel: (label) => set({ label }),
}))
