import { List, Button, Empty, Tag, Tooltip } from 'antd'
import { PlusOutlined, StarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import WidgetCard from '@/components/dashboard/WidgetCard'
import { formatCurrency } from '@/utils'
import type { AccountEntity } from '@/graphql/generated'
import { AccountType } from '@/graphql/generated'
import { BANK_COLORS, BANK_NAMES, ACCOUNT_TYPE_LABELS, DEFAULT_BANK_COLOR } from '@/constants/banks'
import './widgets.scss'

interface AccountWidgetProps {
  accounts: AccountEntity[]
  loading?: boolean
}

const AccountWidget = ({ accounts, loading }: AccountWidgetProps) => {
  const navigate = useNavigate()

  const handleAddClick = () => {
    navigate('/accounts')
  }

  return (
    <WidgetCard
      title={<span>Счета</span>}
      extra={
        <Button type="link" icon={<PlusOutlined />} onClick={handleAddClick}>
          Добавить
        </Button>
      }
      loading={loading}
    >
      {accounts.length === 0 ? (
        <Empty
          description="Нет счетов"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '2rem 0' }}
        >
         
        </Empty>
      ) : (
        <List
          dataSource={accounts.slice(0, 5)}
          className="widget-list"
          renderItem={(account) => (
            <List.Item 
              className="widget-list-item account-widget-item"
              onClick={() => navigate('/accounts')}
              style={{ cursor: 'pointer' }}
            >
              <div className="account-item">
                <div className="account-info">
                  <div className="account-name-wrapper">
                    <div className="account-icon" style={{ background: account.bankType ? BANK_COLORS[account.bankType].gradient : DEFAULT_BANK_COLOR.gradient }}>
                      <span>{account.bankType ? BANK_COLORS[account.bankType].icon : DEFAULT_BANK_COLOR.icon}</span>
                    </div>
                    <div className="account-name">
                      {account.isDefault && (
                        <Tooltip title="Счет по умолчанию">
                          <StarOutlined className="account-default-icon" />
                        </Tooltip>
                      )}
                      {account.name}
                    </div>
                  </div>
                  <div className="account-meta">
                    <Tag 
                      color={account.type === AccountType.Current ? 'blue' : 'green'} 
                      className="account-type"
                    >
                      {ACCOUNT_TYPE_LABELS[account.type] || account.type}
                    </Tag>
                    <span className="account-bank">{account.bankType ? BANK_NAMES[account.bankType] : 'Локальный'}</span>
                  </div>
                </div>
                <div className="account-balance">{formatCurrency(account.balance)}</div>
              </div>
            </List.Item>
          )}
        />
      )}
      {accounts.length > 5 && (
        <div style={{ textAlign: 'center', padding: '0.75rem 0', borderTop: '1px solid #f1f5f9' }}>
          <Button type="link" onClick={() => navigate('/accounts')}>
            Показать все ({accounts.length})
          </Button>
        </div>
      )}
    </WidgetCard>
  )
}

export default AccountWidget
