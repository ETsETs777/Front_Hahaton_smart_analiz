import { useQuery, QueryHookOptions } from '@apollo/client'
import { useState, useCallback, useMemo } from 'react'
import type { DocumentNode } from 'graphql'

interface PaginationParams {
  page: number
  limit: number
}

interface UseQueryWithPaginationOptions<TData, TVariables> extends QueryHookOptions<TData, TVariables> {
  initialPage?: number
  initialLimit?: number
}

export const useQueryWithPagination = <TData = any, TVariables = any>(
  query: DocumentNode,
  options: UseQueryWithPaginationOptions<TData, TVariables> = {}
) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    variables,
    ...queryOptions
  } = options

  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit,
  })

  const queryVariables = useMemo(() => ({
    ...variables,
    page: pagination.page,
    limit: pagination.limit,
  } as TVariables), [variables, pagination])

  const queryResult = useQuery<TData, TVariables>(query, {
    ...queryOptions,
    variables: queryVariables,
  })

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  const setPageSize = useCallback((limit: number) => {
    setPagination({ limit, page: 1 })
  }, [])

  return {
    ...queryResult,
    pagination,
    goToPage,
    setPageSize,
  }
}

