import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GetAccountsDocument, GetTransactionsDocument } from '@/graphql/generated'
import { useDashboardStats } from './hooks'
import WidgetsGrid from './components/WidgetsGrid'
import { WelcomeModal } from '@/components/common/WelcomeModal'
import './dashboard.scss'

const FIRST_VISIT_KEY = 'smart-account-first-visit'

const DashboardPage = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const { data: accountsData, loading: accountsLoading } = useQuery(GetAccountsDocument)
  const { data: transactionsData, loading: transactionsLoading } = useQuery(GetTransactionsDocument)
  const { stats, loading: statsLoading } = useDashboardStats()

  const accounts = accountsData?.accounts || []
  const transactions = transactionsData?.transactions || []

  useEffect(() => {
    const hasVisited = localStorage.getItem(FIRST_VISIT_KEY)
    if (!hasVisited) {
      setTimeout(() => {
        setShowWelcomeModal(true)
        localStorage.setItem(FIRST_VISIT_KEY, 'true')
      }, 500)
    }
  }, [])

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false)
  }

  return (
    <>
      <div className="dashboard-page">
        <div className="dashboard-container">
          <WidgetsGrid
            accounts={accounts}
            transactions={transactions}
            accountsLoading={accountsLoading}
            transactionsLoading={transactionsLoading}
            financeStats={stats}
            financeLoading={statsLoading}
          />
        </div>
      </div>
      <WelcomeModal visible={showWelcomeModal} onClose={handleCloseWelcome} />
    </>
  )
}

export default DashboardPage
