import { act } from '@testing-library/react'

import { useThemeStore } from './themeStore'

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset store to default state between tests
    act(() => {
      useThemeStore.setState({ theme: 'dark' })
    })
  })

  it('initializes with dark theme', () => {
    expect(useThemeStore.getState().theme).toBe('dark')
  })

  it('setTheme updates theme to light', () => {
    act(() => {
      useThemeStore.getState().setTheme('light')
    })
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('setTheme updates theme back to dark', () => {
    act(() => {
      useThemeStore.getState().setTheme('light')
      useThemeStore.getState().setTheme('dark')
    })
    expect(useThemeStore.getState().theme).toBe('dark')
  })

  it('toggleTheme switches dark to light', () => {
    act(() => {
      useThemeStore.getState().toggleTheme()
    })
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('toggleTheme switches light back to dark', () => {
    act(() => {
      useThemeStore.setState({ theme: 'light' })
      useThemeStore.getState().toggleTheme()
    })
    expect(useThemeStore.getState().theme).toBe('dark')
  })
})
