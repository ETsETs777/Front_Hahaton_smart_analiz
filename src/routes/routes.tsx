import App from '@/App'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'
import LandingPage from '@/pages/landing'
import HowItWorksPage from '@/pages/how-it-works'
import DashboardPage from '@/pages/dashboard'
import ProfilePage from '@/pages/profile'
import AccountsPage from '@/pages/accounts'
import TransactionsPage from '@/pages/transactions'
import AnalyticsPage from '@/pages/analytics'
import BudgetPage from '@/pages/budget'
import NotFoundPage from '@/pages/404'
import { useAuth } from '@/contexts/auth-context'
import { Navigate } from 'react-router'
import { LoadingSpinner } from '@/components/ui'
import type { ReactNode } from 'react'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const IndexRedirect = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/landing" replace />
}

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <IndexRedirect />
      },
      {
        path: 'landing',
        element: <LandingPage />
      },
      {
        path: 'how-it-works',
        element: <HowItWorksPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: 'accounts',
        element: (
          <ProtectedRoute>
            <AccountsPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'transactions',
        element: (
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'analytics',
        element: (
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'budget',
        element: (
          <ProtectedRoute>
            <BudgetPage />
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]
