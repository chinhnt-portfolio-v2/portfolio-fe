import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    const shouldSkip = false
    expect(cn('base', shouldSkip && 'skip', 'include')).toBe('base include')
  })

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    // twMerge resolves conflicts: bg-red overrides bg-blue
    expect(cn('bg-blue-500', 'bg-red-500')).toBe('bg-red-500')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })
})
