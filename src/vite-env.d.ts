/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Основные настройки приложения
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEV_MODE: string

  // GraphQL API
  readonly VITE_GRAPHQL_URL: string

  // Логирование
  readonly VITE_ENABLE_LOGGING: string
  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'

  // Дебаг режимы
  readonly VITE_DEBUG_GRAPHQL: string
  readonly VITE_DEBUG_CACHE: string

  // URL и пути
  readonly VITE_BASE_URL: string

  // Аналитика
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Дополнительные типы для работы с переменными окружения
declare namespace NodeJS {
  interface ProcessEnv extends ImportMetaEnv { }
}

// Хелпер типы для работы с boolean переменными окружения
type BooleanEnvVar = 'true' | 'false'

// Утилитарные типы для конвертации строковых env переменных
type EnvBoolean<T extends string> = T extends 'true' ? true : false
type EnvNumber<T extends string> = T extends `${infer N extends number}` ? N : never
