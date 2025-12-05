import { Progress, Button, Empty, List, Tag } from 'antd'
import { useNavigate } from 'react-router'
import WidgetCard from '@/components/dashboard/WidgetCard'
import { formatCurrency } from '@/utils'
import { useGetBudgetsQuery } from '@/graphql/generated'
import { BudgetCategory } from '@/graphql/generated'
import type { BudgetEntity } from '@/graphql/generated'
import './widgets.scss'

const CATEGORY_EMOJI_MAP: Record<BudgetCategory, string> = {
  [BudgetCategory.Groceries]: '🛒',
  [BudgetCategory.Health]: '💊',
  [BudgetCategory.Transport]: '🚗',
  [BudgetCategory.Entertainment]: '🎬',
  [BudgetCategory.Beauty]: '💄',
  [BudgetCategory.Sports]: '🏋️',
  [BudgetCategory.Home]: '🏠',
  [BudgetCategory.Restaurants]: '☕',
  [BudgetCategory.Cinema]: '🎞️',
  [BudgetCategory.Clothing]: '👔',
  [BudgetCategory.Education]: '📚',
  [BudgetCategory.Utilities]: '💡',
  [BudgetCategory.Internet]: '🌐',
  [BudgetCategory.Mobile]: '📱',
  [BudgetCategory.Tech]: '💻',
  [BudgetCategory.Gifts]: '🎁',
  [BudgetCategory.Travel]: '✈️',
  [BudgetCategory.Books]: '📖',
  [BudgetCategory.Pets]: '🐾',
  [BudgetCategory.Other]: '📋'
}

const CATEGORY_GRADIENT_MAP: Record<BudgetCategory, string> = {
  [BudgetCategory.Groceries]: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  [BudgetCategory.Health]: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  [BudgetCategory.Transport]: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  [BudgetCategory.Entertainment]: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  [BudgetCategory.Beauty]: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  [BudgetCategory.Sports]: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  [BudgetCategory.Home]: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  [BudgetCategory.Restaurants]: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
  [BudgetCategory.Cinema]: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  [BudgetCategory.Clothing]: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  [BudgetCategory.Education]: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  [BudgetCategory.Utilities]: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
  [BudgetCategory.Internet]: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  [BudgetCategory.Mobile]: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  [BudgetCategory.Tech]: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  [BudgetCategory.Gifts]: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  [BudgetCategory.Travel]: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  [BudgetCategory.Books]: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  [BudgetCategory.Pets]: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  [BudgetCategory.Other]: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
}

const CATEGORY_NAME_MAP: Record<BudgetCategory, string> = {
  [BudgetCategory.Groceries]: 'Продукты',
  [BudgetCategory.Health]: 'Здоровье',
  [BudgetCategory.Transport]: 'Транспорт',
  [BudgetCategory.Entertainment]: 'Развлечения',
  [BudgetCategory.Beauty]: 'Красота',
  [BudgetCategory.Sports]: 'Спорт',
  [BudgetCategory.Home]: 'Дом',
  [BudgetCategory.Restaurants]: 'Рестораны',
  [BudgetCategory.Cinema]: 'Кино',
  [BudgetCategory.Clothing]: 'Одежда',
  [BudgetCategory.Education]: 'Образование',
  [BudgetCategory.Utilities]: 'Коммунальные услуги',
  [BudgetCategory.Internet]: 'Интернет',
  [BudgetCategory.Mobile]: 'Мобильная связь',
  [BudgetCategory.Tech]: 'Техника',
  [BudgetCategory.Gifts]: 'Подарки',
  [BudgetCategory.Travel]: 'Путешествия',
  [BudgetCategory.Books]: 'Книги',
  [BudgetCategory.Pets]: 'Домашние животные',
  [BudgetCategory.Other]: 'Другое'
}

const BudgetWidget = () => {
  const navigate = useNavigate()
  const { data, loading } = useGetBudgetsQuery()

  const budgets = data?.budgets || []
  const displayedBudgets = budgets.slice(0, 3)

  if (loading) {
    return (
      <WidgetCard
        title={<span>Бюджет</span>}
        loading={true}
      >
        <Empty description="Загрузка..." />
      </WidgetCard>
    )
  }

  if (displayedBudgets.length === 0) {
    return (
      <WidgetCard
        title={<span>Бюджет</span>}
        loading={loading}
      >
        <Empty description="Бюджеты не установлены">
          <Button type="primary" onClick={() => navigate('/budget')}>
            Создать бюджет
          </Button>
        </Empty>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard
      title={<span>Бюджет</span>}
      extra={<Button type="link" onClick={() => navigate('/budget')}>Настроить</Button>}
      loading={loading}
    >
      <List
        dataSource={displayedBudgets}
        className="widget-list"
        renderItem={(budget: BudgetEntity) => {
          const percentage = budget.targetAmount > 0 
            ? (budget.currentAmount / budget.targetAmount) * 100 
            : 0
          const remaining = Math.max(0, budget.targetAmount - budget.currentAmount)
          const categoryName = CATEGORY_NAME_MAP[budget.category] || budget.category
          const categoryEmoji = CATEGORY_EMOJI_MAP[budget.category] || '📋'
          const categoryGradient = CATEGORY_GRADIENT_MAP[budget.category] || 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
          
          return (
            <List.Item 
              className="widget-list-item budget-widget-item"
              onClick={() => navigate('/budget')}
              style={{ cursor: 'pointer' }}
            >
              <div className="budget-item">
                <div className="budget-info">
                  <div className="budget-name-wrapper">
                    <div className="budget-icon" style={{ background: categoryGradient }}>
                      <span>{categoryEmoji}</span>
                    </div>
                    <div className="budget-name">
                      {budget.name || categoryName}
                    </div>
                  </div>
                  <div className="budget-meta">
                    <Tag 
                      color={percentage > 100 ? 'red' : percentage > 80 ? 'orange' : 'green'} 
                      className="budget-status"
                    >
                      {percentage > 100 ? 'Превышен' : percentage > 80 ? 'Почти' : 'В норме'}
                    </Tag>
                    <span className="budget-remaining">
                      Осталось: {formatCurrency(remaining)}
                    </span>
                  </div>
                  <Progress
                    percent={Math.min(percentage, 100)}
                    size="small"
                    status={percentage > 100 ? 'exception' : percentage > 80 ? 'active' : 'success'}
                    strokeColor={percentage > 100 ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#10b981'}
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <div className="budget-amount">{formatCurrency(budget.currentAmount)}</div>
              </div>
            </List.Item>
          )
        }}
      />
      {budgets.length > 3 && (
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <Button type="link" onClick={() => navigate('/budget')}>
            Показать все ({budgets.length})
          </Button>
        </div>
      )}
    </WidgetCard>
  )
}

export default BudgetWidget
