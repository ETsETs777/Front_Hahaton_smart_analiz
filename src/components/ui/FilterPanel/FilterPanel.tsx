import { Card, Space, Button } from 'antd'
import { FilterOutlined, ClearOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'
import './FilterPanel.scss'

interface FilterPanelProps {
  children: ReactNode
  onClear?: () => void
  title?: string
}

export const FilterPanel = ({
  children,
  onClear,
  title = 'Фильтры',
}: FilterPanelProps) => {
  return (
    <Card
      className="filter-panel"
      title={
        <Space>
          <FilterOutlined />
          <span>{title}</span>
        </Space>
      }
      extra={
        onClear && (
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

