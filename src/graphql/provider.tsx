import { ApolloProvider } from '@apollo/client'
import type { ReactNode } from 'react'
import { apolloClient } from './client'

interface GraphQLProviderProps {
  children: ReactNode
}

/**
 * Провайдер Apollo Client для всего приложения
 * Обеспечивает доступ к GraphQL клиенту во всех компонентах
 */
export const GraphQLProvider = ({ children }: GraphQLProviderProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
} 