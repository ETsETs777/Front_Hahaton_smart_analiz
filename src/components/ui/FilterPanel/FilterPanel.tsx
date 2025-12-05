import { Card, Space, Button } from 'antd'
import { FilterOutlined, ClearOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'
import './FilterPanel.scss'

interface FilterPanelProps {
  children: ReactNode
  onClear?: () => void
  showClear?: boolean
  title?: string
  className?: string
}

export const FilterPanel = ({
  children,
  onClear,
  showClear = true,
  title = 'Фильтры',
  className = '',
}: FilterPanelProps) => {
  return (
    <Card
      className={`filter-panel ${className}`}
      title={
        <Space>
          <FilterOutlined />
          <span>{title}</span>
        </Space>
      }
      extra={
        showClear && onClear && (
          <Button
            type="text"
            icon={<ClearOutlined />}
            onClick={onClear}
            size="small"
          >
            Очистить
          </Button>
        )
      }
    >
      {children}
    </Card>
  )
}

