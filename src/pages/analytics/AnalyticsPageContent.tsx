import { useState, useCallback, useMemo, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { 
  Card, 
  Button, 
  Empty, 
  Tag, 
  Typography,
  Space,
  Select,
  DatePicker,
  Spin
} from 'antd'
import { Plus, RotateCcw } from 'lucide-react'
import { GetAnalyticsTasksDocument } from '@/graphql/generated'
import type { 
  AnalyticsTaskEntity, 
  AnalyticsType, 
  AnalyticsStatus,
  AnalyticsFilterInput
} from '@/graphql/generated'
import { formatDate } from '@/utils'
import { useGetAccountsQuery } from '@/graphql/generated'
import type { Dayjs } from 'dayjs'
import { AnalyticsWizard } from './components/AnalyticsWizard'
import './analytics.scss'

const { Title } = Typography
const { RangePicker } = DatePicker

const ANALYTICS_TYPE_LABELS: Record<AnalyticsType, string> = {
  SPENDING_PATTERNS: 'Паттерны расходов',
  INCOME_ANALYSIS: 'Анализ доходов',
  BUDGET_COMPLIANCE: 'Соответствие бюджету',
  CATEGORY_BREAKDOWN: 'Разбивка по категориям',
  TREND_ANALYSIS: 'Анализ трендов'
}

const STATUS_COLORS: Record<AnalyticsStatus, string> = {
  PENDING: 'default',
  PROCESSING: 'processing',
  COMPLETED: 'success',
  FAILED: 'error'
}

const STATUS_LABELS: Record<AnalyticsStatus, string> = {
  PENDING: 'Ожидание',
  PROCESSING: 'Обработка',
  COMPLETED: 'Завершено',
  FAILED: 'Ошибка'
}

export function AnalyticsPageContent() {
  const [filters, setFilters] = useState<AnalyticsFilterInput>({})
  const [wizardVisible, setWizardVisible] = useState(false)
  
  const { data: accountsData } = useGetAccountsQuery()
  const accounts = accountsData?.accounts || []

  const { data, loading, refetch, startPolling, stopPolling } = useQuery(GetAnalyticsTasksDocument, {
    variables: { filter: filters },
    fetchPolicy: 'network-only'
  })

  const analyticsTasks = useMemo(() => data?.analyticsTasks || [], [data?.analyticsTasks])

  const hasActiveTasks = useMemo(() => {
    return analyticsTasks.some(
      (task: AnalyticsTaskEntity) => 
        task.status === 'PENDING' || task.status === 'PROCESSING'
    )
  }, [analyticsTasks])

  useEffect(() => {
    if (hasActiveTasks) {
      startPolling(2000)
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [hasActiveTasks, startPolling, stopPolling])

  const handleFilterChange = useCallback((key: keyof AnalyticsFilterInput, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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
        const newFilters = { ...prev }
        delete newFilters.dateFrom
        delete newFilters.dateTo
        return newFilters
      })
    }
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({})
  }, [])

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0
  }, [filters])

  return (
    <div className="analytics-page-content">
      <div className="analytics-header">
        <div>
          <Title level={2} className="analytics-title">AI Аналитика</Title>
          <p className="analytics-subtitle">Анализ ваших финансовых данных</p>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={16} />}
          onClick={() => setWizardVisible(true)}
        >
          Создать анализ
        </Button>
      </div>

      <Card className="filters-card">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="filters-row">
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
              placeholder="Тип аналитики"
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              allowClear
              style={{ minWidth: 200 }}
              options={Object.entries(ANALYTICS_TYPE_LABELS).map(([value, label]) => ({
                label,
                value
              }))}
            />

            <Select
              placeholder="Статус"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
              style={{ minWidth: 150 }}
              options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
                label,
                value
              }))}
            />

            <RangePicker
              onChange={handleDateRangeChange}
              format="DD.MM.YYYY"
              placeholder={['От', 'До']}
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

      <Card className="analytics-list-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : analyticsTasks.length === 0 ? (
          <Empty 
            description="Нет задач аналитики"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => setWizardVisible(true)}>
              Создать анализ
            </Button>
          </Empty>
        ) : (
          <div className="analytics-list">
            {analyticsTasks.map((task: AnalyticsTaskEntity) => (
              <div key={task.id} className="analytics-item">
                <div className="analytics-content">
                  <div className="analytics-header-item">
                    <div>
                      <div className="analytics-type">
                        {ANALYTICS_TYPE_LABELS[task.type]}
                      </div>
                      {task.comment && (
                        <div className="analytics-comment">{task.comment}</div>
                      )}
                    </div>
                    <Tag color={STATUS_COLORS[task.status]}>
                      {STATUS_LABELS[task.status]}
                    </Tag>
                  </div>
                  <div className="analytics-meta">
                    {task.account && (
                      <span>Счет: {task.account.name}</span>
                    )}
                    {task.dateFrom && task.dateTo && (
                      <span>
                        Период: {formatDate(task.dateFrom)} - {formatDate(task.dateTo)}
                      </span>
                    )}
                    <span>Создано: {formatDate(task.createdAt)}</span>
                  </div>
                  {task.result && task.status === 'COMPLETED' && (
                    <div className="analytics-result">
                      <pre>{JSON.stringify(JSON.parse(task.result), null, 2)}</pre>
                    </div>
                  )}
                  {task.error && task.status === 'FAILED' && (
                    <div className="analytics-error">
                      Ошибка: {task.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AnalyticsWizard
        visible={wizardVisible}
        onClose={() => setWizardVisible(false)}
        onSuccess={() => {
          refetch()
          setWizardVisible(false)
        }}
      />
    </div>
  )
}

