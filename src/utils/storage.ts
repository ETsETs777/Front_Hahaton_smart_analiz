export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        return defaultValue ?? null
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Ошибка при чтении из localStorage ключа "${key}":`, error)
      return defaultValue ?? null
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Ошибка при записи в localStorage ключа "${key}":`, error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Ошибка при удалении из localStorage ключа "${key}":`, error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Ошибка при очистке localStorage:', error)
    }
  },

  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null
  }
}

export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key)
      if (item === null) {
        return defaultValue ?? null
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Ошибка при чтении из sessionStorage ключа "${key}":`, error)
      return defaultValue ?? null
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Ошибка при записи в sessionStorage ключа "${key}":`, error)
    }
  },

  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error(`Ошибка при удалении из sessionStorage ключа "${key}":`, error)
    }
  },

  clear: (): void => {
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Ошибка при очистке sessionStorage:', error)
    }
  },

  has: (key: string): boolean => {
    return window.sessionStorage.getItem(key) !== null
  }
}

