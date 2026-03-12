import { act } from '@testing-library/react'

import { useLanguageStore } from './languageStore'

describe('useLanguageStore', () => {
  beforeEach(() => {
    act(() => {
      useLanguageStore.setState({ language: 'en' })
    })
  })

  it('initializes with English', () => {
    expect(useLanguageStore.getState().language).toBe('en')
  })

  it('setLanguage switches to Vietnamese', () => {
    act(() => {
      useLanguageStore.getState().setLanguage('vi')
    })
    expect(useLanguageStore.getState().language).toBe('vi')
  })

  it('setLanguage switches back to English', () => {
    act(() => {
      useLanguageStore.getState().setLanguage('vi')
      useLanguageStore.getState().setLanguage('en')
    })
    expect(useLanguageStore.getState().language).toBe('en')
  })
})
