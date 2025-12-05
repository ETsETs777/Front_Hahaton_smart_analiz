import { ApolloError } from '@apollo/client'
import { GraphQLError } from 'graphql'

export interface ErrorDetails {
  message: string
  code?: string
  statusCode?: number
}

export const extractErrorDetails = (error: Error | ApolloError): ErrorDetails => {
  if (error instanceof ApolloError) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const graphQLError = error.graphQLErrors[0]
      return {
        message: graphQLError.message,
        code: graphQLError.extensions?.code as string,
      }
    }

    if (error.networkError) {
      const networkError = error.networkError as any
      return {
        message: networkError.message || 'Ошибка сети',
        statusCode: networkError.statusCode,
      }
    }
  }

  return {
    message: error.message || 'Неизвестная ошибка',
  }
}

export const getErrorMessage = (error: Error | ApolloError | null | undefined): string => {
  if (!error) return 'Произошла ошибка'
  const details = extractErrorDetails(error)
  return details.message
}

export const isNetworkError = (error: Error | ApolloError): boolean => {
  return error instanceof ApolloError && !!error.networkError
}

export const isAuthError = (error: Error | ApolloError): boolean => {
  if (error instanceof ApolloError) {
    if (error.networkError && 'statusCode' in error.networkError) {
      return error.networkError.statusCode === 401
    }
    return error.graphQLErrors.some(
      (err: GraphQLError) => err.extensions?.code === 'UNAUTHENTICATED'
    )
  }
  return false
}

