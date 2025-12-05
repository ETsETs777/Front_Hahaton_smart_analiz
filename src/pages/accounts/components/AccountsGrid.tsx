import { Empty, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { AccountCard } from './AccountCard'
import { AccountWizard } from './AccountWizard'
import type { AccountEntity } from '@/graphql/generated'
import './AccountsGrid.scss'

interface AccountsGridProps {
  accounts: AccountEntity[]
  loading?: boolean
  onRefresh: () => void
}

export function AccountsGrid({ accounts, loading, onRefresh }: AccountsGridProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountEntity | null>(null)

  const handleAddClick = () => {
    setEditingAccount(null)
    setModalVisible(true)
  }

  const handleEdit = (account: AccountEntity) => {
    setEditingAccount(account)
    setModalVisible(true)
  }

  const handleDelete = async () => {
    onRefresh()
  }

  const handleSetDefault = async () => {
    onRefresh()
  }

  const handleModalSuccess = () => {
    onRefresh()
  }

  if (loading) {
    return (
      <div className="accounts-grid-loading">
        <Spin size="large" />
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <>
        <div className="accounts-grid-empty">
          <Empty
            description={
              <div className="empty-content">
                <div className="empty-title">Нет счетов</div>
                <div className="empty-subtitle">Создайте свой первый счет для начала работы</div>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <button 
              className="empty-add-button" 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddClick()
              }}
              type="button"
            >
              <PlusOutlined />
              <span>Создать счет</span>
            </button>
          </Empty>
        </div>

        <AccountWizard
          visible={modalVisible}
          account={editingAccount}
          onClose={() => {
            setModalVisible(false)
            setEditingAccount(null)
          }}
          onSuccess={handleModalSuccess}
        />
      </>
    )
  }

  return (
    <>
      <div className="accounts-grid">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        ))}
        <div 
          className="account-card add-card" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAddClick()
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleAddClick()
            }
          }}
        >
          <div className="add-card-content">
            <div className="add-card-icon">
              <PlusOutlined />
            </div>
            <div className="add-card-text">Добавить счет</div>
          </div>
        </div>
      </div>

      <AccountWizard
        visible={modalVisible}
        account={editingAccount}
        onClose={() => {
          setModalVisible(false)
          setEditingAccount(null)
        }}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

