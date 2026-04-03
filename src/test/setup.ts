import '@testing-library/jest-dom'

import { expect, vi } from 'vitest'
import { toHaveNoViolations } from 'vitest-axe/matchers'

// Register vitest-axe matcher globally (object form required by expect.extend)
expect.extend({ toHaveNoViolations })

import enTranslations from '@/i18n/en.json'

import type * as ReactI18next from 'react-i18next'

// Flatten nested translation object to dot-notation lookup map
function flattenTranslations(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, string> {
  return Object.entries(obj).reduce(
    (acc, [k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k
      if (typeof v === 'object' && v !== null) {
        return { ...acc, ...flattenTranslations(v as Record<string, unknown>, key) }
      }
      return { ...acc, [key]: String(v) }
    },
    {} as Record<string, string>,
  )
}

const flatEn = flattenTranslations(enTranslations as unknown as Record<string, unknown>)

// Global mock: t(key) returns the English translation value (or the key as fallback).
// This keeps all existing English-text assertions working after i18n is added to components.
vi.mock('react-i18next', async (importOriginal) => {
  type Mod = typeof ReactI18next
  const actual = await importOriginal<Mod>()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => flatEn[key] ?? key,
      i18n: { changeLanguage: vi.fn(), language: 'en' },
    }),
    initReactI18next: {
      type: '3rdParty' as const,
      init: vi.fn(),
    },
  }
})

// ─── framer-motion mock ─────────────────────────────────────────────────────────
// Provides all exports needed by cursor system + existing motion usage in tests.
// motion.div etc. return actual React elements so components using them render correctly.
import * as React from 'react'

// Reusable motion element — renders as a plain div with children (no animation in tests)
function mockMotion(props: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement('div', null, props.children as React.ReactNode)
}

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>()
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: mockMotion,
      article: mockMotion,
      span: mockMotion,
      button: mockMotion,
      nav: mockMotion,
      ul: mockMotion,
      li: mockMotion,
      h1: mockMotion,
      h2: mockMotion,
      p: mockMotion,
      a: mockMotion,
      img: mockMotion,
      svg: mockMotion,
      path: mockMotion,
      circle: mockMotion,
      rect: mockMotion,
    },
    AnimatePresence: ({ children }: { children: unknown }) => children,
    MotionConfig: ({ children }: { children: unknown }) => children,
    useMotionValue: () => ({ value: -100, set: vi.fn() }),
    useSpring: (mv: unknown) => mv,
    useTransform: () => ({ current: -100 }),
    useReducedMotion: () => false,
    motionValue: (init = 0) => ({ value: init, set: vi.fn() }),
  }
})

// ─── Cursor system mocks ───────────────────────────────────────────────────────
// CustomCursor / CursorParticles / CursorLabel are mounted in App.tsx.
// Returning null prevents them from mounting framer-motion / Zustand hooks in tests,
// which would cause act() warnings. The cursor components themselves are tested
// in their own dedicated test files with proper isolated mocks.
vi.mock('@/components/cursor/CustomCursor', () => ({
  CustomCursor: () => null,
}))
vi.mock('@/components/cursor/CursorParticles', () => ({
  CursorParticles: () => null,
}))
vi.mock('@/components/cursor/CursorLabel', () => ({
  CursorLabel: () => null,
}))
