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
