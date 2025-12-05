import { Empty, Button } from 'antd'
import { ReactNode } from 'react'
import './EmptyState.scss'

interface EmptyStateProps {
  title?: string
  description?: string
  image?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export const EmptyState = ({
  title = 'Нет данных',
  description = 'Здесь пока ничего нет',
  image,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <div className={`empty-state ${className}`}>
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="empty-state-content">
            <div className="empty-state-title">{title}</div>
            <div className="empty-state-description">{description}</div>
            {action && (
              <Button type="primary" onClick={action.onClick} className="empty-state-action">
                {action.label}
              </Button>
            )}
          </div>
        }
      />
    </div>
  )
}

