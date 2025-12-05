/**
 * Утилиты для работы с переменными окружения Vite
 * Обеспечивают типобезопасность и удобство использования
 */

/**
 * Конвертирует строковую env переменную в boolean
 */
export const envToBoolean = (value: string | undefined): boolean => {
  return value === 'true'
}

/**
 * Конвертирует строковую env переменную в number
 */
export const envToNumber = (value: string | undefined, defaultValue = 0): number => {
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Получает env переменную с fallback значением
 */
export const getEnvVar = <T = string>(
  key: keyof ImportMetaEnv,
  fallback: T
): T => {
  const value = import.meta.env[key]
  return value !== undefined ? (value as T) : fallback
}

/**
 * Конфигурация приложения на основе переменных окружения
 */
export const config = {
  // Основные настройки
  app: {
    name: import.meta.env.VITE_APP_NAME || 'SportBook',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    isDev: envToBoolean(import.meta.env.VITE_DEV_MODE),
  },

  // GraphQL API
  api: {
    graphqlUrl: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql'
  },

  // Логирование
  logging: {
    enabled: envToBoolean(import.meta.env.VITE_ENABLE_LOGGING),
    level: import.meta.env.VITE_LOG_LEVEL || 'info',
  },

  // Дебаг режимы
  debug: {
    graphql: envToBoolean(import.meta.env.VITE_DEBUG_GRAPHQL),
    cache: envToBoolean(import.meta.env.VITE_DEBUG_CACHE),
  },

  
  // URL и пути
  urls: {
    base: import.meta.env.VITE_BASE_URL || '/',
  },

  // Аналитика (опционально)
  analytics: {
    googleId: import.meta.env.VITE_ANALYTICS_ID,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  },
} as const

/**
 * Проверяет, находимся ли мы в режиме разработки
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || config.app.isDev
}

/**
 * Проверяет, находимся ли мы в продакшен режиме
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD && !config.app.isDev
}

/**
 * Валидация критически важных переменных окружения
 */
export const validateEnv = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Проверяем обязательные переменные
  if (!config.api.graphqlUrl) {
    errors.push('VITE_GRAPHQL_URL не задан')
  }

  if (!config.app.name) {
    errors.push('VITE_APP_NAME не задан')
  }

  // Проверяем валидность URL
  try {
    new URL(config.api.graphqlUrl)
  } catch {
    errors.push('VITE_GRAPHQL_URL содержит невалидный URL')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Логирует текущую конфигурацию (только в режиме разработки)
 */
export const logConfig = (): void => {
  if (isDevelopment()) {
    console.group('🔧 Конфигурация приложения')
    console.log('Режим:', isDevelopment() ? 'Разработка' : 'Продакшен')
    console.log('Приложение:', config.app)
    console.log('API:', config.api)
    console.log('Логирование:', config.logging)
    console.groupEnd()
  }
} 