import { LoadingSpinner } from '@/components/ui'
import {
  useGetCurrentUserQuery,
  type GetCurrentUserQuery
} from '@/graphql/generated'
import { App } from 'antd'
import React, { createContext, useContext, useEffect, useState } from 'react'

type User = GetCurrentUserQuery['getCurrentUser']

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string) => void
  refetchUser: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { message } = App.useApp()
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const { data, loading: queryLoading, refetch } = useGetCurrentUserQuery({
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    skip: !localStorage.getItem('auth-token')
  })

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      setLoading(false)
      setInitialized(true)
      return
    }

    if (data?.getCurrentUser) {
      setUserState(data.getCurrentUser)
      setLoading(false)
      setInitialized(true)
    } else if (!queryLoading) {
      setLoading(false)
      setInitialized(true)
    }
  }, [data, queryLoading])

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
  }

  const setToken = (token: string) => {
    localStorage.setItem('auth-token', token)
  }

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('auth-token')
      setUserState(null)
      message.success('Вы вышли из системы')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refetchUser = async () => {
    try {
      const result = await refetch()
      if (result.data?.getCurrentUser) {
        setUserState(result.data.getCurrentUser)
      }
      return result
    } catch (error) {
      console.error('Ошибка обновления данных пользователя:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user: user,
    loading,
    logout,
    isAuthenticated: !!user,
    setUser,
    setToken,
    refetchUser
  }

  if (!initialized || loading) {
    return <LoadingSpinner />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
