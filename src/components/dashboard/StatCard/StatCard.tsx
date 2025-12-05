import { Card, Statistic } from 'antd'
import { WalletOutlined, TrendingUpOutlined, TrendingDownOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'
import './StatCard.scss'

export type StatCardType = 'balance' | 'income' | 'expense'

export interface StatCardProps {
  type: StatCardType
  title: string
  value: number
  loading?: boolean
  prefix?: ReactNode
  suffix?: string
  precision?: number
}

const iconMap = {
  balance: WalletOutlined,
  income: TrendingUpOutlined,
  expense: TrendingDownOutlined
}

const StatCard = ({ type, title, value, loading, prefix, suffix = '₽', precision }: StatCardProps) => {
  const Icon = iconMap[type]

  return (
    <Card className={`stat-card stat-card-${type}`}>
      <div className="stat-content">
        <div className={`stat-icon-wrapper ${type}`}>
          <Icon />
        </div>
        <div className="stat-text">
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            loading={loading}
            precision={precision}
          />
        </div>
      </div>
    </Card>
  )
}

export default StatCard

