export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export const deepMerge = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  const output = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key] as any)
    } else {
      output[key] = source[key] as T[Extract<keyof T, string>]
    }
  }

  return output
}

export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}

export const getNestedValue = <T = any>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T | undefined => {
  const keys = path.split('.')
  let result: any = obj

  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue
    }
    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}

export const setNestedValue = (
  obj: Record<string, any>,
  path: string,
  value: any
): void => {
  const keys = path.split('.')
  let current: any = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
}

