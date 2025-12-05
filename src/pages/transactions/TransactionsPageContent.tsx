import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useLazyQuery } from '@apollo/client'
import { 
  Card, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Tag, 
  Empty, 
  Spin,
  Typography,
  theme
} from 'antd'
import { Search, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react'
import { GetTransactionsListDocument } from '@/graphql/generated'
import type { 
  TransactionEntity, 
  TransactionType, 
  TransactionStatus,
  TransactionListInput
} from '@/graphql/generated'
import { formatCurrency, formatDate } from '@/utils'
import { useGetAccountsQuery } from '@/graphql/generated'
import dayjs, { Dayjs } from 'dayjs'
import './transactions.scss'

const { RangePicker } = DatePicker
const { Title } = Typography

interface TransactionFilters {
  accountId?: string
  type?: TransactionType
  status?: TransactionStatus
  dateFrom?: string
  dateTo?: string
  category?: string
  minAmount?: number
  maxAmount?: number
  search?: string
}

const PAGE_SIZE = 20

export function TransactionsPageContent() {
  const { token } = theme.useToken()
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [transactions, setTransactions] = useState<TransactionEntity[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  
  const { data: accountsData } = useGetAccountsQuery()
  const accounts = accountsData?.accounts || []

  const [loadTransactions] = useLazyQuery(GetTransactionsListDocument, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const newTransactions = data.transactionsList.data
      if (newTransactions.length < PAGE_SIZE) {
        setHasMore(false)
      }
      setTransactions(prev => [...prev, ...newTransactions])
      setLoading(false)
    },
    onError: () => {
      setLoading(false)
    }
  })

  const currentPage = useMemo(() => {
    return Math.floor(transactions.length / PAGE_SIZE)
  }, [transactions.length])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return

    setLoading(true)
    const input: TransactionListInput = {
      skip: currentPage * PAGE_SIZE,
      take: PAGE_SIZE,
      sort: sortOrder === 'desc' ? { date: 'desc' } as any : { date: 'asc' } as any,
      accountId: filters.accountId,
      type: filters.type,
      status: filters.status,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      category: filters.category,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
      search: filters.search,
    }

    loadTransactions({ variables: { input } })
  }, [filters, sortOrder, currentPage, loading, hasMore, loadTransactions])

  const handleFilterChange = useCallback((key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setTransactions([])
    setHasMore(true)
  }, [])

  const handleDateRangeChange = useCallback((dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setFilters(prev => ({
        ...prev,
        dateFrom: dates[0]!.toISOString(),
        dateTo: dates[1]!.toISOString(),
      }))
    } else {
      setFilters(prev => {
        const { dateFrom, dateTo, ...rest } = prev
        return rest
      })
    }
    setTransactions([])
    setHasMore(true)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({})
    setTransactions([])
    setHasMore(true)
  }, [])

  useEffect(() => {
    setTransactions([])
    setHasMore(true)
    loadMore()
  }, [filters, sortOrder])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, loadMore])

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0
  }, [filters])

  return (
    <div className="transactions-page-content">
      <div className="transactions-header">
        <div>
          <Title level={2} className="transactions-title">Транзакции</Title>
          <p className="transactions-subtitle">История всех ваших транзакций</p>
        </div>
      </div>

      <Card className="filters-card">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="filters-row">
            <Input
              placeholder="Поиск по описанию..."
              prefix={<Search size={16} />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              allowClear
              style={{ maxWidth: 300 }}
            />
            
            <Select
              placeholder="Все счета"
              value={filters.accountId}
              onChange={(value) => handleFilterChange('accountId', value)}
              allowClear
              style={{ minWidth: 200 }}
              options={accounts.map(acc => ({
                label: acc.name,
                value: acc.id
              }))}
            />

            <Select
              placeholder="Тип транзакции"
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              allowClear
              style={{ minWidth: 150 }}
              options={[
                { label: 'Доход', value: 'INCOME' },
                { label: 'Расход', value: 'EXPENSE' }
              ]}
            />

            <Select
              placeholder="Статус"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
              style={{ minWidth: 150 }}
              options={[
                { label: 'Ожидание', value: 'PENDING' },
                { label: 'Завершено', value: 'COMPLETED' },
                { label: 'Ошибка', value: 'FAILED' }
              ]}
            />

            <RangePicker
              onChange={handleDateRangeChange}
              format="DD.MM.YYYY"
              placeholder={['От', 'До']}
            />

            <Select
              value={sortOrder}
              onChange={setSortOrder}
              style={{ minWidth: 120 }}
              options={[
                { label: 'Сначала новые', value: 'desc' },
                { label: 'Сначала старые', value: 'asc' }
              ]}
            />

            {hasActiveFilters && (
              <Button
                icon={<RotateCcw size={16} />}
                onClick={handleResetFilters}
              >
                Сбросить
              </Button>
            )}
          </div>
        </Space>
      </Card>

      <Card className="transactions-list-card">
        {transactions.length === 0 && !loading ? (
          <Empty description="Нет транзакций" />
        ) : (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon-wrapper">
                  <div className={`transaction-icon ${transaction.type.toLowerCase()}`}>
                    {transaction.type === 'INCOME' ? (
                      <ArrowUp size={20} />
                    ) : (
                      <ArrowDown size={20} />
                    )}
                  </div>
                </div>
                <div className="transaction-content">
                  <div className="transaction-header">
                    <span className="transaction-description">
                      {transaction.description || 'Без описания'}
                    </span>
                    <span className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount, '')}
                    </span>
                  </div>
                  <div className="transaction-meta">
                    <Tag color={transaction.type === 'INCOME' ? 'green' : 'red'}>
                      {transaction.type === 'INCOME' ? 'Доход' : 'Расход'}
                    </Tag>
                    <span>{formatDate(transaction.date)}</span>
                    <span>{transaction.category}</span>
                    {transaction.account && (
                      <span>{transaction.account.name}</span>
                    )}
                    <Tag color={
                      transaction.status === 'COMPLETED' ? 'success' :
                      transaction.status === 'PENDING' ? 'warning' :
                      'error'
                    }>
                      {transaction.status === 'COMPLETED' ? 'Завершено' :
                       transaction.status === 'PENDING' ? 'Ожидание' :
                       'Ошибка'}
                    </Tag>
                  </div>
                </div>
              </div>
            ))}
            
            <div ref={observerTarget} style={{ height: 20, marginTop: 20 }}>
              {loading && (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Spin />
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

