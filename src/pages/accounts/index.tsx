import { useQuery } from '@apollo/client'
import { GetAccountsDocument } from '@/graphql/generated'
import { AccountsGrid } from './components/AccountsGrid'
import './accounts.scss'

const AccountsPage = () => {
  const { data, loading, refetch } = useQuery(GetAccountsDocument)

  const accounts = data?.accounts || []

  return (
    <div className="accounts-page">
      <div className="accounts-container">
        <div className="accounts-header">
          <div>
            <h1 className="accounts-title">Счета</h1>
            <p className="accounts-subtitle">Управление вашими счетами</p>
          </div>
        </div>
        <div className="accounts-grid-wrapper">
          <AccountsGrid
            accounts={accounts}
            loading={loading}
            onRefresh={refetch}
          />
        </div>
      </div>
    </div>
  )
}

export default AccountsPage

