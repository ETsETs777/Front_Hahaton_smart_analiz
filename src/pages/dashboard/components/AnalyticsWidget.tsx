import { Button, Empty, Tag } from 'antd'
import { useNavigate } from 'react-router'
import { useQuery } from '@apollo/client'
import { useMemo, useEffect, useState } from 'react'
import WidgetCard from '@/components/dashboard/WidgetCard'
import { GetAnalyticsTasksDocument } from '@/graphql/generated'
import { ANALYTICS_LIMIT } from '@/constants'
import type { AnalyticsTaskEntity, AnalyticsType, AnalyticsStatus } from '@/graphql/generated'
import { AnalyticsDetailsModal } from '@/pages/analytics/components/AnalyticsDetailsModal'

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

const AnalyticsWidget = () => {
  const navigate = useNavigate()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const { data, loading, startPolling, stopPolling } = useQuery(GetAnalyticsTasksDocument, {
    variables: { filter: {} },
    fetchPolicy: 'network-only'
  })

  const analyticsTasks = useMemo(() => data?.analyticsTasks || [], [data?.analyticsTasks])
  const displayedTasks = analyticsTasks.slice(0, ANALYTICS_LIMIT)

  const hasActiveStatus = useMemo(() => {
    return analyticsTasks.some(
      (task: AnalyticsTaskEntity) => 
        task.status === 'PENDING' || task.status === 'PROCESSING'
    )
  }, [analyticsTasks])

  useEffect(() => {
    if (hasActiveStatus) {
      startPolling(2000)
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [hasActiveStatus, startPolling, stopPolling])

  return (
    <WidgetCard
      title={<span>AI Аналитика</span>}
      extra={<Button type="link" onClick={() => navigate('/analytics')}>Все аналитики</Button>}
      loading={loading}
    >
      {displayedTasks.length === 0 ? (
        <Empty description="Нет задач аналитики" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={() => navigate('/analytics')}>
            Создать анализ
          </Button>
        </Empty>
      ) : (
        <div>
          {displayedTasks.map((task: AnalyticsTaskEntity) => (
            <div 
              key={task.id} 
              style={{ 
                padding: '0.75rem', 
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => setSelectedTaskId(task.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  {ANALYTICS_TYPE_LABELS[task.type]}
                </div>
                <Tag color={STATUS_COLORS[task.status]} style={{ margin: 0 }}>
                  {STATUS_LABELS[task.status]}
                </Tag>
              </div>
              {task.comment && (
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                  {task.comment}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <AnalyticsDetailsModal
        visible={!!selectedTaskId}
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </WidgetCard>
  )
}

export default AnalyticsWidget
