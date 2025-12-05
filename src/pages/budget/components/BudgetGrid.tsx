import { Empty, Spin, Progress, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { BudgetCard } from './BudgetCard'
import { BudgetWizard } from './BudgetWizard'
import { formatCurrency } from '@/utils'
import { useGetBudgetsQuery, useDeleteBudgetMutation } from '@/graphql/generated'
import type { BudgetEntity } from '@/graphql/generated'
import './BudgetGrid.scss'

export function BudgetGrid() {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBudget, setEditingBudget] = useState<BudgetEntity | null>(null)
  const { data, loading, refetch } = useGetBudgetsQuery()
  const [deleteBudget] = useDeleteBudgetMutation()

  const budgets = data?.budgets || []

  const handleAddClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setEditingBudget(null)
    setModalVisible(true)
  }

  const handleEdit = (budget: BudgetEntity) => {
    setEditingBudget(budget)
    setModalVisible(true)
  }

  const handleDelete = async (budget: BudgetEntity) => {
    await deleteBudget({
      variables: { id: budget.id },
      refetchQueries: ['GetBudgets']
    })
  }

  const handleModalSuccess = () => {
    setModalVisible(false)
    setEditingBudget(null)
    refetch()
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditingBudget(null)
  }

  if (loading) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Spin size="large" />
        </div>
        <BudgetWizard
          visible={modalVisible}
          budget={editingBudget}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </>
    )
  }

  return (
    <>
      {budgets.length === 0 ? (
        <div className="budget-grid-empty">
          <Empty
            description={
              <div className="empty-content">
                <div className="empty-title">Нет категорий бюджета</div>
                <div className="empty-subtitle">Создайте свою первую категорию для начала работы</div>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <button 
              className="empty-add-button" 
              onClick={handleAddClick}
              type="button"
            >
              <PlusOutlined />
              <span>Создать категорию</span>
            </button>
          </Empty>
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEdit}
              onDelete={() => handleDelete(budget)}
            />
          ))}
          <div 
            className="budget-card add-card" 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleAddClick()
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleAddClick()
              }
            }}
          >
            <div className="add-card-content">
              <div className="add-card-icon">
                <PlusOutlined />
              </div>
              <div className="add-card-text">Добавить категорию</div>
            </div>
          </div>
        </div>
      )}

      <BudgetWizard
        visible={modalVisible}
        budget={editingBudget}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

