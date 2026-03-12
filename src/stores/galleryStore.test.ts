import { act } from '@testing-library/react'

import { useGalleryStore } from './galleryStore'

describe('useGalleryStore', () => {
  beforeEach(() => {
    act(() => {
      useGalleryStore.setState({ activeFilter: null })
    })
  })

  it('initializes with null filter', () => {
    expect(useGalleryStore.getState().activeFilter).toBeNull()
  })

  it('setActiveFilter sets a filter value', () => {
    act(() => {
      useGalleryStore.getState().setActiveFilter('react')
    })
    expect(useGalleryStore.getState().activeFilter).toBe('react')
  })

  it('setActiveFilter clears filter when passed null', () => {
    act(() => {
      useGalleryStore.getState().setActiveFilter('react')
      useGalleryStore.getState().setActiveFilter(null)
    })
    expect(useGalleryStore.getState().activeFilter).toBeNull()
  })
})
