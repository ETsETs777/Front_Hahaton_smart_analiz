import { useState, useCallback } from 'react'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export const useAsync = <T, P extends any[] = []>(
  asyncFunction: (...args: P) => Promise<T>
) => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: P) => {
      setState({ data: null, loading: true, error: null })

      try {
        const data = await asyncFunction(...args)
        setState({ data, loading: false, error: null })
        return data
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        setState({ data: null, loading: false, error: err })
        throw err
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

