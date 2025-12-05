import { useState, useEffect } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches)
    }

    setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)')
}

export const useIsTablet = (): boolean => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
}

export const useIsDesktop = (): boolean => {
  return useMediaQuery('(min-width: 1025px)')
}

