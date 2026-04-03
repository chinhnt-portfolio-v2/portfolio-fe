import { act } from '@testing-library/react'

import { useCursorStore } from './cursorStore'

describe('useCursorStore', () => {
  beforeEach(() => {
    // Reset store to default state between tests
    act(() => {
      useCursorStore.setState({
        x: -100,
        y: -100,
        cursorType: 'default',
        isHovering: false,
        isClicking: false,
        label: '',
      })
    })
  })

  it('initializes with off-screen position and default cursor type', () => {
    const state = useCursorStore.getState()
    expect(state.x).toBe(-100)
    expect(state.y).toBe(-100)
    expect(state.cursorType).toBe('default')
    expect(state.isHovering).toBe(false)
    expect(state.isClicking).toBe(false)
    expect(state.label).toBe('')
  })

  it('setPosition updates x and y coordinates', () => {
    act(() => {
      useCursorStore.getState().setPosition(200, 350)
    })
    const { x, y } = useCursorStore.getState()
    expect(x).toBe(200)
    expect(y).toBe(350)
  })

  it('setCursorType updates cursor type to pointer', () => {
    act(() => {
      useCursorStore.getState().setCursorType('pointer')
    })
    expect(useCursorStore.getState().cursorType).toBe('pointer')
  })

  it('setCursorType updates cursor type to project', () => {
    act(() => {
      useCursorStore.getState().setCursorType('project')
    })
    expect(useCursorStore.getState().cursorType).toBe('project')
  })

  it('setCursorType updates cursor type to external', () => {
    act(() => {
      useCursorStore.getState().setCursorType('external')
    })
    expect(useCursorStore.getState().cursorType).toBe('external')
  })

  it('setHovering updates isHovering to true', () => {
    act(() => {
      useCursorStore.getState().setHovering(true)
    })
    expect(useCursorStore.getState().isHovering).toBe(true)
  })

  it('setHovering updates isHovering to false', () => {
    act(() => {
      useCursorStore.setState({ isHovering: true })
      useCursorStore.getState().setHovering(false)
    })
    expect(useCursorStore.getState().isHovering).toBe(false)
  })

  it('setClicking updates isClicking to true', () => {
    act(() => {
      useCursorStore.getState().setClicking(true)
    })
    expect(useCursorStore.getState().isClicking).toBe(true)
  })

  it('setClicking updates isClicking to false', () => {
    act(() => {
      useCursorStore.setState({ isClicking: true })
      useCursorStore.getState().setClicking(false)
    })
    expect(useCursorStore.getState().isClicking).toBe(false)
  })

  it('setLabel updates label text', () => {
    act(() => {
      useCursorStore.getState().setLabel('View →')
    })
    expect(useCursorStore.getState().label).toBe('View →')
  })

  it('setLabel clears label when passed empty string', () => {
    act(() => {
      useCursorStore.setState({ label: 'View →' })
      useCursorStore.getState().setLabel('')
    })
    expect(useCursorStore.getState().label).toBe('')
  })

  it('multiple actions can be chained', () => {
    act(() => {
      useCursorStore.getState().setPosition(100, 200)
      useCursorStore.getState().setCursorType('project')
      useCursorStore.getState().setHovering(true)
      useCursorStore.getState().setLabel('View →')
    })
    const state = useCursorStore.getState()
    expect(state.x).toBe(100)
    expect(state.y).toBe(200)
    expect(state.cursorType).toBe('project')
    expect(state.isHovering).toBe(true)
    expect(state.label).toBe('View →')
  })
})
