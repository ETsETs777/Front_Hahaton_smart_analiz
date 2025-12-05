import { List, Button } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import WidgetCard from '@/components/dashboard/WidgetCard'
import { formatCurrency, formatDate } from '@/utils'
import type { TransactionEntity } from '@/graphql/generated'
import './widgets.scss'

interface TransactionWidgetProps {
  transactions: TransactionEntity[]
  loading?: boolean
}

const TransactionWidget = ({ transactions, loading }: TransactionWidgetProps) => {
  const navigate = useNavigate()

  return (
    <WidgetCard
      title={<span>Последние транзакции</span>}
      extra={<Button type="link" onClick={() => navigate('/transactions')}>Все транзакции</Button>}
      loading={loading}
    >
      {transactions.length === 0 ? (
        <div className="empty-state">Нет транзакций</div>
      ) : (
        <List
          dataSource={transactions}
          className="widget-list"
          renderItem={(transaction) => (
            <List.Item className="widget-list-item transaction-item">
              <div className="transaction-content">
                <div className={`transaction-icon ${transaction.type.toLowerCase()}`}>
                  {transaction.type === 'INCOME' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                </div>
                <div className="transaction-info">
                  <div className="transaction-description">
                    {transaction.description || 'Без описания'}
                  </div>
                  <div className="transaction-meta">
                    {formatDate(transaction.date)} • {transaction.category}
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(transaction.amount, '')}
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </WidgetCard>
  )
}

export default TransactionWidget
