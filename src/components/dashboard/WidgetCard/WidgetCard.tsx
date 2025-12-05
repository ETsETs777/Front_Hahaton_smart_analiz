import { Card } from 'antd'
import type { ReactNode } from 'react'
import './WidgetCard.scss'

export interface WidgetCardProps {
  title: ReactNode
  extra?: ReactNode
  children: ReactNode
  loading?: boolean
  className?: string
  actions?: ReactNode[]
}

const WidgetCard = ({ title, extra, children, loading, className, actions }: WidgetCardProps) => {
  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      className={`widget-card ${className || ''}`}
      actions={actions}
    >
      {children}
    </Card>
  )
}

export default WidgetCard

