import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Result, Button } from 'antd'
import { useAuth } from '@/contexts/auth-context'
import { LoadingSpinner } from '@/components/ui'

interface ProtectedRouteProps {
    children: React.ReactNode
    fallbackPath?: string
}

export const ProtectedRoute = ({ children, fallbackPath = '/login' }: ProtectedRouteProps) => {
    const { user, isAuthenticated, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate(fallbackPath)
        }
    }, [isAuthenticated, loading, navigate, fallbackPath])

    if (loading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
