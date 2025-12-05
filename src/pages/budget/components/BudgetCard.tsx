import { App, Dropdown, Tag, Progress } from 'antd'
import { MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { BudgetCategory } from '@/graphql/generated'
import type { BudgetEntity } from '@/graphql/generated'
import './BudgetCard.scss'

interface BudgetCardProps {
  budget: BudgetEntity
  onEdit: (budget: BudgetEntity) => void
  onDelete: () => void
}

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

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { modal, message } = App.useApp()
  
  const percentage = budget.targetAmount > 0 
    ? (budget.currentAmount / budget.targetAmount) * 100 
    : 0
  const remaining = Math.max(0, budget.targetAmount - budget.currentAmount)
  const categoryName = CATEGORY_NAME_MAP[budget.category] || budget.category
  const categoryEmoji = CATEGORY_EMOJI_MAP[budget.category] || '📋'
  const categoryGradient = CATEGORY_GRADIENT_MAP[budget.category] || 'linear-gradient(135deg, #64748b 0%, #475569 100%)'

  const menuItems = [
    {
      key: 'edit',
      label: 'Редактировать',
      icon: <Edit2 size={14} />,
      onClick: () => onEdit(budget)
    },
    {
      type: 'divider' as const
    },
    {
      key: 'delete',
      label: 'Удалить',
      icon: <Trash2 size={14} />,
      danger: true,
      onClick: async () => {
        modal.confirm({
          title: 'Удалить бюджет?',
          content: `Вы уверены, что хотите удалить бюджет "${budget.name || categoryName}"? Это действие нельзя отменить.`,
          okText: 'Удалить',
          cancelText: 'Отмена',
          okButtonProps: { danger: true },
          onOk: async () => {
            try {
              message.success('Бюджет удален')
              onDelete()
            } catch (error: any) {
              message.error(error.message || 'Ошибка удаления бюджета')
            }
          }
        })
      }
    }
  ]

  return (
    <div className="budget-card">
      <div className="budget-card-background" style={{ background: categoryGradient }} />
      <div className="budget-card-content">
        <div className="budget-card-header">
          <div className="budget-card-icon" style={{ background: categoryGradient }}>
            <span className="category-icon">{categoryEmoji}</span>
          </div>
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <button className="budget-card-menu" onClick={(e) => e.stopPropagation()}>
              <MoreVertical size={18} />
            </button>
          </Dropdown>
        </div>

        <div className="budget-card-body">
          <div className="budget-card-name">
            <span>{budget.name || categoryName}</span>
          </div>
          <div className="budget-card-amount">{formatCurrency(budget.currentAmount)}</div>
        </div>

        <div className="budget-card-footer">
          <Progress
            percent={Math.min(percentage, 100)}
            size="small"
            status={percentage > 100 ? 'exception' : percentage > 80 ? 'active' : 'success'}
            strokeColor={percentage > 100 ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#10b981'}
          />
          <div className="budget-card-meta">
            <Tag 
              className="budget-status-tag" 
              color={percentage > 100 ? 'red' : percentage > 80 ? 'orange' : 'green'}
            >
              {percentage > 100 ? 'Превышен' : percentage > 80 ? 'Почти' : 'В норме'}
            </Tag>
            <span className="budget-remaining">Осталось: {formatCurrency(remaining)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

