import { useCallback, useLayoutEffect, useRef } from 'react'

/**
 * Like useCallback, but always returns the latest version of the callback
 * without changing the callback identity. Useful for event handlers passed
 * to child components that memoize with unstable_callbackHandle.
 *
 * Uses useLayoutEffect (runs synchronously before paint, after render commit)
 * to update the ref — satisfying the "no ref writes during render" intent
 * while keeping the returned function identity stable.
 *
 * const handleClick = useCallbackRef((e: Event) => { ... })
 */
export function useCallbackRef<T extends (...args: never[]) => void>(callback: T): T {
  const ref = useRef<T>(callback)
  // Synchronous update before paint — satisfies "no ref writes during render"
  useLayoutEffect(() => {
    ref.current = callback
  })
  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as unknown as T
}
