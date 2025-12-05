import { Empty, Button } from 'antd'
import { ReactNode } from 'react'
import './EmptyState.scss'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  image?: string
}

export const EmptyState = ({
  title = 'Нет данных',
  description = 'Здесь пока ничего нет',
  icon,
  action,
  image,
}: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{ height: 120 }}
        description={
          <div className="empty-state-content">
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {action && (
              <Button type="primary" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
          </div>
        }
      />
    </div>
  )
}

