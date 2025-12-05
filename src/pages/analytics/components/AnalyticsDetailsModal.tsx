import { Modal, Tag, Descriptions, Typography, Spin } from 'antd'
import { useQuery } from '@apollo/client'
import { GetAnalyticsTaskDocument } from '@/graphql/generated'
import type { AnalyticsTaskEntity, AnalyticsType, AnalyticsStatus } from '@/graphql/generated'
import { formatDate } from '@/utils'
import './AnalyticsDetailsModal.scss'

const { Title, Text } = Typography

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

interface AnalyticsDetailsModalProps {
  visible: boolean
  taskId: string | null
  onClose: () => void
}

export function AnalyticsDetailsModal({ visible, taskId, onClose }: AnalyticsDetailsModalProps) {
  const { data, loading } = useQuery(GetAnalyticsTaskDocument, {
    variables: { id: taskId || '' },
    skip: !taskId || !visible,
    fetchPolicy: 'network-only'
  })

  const task = data?.analyticsTask

  return (
    <Modal
      title="Детали аналитики"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="analytics-details-modal"
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : task ? (
        <div className="analytics-details-content">
          <div className="analytics-details-header">
            <Title level={4} style={{ margin: 0 }}>
              {ANALYTICS_TYPE_LABELS[task.type]}
            </Title>
            <Tag color={STATUS_COLORS[task.status]} style={{ fontSize: '0.875rem', padding: '4px 12px' }}>
              {STATUS_LABELS[task.status]}
            </Tag>
          </div>

          <Descriptions column={1} bordered className="analytics-details-descriptions">
            {task.comment && (
              <Descriptions.Item label="Комментарий">
                <Text>{task.comment}</Text>
              </Descriptions.Item>
            )}

            {task.account && (
              <Descriptions.Item label="Счет">
                <Text strong>{task.account.name}</Text>
              </Descriptions.Item>
            )}

            {task.dateFrom && task.dateTo && (
              <Descriptions.Item label="Период">
                <Text>
                  {formatDate(task.dateFrom)} - {formatDate(task.dateTo)}
                </Text>
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Создано">
              <Text>{formatDate(task.createdAt)}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Обновлено">
              <Text>{formatDate(task.updatedAt)}</Text>
            </Descriptions.Item>
          </Descriptions>

          {task.result && task.status === 'COMPLETED' && (
            <div className="analytics-details-result">
              <Title level={5}>Результат анализа</Title>
              <div className="analytics-result-content">
                <pre>{JSON.stringify(JSON.parse(task.result), null, 2)}</pre>
              </div>
            </div>
          )}

          {task.error && task.status === 'FAILED' && (
            <div className="analytics-details-error">
              <Title level={5} type="danger">Ошибка</Title>
              <div className="analytics-error-content">
                <Text type="danger">{task.error}</Text>
              </div>
            </div>
          )}

          {(task.status === 'PENDING' || task.status === 'PROCESSING') && (
            <div className="analytics-details-processing">
              <Text type="secondary">
                {task.status === 'PROCESSING' 
                  ? 'Аналитика обрабатывается. Результаты появятся здесь после завершения.'
                  : 'Аналитика ожидает обработки.'}
              </Text>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text type="secondary">Задача не найдена</Text>
        </div>
      )}
    </Modal>
  )
}

