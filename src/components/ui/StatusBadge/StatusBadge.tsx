import { Badge, BadgeProps } from 'antd'
import { ReactNode } from 'react'

type StatusType = 'success' | 'error' | 'warning' | 'processing' | 'default'

interface StatusBadgeProps extends Omit<BadgeProps, 'status'> {
  status: StatusType
  text?: string
  children?: ReactNode
}

const statusConfig: Record<StatusType, { color: string; text?: string }> = {
  success: { color: '#52c41a', text: 'Успешно' },
  error: { color: '#ff4d4f', text: 'Ошибка' },
  warning: { color: '#faad14', text: 'Предупреждение' },
  processing: { color: '#1890ff', text: 'В процессе' },
  default: { color: '#d9d9d9', text: 'По умолчанию' },
}

export const StatusBadge = ({
  status,
  text,
  children,
  ...badgeProps
}: StatusBadgeProps) => {
  const config = statusConfig[status]
  const displayText = text || config.text

  return (
    <Badge
      {...badgeProps}
      status={status}
      text={displayText}
      color={config.color}
    >
      {children}
    </Badge>
  )
}

