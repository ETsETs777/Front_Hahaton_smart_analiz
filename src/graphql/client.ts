import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { config, isDevelopment, logConfig, validateEnv } from '@/lib/env'

// Валидируем переменные окружения при инициализации
const envValidation = validateEnv()
if (!envValidation.isValid) {
  console.error('❌ Ошибки конфигурации:', envValidation.errors)
}

if (isDevelopment()) {
  logConfig()
}

const httpLink = createHttpLink({
  uri: config.api.graphqlUrl,
})

const authLink = setContext(() => {
  const token = localStorage.getItem('auth-token')

  return {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})


// Error Link для обработки ошибок
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
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
    
    // Если ошибка авторизации, можно перенаправить на страницу входа
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('auth-token')
      // window.location.href = '/login'
    }
  }
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {},
      },
    },
    ...(config.debug.cache && {
      addTypename: true,
    }),
  }),

  connectToDevTools: true,

  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
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