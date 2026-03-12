import { act } from '@testing-library/react'

import { useReferralStore } from './referralStore'

describe('useReferralStore', () => {
  beforeEach(() => {
    act(() => {
      useReferralStore.setState({ referralSource: null })
    })
  })

  it('initializes with null referral source', () => {
    expect(useReferralStore.getState().referralSource).toBeNull()
  })

  it('setReferralSource stores the source', () => {
    act(() => {
      useReferralStore.getState().setReferralSource('linkedin')
    })
    expect(useReferralStore.getState().referralSource).toBe('linkedin')
  })

  it('setReferralSource can be updated to a new source', () => {
    act(() => {
      useReferralStore.getState().setReferralSource('linkedin')
      useReferralStore.getState().setReferralSource('github')
    })
    expect(useReferralStore.getState().referralSource).toBe('github')
  })
})
