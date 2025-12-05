import { useState, useMemo } from 'react'
import { ArrowUpOutlined, ArrowDownOutlined, WalletOutlined, RiseOutlined } from '@ant-design/icons'
import { Row, Col, DatePicker } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import type React from 'react'
import WidgetCard from '@/components/dashboard/WidgetCard'
import { formatCurrency } from '@/utils'
import type { DashboardStats } from '../../types'
import './FinancePieWidget.scss'

interface FinancePieWidgetProps {
  stats: DashboardStats
  loading?: boolean
}

const COLORS = {
  balance: '#3b82f6',
  income: '#10b981',
  expense: '#ef4444'
}

const MOCK_TRENDS = {
  balance: 18.4,
  income: 35.2,
  expense: -22.1
}

const { RangePicker } = DatePicker

interface PieChartComponentProps {
  data: Array<{ name: string; value: number; color: string }>
}

const PieChartComponent = ({ data }: PieChartComponentProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const size = 180
  const center = size / 2
  const outerRadius = 80
  const innerRadius = 30
  
  let currentAngle = -90
  
  const segments = data.map((item) => {
    const percentage = total > 0 ? item.value / total : 0
    const angle = percentage * 360
    const startAngle = currentAngle
    currentAngle += angle
    
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (currentAngle * Math.PI) / 180
    
    const x1 = center + outerRadius * Math.cos(startAngleRad)
    const y1 = center + outerRadius * Math.sin(startAngleRad)
    const x2 = center + outerRadius * Math.cos(endAngleRad)
    const y2 = center + outerRadius * Math.sin(endAngleRad)
    
    const x3 = center + innerRadius * Math.cos(endAngleRad)
    const y3 = center + innerRadius * Math.sin(endAngleRad)
    const x4 = center + innerRadius * Math.cos(startAngleRad)
    const y4 = center + innerRadius * Math.sin(startAngleRad)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const outerPath = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
    const innerPath = `L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`
    
    const labelAngle = (startAngle + angle / 2) * Math.PI / 180
    const labelRadius = (innerRadius + outerRadius) / 2
    const labelX = center + labelRadius * Math.cos(labelAngle)
    const labelY = center + labelRadius * Math.sin(labelAngle)
    
    return {
      ...item,
      path: `${outerPath} ${innerPath}`,
      labelX,
      labelY,
      percentage,
      angle: startAngle + angle / 2
    }
  })
  
  return (
    <div className="pie-chart-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pie-chart-svg">
        {segments.map((segment, index) => (
          <g key={`segment-${index}`}>
            <path
              d={segment.path}
              fill={segment.color}
              stroke="#ffffff"
              strokeWidth={2}
            />
            {segment.percentage > 0.05 && (
              <text
                x={segment.labelX}
                y={segment.labelY}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
                fontWeight={600}
              >
                {`${(segment.percentage * 100).toFixed(0)}%`}
              </text>
            )}
          </g>
        ))}
        {total === 0 && (
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="#e5e7eb"
            stroke="#d1d5db"
            strokeWidth={2}
          />
        )}
      </svg>
      <div className="pie-legend">
        {data.map((item, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-label">{item.name}:</span>
            <span className="legend-value">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const FinancePieWidget = ({ stats, loading }: FinancePieWidgetProps) => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ])
  
  const mockStats = useMemo(() => {
    let dateMultiplier = 1
    if (dateRange && dateRange[0] && dateRange[1]) {
      const daysDiff = dateRange[1].diff(dateRange[0], 'days') + 1
      dateMultiplier = daysDiff / 30
    }
    
    const baseBalance = stats.totalBalance || 125430
    const baseIncome = stats.income || 45200
    const baseExpense = stats.expense || 32800
    
    return {
      totalBalance: baseBalance * dateMultiplier,
      income: baseIncome * dateMultiplier,
      expense: baseExpense * dateMultiplier,
      balance: (baseIncome - baseExpense) * dateMultiplier
    }
  }, [stats.totalBalance, stats.income, stats.expense, dateRange])
  
  const trends = MOCK_TRENDS
  const data = useMemo(() => [
    {
      name: 'Общий баланс',
      value: Math.abs(mockStats.totalBalance),
      color: COLORS.balance
    },
    {
      name: 'Доход',
      value: Math.abs(mockStats.income),
      color: COLORS.income
    },
    {
      name: 'Расход',
      value: Math.abs(mockStats.expense),
      color: COLORS.expense
    }
  ].filter((item) => item.value > 0), [mockStats])

  const allData = useMemo(() => [
    {
      name: 'Общий баланс',
      value: Math.abs(mockStats.totalBalance),
      color: COLORS.balance
    },
    {
      name: 'Доход',
      value: Math.abs(mockStats.income),
      color: COLORS.income
    },
    {
      name: 'Расход',
      value: Math.abs(mockStats.expense),
      color: COLORS.expense
    }
  ], [mockStats])

  return (
    <div className="finance-overview-widget">
      <WidgetCard
        title={<span>Финансовый обзор</span>}
        extra={
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="DD.MM.YYYY"
            placeholder={['Дата начала', 'Дата окончания']}
            className="date-picker"
            style={{ width: '230px', height: '30px' }}
            allowClear
          />
        }
        loading={loading}
        className="premium-widget"
      >
        <div className="finance-stats-grid">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <div className="stat-mini-card balance">
                <div className="stat-mini-icon">
                  <WalletOutlined />
                </div>
                <div className="stat-mini-content">
                  <div className="stat-mini-label">Баланс</div>
                  <div className="stat-mini-value">{formatCurrency(mockStats.totalBalance)}</div>
                  <div className={`stat-mini-trend ${trends.balance > 0 ? 'positive' : 'negative'}`}>
                    {trends.balance > 0 ? <RiseOutlined /> : <ArrowDownOutlined />}
                    <span>{Math.abs(trends.balance)}%</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="stat-mini-card income">
                <div className="stat-mini-icon">
                  <ArrowUpOutlined />
                </div>
                <div className="stat-mini-content">
                  <div className="stat-mini-label">Доход</div>
                  <div className="stat-mini-value">{formatCurrency(mockStats.income)}</div>
                  <div className="stat-mini-trend positive">
                    <RiseOutlined />
                    <span>{Math.abs(trends.income)}%</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="stat-mini-card expense">
                <div className="stat-mini-icon">
                  <ArrowDownOutlined />
                </div>
                <div className="stat-mini-content">
                  <div className="stat-mini-label">Расход</div>
                  <div className="stat-mini-value">{formatCurrency(mockStats.expense)}</div>
                  <div className="stat-mini-trend negative">
                    <ArrowDownOutlined />
                    <span>{Math.abs(trends.expense)}%</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="finance-pie-widget">
          <PieChartComponent 
            data={data.length > 0 ? data : allData} 
            key={`pie-${dateRange?.[0]?.format('YYYY-MM-DD') || 'default'}-${dateRange?.[1]?.format('YYYY-MM-DD') || 'default'}`}
          />
        </div>
      </WidgetCard>
    </div>
  )
}

export default FinancePieWidget

