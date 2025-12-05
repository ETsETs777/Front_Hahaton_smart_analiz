export const groupBy = <T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export const sortBy = <T>(
  array: T[],
  keyFn: (item: T) => number | string,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  const sorted = [...array].sort((a, b) => {
    const aVal = keyFn(a)
    const bVal = keyFn(b)
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
}

export const uniqueBy = <T, K>(array: T[], keyFn: (item: T) => K): T[] => {
  const seen = new Set<K>()
  return array.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const flatten = <T>(arrays: T[][]): T[] => {
  return arrays.reduce((acc, arr) => acc.concat(arr), [])
}

export const partition = <T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  const truthy: T[] = []
  const falsy: T[] = []
  
  array.forEach(item => {
    if (predicate(item)) {
      truthy.push(item)
    } else {
      falsy.push(item)
    }
  })
  
  return [truthy, falsy]
}

export const sumBy = <T>(array: T[], keyFn: (item: T) => number): number => {
  return array.reduce((sum, item) => sum + keyFn(item), 0)
}

export const averageBy = <T>(array: T[], keyFn: (item: T) => number): number => {
  if (array.length === 0) return 0
  return sumBy(array, keyFn) / array.length
}

export const maxBy = <T>(array: T[], keyFn: (item: T) => number): T | undefined => {
  if (array.length === 0) return undefined
  
  return array.reduce((max, item) => {
    const maxVal = keyFn(max)
    const itemVal = keyFn(item)
    return itemVal > maxVal ? item : max
  })
}

export const minBy = <T>(array: T[], keyFn: (item: T) => number): T | undefined => {
  if (array.length === 0) return undefined
  
  return array.reduce((min, item) => {
    const minVal = keyFn(min)
    const itemVal = keyFn(item)
    return itemVal < minVal ? item : min
  })
}

export const findLast = <T>(array: T[], predicate: (item: T) => boolean): T | undefined => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i]
    }
  }
  return undefined
}

export const countBy = <T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, number> => {
  return array.reduce((acc, item) => {
    const key = keyFn(item)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<K, number>)
}

