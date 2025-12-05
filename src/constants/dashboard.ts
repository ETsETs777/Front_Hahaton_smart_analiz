import type { StatCardType } from '@/components/dashboard/StatCard'

export interface StatCardConfig {
  type: StatCardType
  title: string
  getValue: (stats: {
    totalBalance: number
    income: number
    expense: number
    balance: number
  }) => number
}

export const STATS_CONFIG: StatCardConfig[] = [
  {
    type: 'balance',
    title: 'Общий баланс',
    getValue: (stats) => stats.totalBalance
  },
  {
    type: 'income',
    title: 'Доход',
    getValue: (stats) => stats.income
  },
  {
    type: 'expense',
    title: 'Расход',
    getValue: (stats) => stats.expense
  }
]

export const DASHBOARD_GRID_GUTTER: [number, number] = [24, 24]
export const TRANSACTIONS_LIMIT = 10
export const ANALYTICS_LIMIT = 5

