import { useEffect, useRef } from 'react'
import AccountWidget from '../AccountWidget'
import TransactionWidget from '../TransactionWidget'
import AnalyticsWidget from '../AnalyticsWidget'
import BudgetWidget from '../BudgetWidget'
import FinancePieWidget from '../FinancePieWidget'
import { TRANSACTIONS_LIMIT } from '@/constants'
import type { AccountEntity, TransactionEntity } from '@/graphql/generated'
import type { DashboardStats } from '../../types'
import './WidgetsGrid.scss'

interface WidgetsGridProps {
  accounts: AccountEntity[]
  transactions: TransactionEntity[]
  accountsLoading?: boolean
  transactionsLoading?: boolean
  financeStats?: DashboardStats
  financeLoading?: boolean
}

const WidgetsGrid = ({
  accounts,
  transactions,
  accountsLoading,
  transactionsLoading,
  financeStats,
  financeLoading
}: WidgetsGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const arrangeItems = () => {
      if (!gridRef.current) return
      
      const width = window.innerWidth
      const isMobile = width < 992
      
      if (isMobile) {
        const items = Array.from(gridRef.current.children) as HTMLElement[]
        items.forEach((item) => {
          item.style.position = 'relative'
          item.style.left = 'auto'
          item.style.top = 'auto'
          item.style.width = '100%'
          item.style.height = 'auto'
          item.style.opacity = '1'
          item.style.visibility = 'visible'
        })
        gridRef.current.style.height = 'auto'
        gridRef.current.style.display = 'flex'
        gridRef.current.style.flexDirection = 'column'
        return
      }

      const grid = gridRef.current
      const items = Array.from(grid.children) as HTMLElement[]
      if (items.length === 0) return

      const gap = 24
      const columnWidth = (grid.offsetWidth - gap) / 2
      const columns: number[] = [0, 0]

      items.forEach((item) => {
        const itemHeight = item.offsetHeight
        const minColumn = columns[0] <= columns[1] ? 0 : 1
        const top = columns[minColumn]
        
        item.style.position = 'absolute'
        item.style.left = `${minColumn * (columnWidth + gap)}px`
        item.style.top = `${top}px`
        item.style.width = `${columnWidth}px`
        
        columns[minColumn] += itemHeight + gap
      })

      grid.style.height = `${Math.max(...columns)}px`
    }

    const timeoutId = setTimeout(arrangeItems, 100)
    
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(arrangeItems, 100)
    })

    if (gridRef.current) {
      const items = Array.from(gridRef.current.children) as HTMLElement[]
      resizeObserver.observe(gridRef.current)
      items.forEach((item) => resizeObserver.observe(item))
    }

    window.addEventListener('resize', arrangeItems)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', arrangeItems)
      resizeObserver.disconnect()
    }
  }, [accounts, transactions, financeStats, accountsLoading, transactionsLoading, financeLoading])

  return (
    <div className="widgets-grid" ref={gridRef}>
      {financeStats && (
        <div className="widget-item">
          <FinancePieWidget stats={financeStats} loading={financeLoading} />
        </div>
      )}
      <div className="widget-item">
        <AccountWidget accounts={accounts} loading={accountsLoading} />
      </div>
      <div className="widget-item">
        <BudgetWidget />
      </div>
      <div className="widget-item">
        <TransactionWidget
          transactions={transactions.slice(0, TRANSACTIONS_LIMIT)}
          loading={transactionsLoading}
        />
      </div>
      <div className="widget-item">
        <AnalyticsWidget />
      </div>
    </div>
  )
}

export default WidgetsGrid
