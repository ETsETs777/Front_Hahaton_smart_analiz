import { useMutation, MutationHookOptions, MutationResult } from '@apollo/client'
import { message } from 'antd'
import { useCallback } from 'react'
import type { DocumentNode } from 'graphql'

interface UseMutationWithErrorOptions<TData, TVariables> extends Omit<MutationHookOptions<TData, TVariables>, 'onError'> {
  showError?: boolean
  successMessage?: string
}

export const useMutationWithError = <TData = any, TVariables = any>(
  mutation: DocumentNode,
  options: UseMutationWithErrorOptions<TData, TVariables> = {}
) => {
  const {
    showError = true,
    successMessage,
    onCompleted,
    ...mutationOptions
  } = options

  const handleError = useCallback((error: Error) => {
    if (showError) {
      message.error(error.message || 'Произошла ошибка при выполнении операции')
    }
  }, [showError])

  const handleSuccess = useCallback((data: TData) => {
    if (successMessage) {
      message.success(successMessage)
    }
    onCompleted?.(data)
  }, [successMessage, onCompleted])

  const [mutate, result] = useMutation<TData, TVariables>(mutation, {
    ...mutationOptions,
    onError: (error) => {
      handleError(error)
      mutationOptions.onError?.(error)
    },
    onCompleted: handleSuccess,
  })

  return [mutate, result] as [typeof mutate, MutationResult<TData, TVariables>]
}

