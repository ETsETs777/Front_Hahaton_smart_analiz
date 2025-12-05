import { useSearchParams } from 'react-router'
import { useCallback, useMemo } from 'react'

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(() => {
    const result: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      result[key] = value
    })
    return result
  }, [searchParams])

  const setParam = useCallback((key: string, value: string | null) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      if (value === null || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
      return newParams
    })
  }, [setSearchParams])

  const getParam = useCallback((key: string, defaultValue?: string): string | undefined => {
    return searchParams.get(key) || defaultValue
  }, [searchParams])

  const removeParam = useCallback((key: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.delete(key)
      return newParams
    })
  }, [setSearchParams])

  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return {
    params,
    setParam,
    getParam,
    removeParam,
    clearParams,
  }
}

