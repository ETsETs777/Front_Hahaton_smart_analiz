import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { config, isDevelopment, logConfig, validateEnv } from '@/lib/env'

// Валидируем переменные окружения при инициализации
const envValidation = validateEnv()
if (!envValidation.isValid) {
  console.error('❌ Ошибки конфигурации:', envValidation.errors)
}

// Логируем конфигурацию в режиме разработки
if (isDevelopment()) {
  logConfig()
}


// HTTP Link для отправки запросов
const httpLink = createHttpLink({
  uri: config.api.graphqlUrl,
});

const authLink = setContext(() => {
  try {
    const token = localStorage.getItem('auth-token')
    
    if (!token) {
      return {
        headers: {},
      }
    }

    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  } catch (error) {
    console.warn('Ошибка при получении токена авторизации:', error)
    return {
      headers: {},
    }
  }
})


// Error Link для обработки ошибок
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      const errorMessage = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      
      // Логируем только если включено логирование
      if (config.logging.enabled) {
        console.error(errorMessage)
      }
      
      // Дополнительное логирование в режиме разработки
      if (config.debug.graphql) {
        console.group('🚨 GraphQL Error Details')
        console.log('Operation:', operation.operationName)
        console.log('Variables:', operation.variables)
        console.log('Query:', operation.query.loc?.source.body)
        console.groupEnd()
      }
    })
  }

  if (networkError) {
    const errorMessage = `[Network error]: ${networkError}`
    
    if (config.logging.enabled) {
      console.error(errorMessage)
    }
    
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      try {
        localStorage.removeItem('auth-token')
      } catch (error) {
        console.warn('Ошибка при удалении токена:', error)
      }
    }
  }
})

// Создаем Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink,  authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      // Настройки кэширования для конкретных типов
      Query: {
        fields: {
          // Пример: кэширование списков с пагинацией
          // sports: {
          //   keyArgs: false,
          //   merge(existing = [], incoming) {
          //     return [...existing, ...incoming]
          //   },
          // },
        },
      },
    },
    // Добавляем дебаг информацию в режиме разработки
    ...(config.debug.cache && {
      addTypename: true,
    }),
  }),
  
  // Включаем DevTools в зависимости от настроек
  connectToDevTools: true,
  
  // Настройки по умолчанию для запросов на основе env
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      // Отключаем кэш в режиме mock данных
      fetchPolicy: 'cache-first',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
}) 