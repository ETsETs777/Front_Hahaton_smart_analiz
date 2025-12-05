import { Row, Col } from 'antd'
import StatCard from '@/components/dashboard/StatCard'
import { STATS_CONFIG, DASHBOARD_GRID_GUTTER } from '@/constants'
import type { DashboardStats } from '../../types'
import './StatsGrid.scss'

interface StatsGridProps {
  stats: DashboardStats
  loading?: boolean
}

const StatsGrid = ({ stats, loading }: StatsGridProps) => {
  return (
    <Row gutter={[16, 16]} className="stats-grid">
      {STATS_CONFIG.map((config) => (
        <Col xs={24} sm={12} lg={config.type === 'balance' ? 24 : 12} key={config.type}>
          <StatCard
            type={config.type}
            title={config.title}
            value={config.getValue(stats)}
            loading={loading}
          />
        </Col>
      ))}
    </Row>
  )
}

export default StatsGrid
