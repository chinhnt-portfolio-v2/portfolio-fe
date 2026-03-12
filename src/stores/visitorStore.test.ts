import { act } from '@testing-library/react'

import { useVisitorStore } from './visitorStore'

describe('useVisitorStore', () => {
  beforeEach(() => {
    act(() => {
      useVisitorStore.setState({ returnCount: 0, lastViewedProjectSlug: null })
    })
  })

  it('initializes with returnCount 0 and no last project', () => {
    const { returnCount, lastViewedProjectSlug } = useVisitorStore.getState()
    expect(returnCount).toBe(0)
    expect(lastViewedProjectSlug).toBeNull()
  })

  it('incrementReturnCount increases count by 1', () => {
    act(() => {
      useVisitorStore.getState().incrementReturnCount()
    })
    expect(useVisitorStore.getState().returnCount).toBe(1)
  })

  it('incrementReturnCount is cumulative', () => {
    act(() => {
      useVisitorStore.getState().incrementReturnCount()
      useVisitorStore.getState().incrementReturnCount()
    })
    expect(useVisitorStore.getState().returnCount).toBe(2)
  })

  it('setLastViewedProjectSlug stores the slug', () => {
    act(() => {
      useVisitorStore.getState().setLastViewedProjectSlug('my-project')
    })
    expect(useVisitorStore.getState().lastViewedProjectSlug).toBe('my-project')
  })
})
