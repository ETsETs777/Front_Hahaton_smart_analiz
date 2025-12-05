import { App, Button, Form, InputNumber, Input, Modal, Progress, Select } from 'antd'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, ShoppingCart, Heart, Car, Film, Dumbbell, Home, Coffee } from 'lucide-react'
import {
  useCreateBudgetMutation,
  useUpdateBudgetMutation
} from '@/graphql/generated'
import { BudgetCategory, BudgetType } from '@/graphql/generated'
import type { BudgetEntity } from '@/graphql/generated'
import './BudgetWizard.scss'

interface BudgetWizardProps {
  visible: boolean
  budget?: BudgetEntity | null
  onClose: () => void
  onSuccess: () => void
}

interface BudgetCategoryLocal {
  id: string
  name: string
  icon: string
  emoji: string
  gradient: string
  bg: string
  border: string
  categoryEnum: BudgetCategory
}

const BUDGET_CATEGORIES: BudgetCategoryLocal[] = [
  { id: 'groceries', name: 'Продукты', icon: '🛒', emoji: '🛒', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '#10b981', categoryEnum: BudgetCategory.Groceries },
  { id: 'health', name: 'Медицина', icon: '💊', emoji: '💊', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', border: '#ef4444', categoryEnum: BudgetCategory.Health },
  { id: 'transport', name: 'Транспорт', icon: '🚗', emoji: '🚗', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '#f59e0b', categoryEnum: BudgetCategory.Transport },
  { id: 'entertainment', name: 'Развлечения', icon: '🎬', emoji: '🎬', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', border: '#8b5cf6', categoryEnum: BudgetCategory.Entertainment },
  { id: 'beauty', name: 'Косметика', icon: '💄', emoji: '💄', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '#ec4899', categoryEnum: BudgetCategory.Beauty },
  { id: 'sports', name: 'Спорт', icon: '🏋️', emoji: '🏋️', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', bg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', border: '#06b6d4', categoryEnum: BudgetCategory.Sports },
  { id: 'home', name: 'Дом', icon: '🏠', emoji: '🏠', gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', bg: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', border: '#14b8a6', categoryEnum: BudgetCategory.Home },
  { id: 'restaurants', name: 'Кафе', icon: '☕', emoji: '☕', gradient: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)', bg: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)', border: '#78716c', categoryEnum: BudgetCategory.Restaurants },
  { id: 'cinema', name: 'Кино', icon: '🎞️', emoji: '🎞️', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', bg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '#6366f1', categoryEnum: BudgetCategory.Cinema }
]

const STEPS = [
  { key: 'category', title: 'Категория', icon: ShoppingCart },
  { key: 'details', title: 'Информация', icon: Heart }
]

export function BudgetWizard({ visible, budget, onClose, onSuccess }: BudgetWizardProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [createBudget, { loading: creating }] = useCreateBudgetMutation()
  const [updateBudget, { loading: updating }] = useUpdateBudgetMutation()

  const isEditing = !!budget
  const loading = creating || updating

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    categoryId: '',
    targetAmount: 0,
    budgetType: BudgetType.Monthly,
    name: ''
  })

  useEffect(() => {
    if (visible) {
      if (budget) {
        const categoryData = BUDGET_CATEGORIES.find(c => c.categoryEnum === budget.category) || BUDGET_CATEGORIES[0]
        setFormData({
          categoryId: categoryData.id,
          targetAmount: budget.targetAmount,
          budgetType: budget.type,
          name: budget.name
        })
        form.setFieldsValue({
          categoryId: categoryData.id,
          targetAmount: budget.targetAmount,
          budgetType: budget.type,
          name: budget.name
        })
        setCurrentStep(1)
      } else {
        setFormData({
          categoryId: '',
          targetAmount: 0,
          budgetType: BudgetType.Monthly,
          name: ''
        })
        form.resetFields()
        form.setFieldsValue({
          targetAmount: 0,
          budgetType: BudgetType.Monthly
        })
        setCurrentStep(0)
      }
    } else {
      setCurrentStep(0)
    }
  }, [visible, budget, form])

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        if (!formData.categoryId) {
          message.warning('Выберите категорию')
          return
        }
        setCurrentStep(1)
      } else if (currentStep === 1) {
        await handleSubmit()
      }
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const finalData = {
        ...formData,
        ...values
      }

      const selectedCategory = BUDGET_CATEGORIES.find(c => c.id === finalData.categoryId)
      
      if (!selectedCategory) {
        message.error('Выберите категорию')
        return
      }

      if (isEditing && budget) {
        await updateBudget({
          variables: {
            id: budget.id,
            input: {
              name: finalData.name || selectedCategory.name,
              category: selectedCategory.categoryEnum,
              type: finalData.budgetType,
              targetAmount: finalData.targetAmount
            }
          },
          refetchQueries: ['GetBudgets']
        })
        message.success('Бюджет обновлен')
      } else {
        await createBudget({
          variables: {
            input: {
              name: finalData.name || selectedCategory.name,
              category: selectedCategory.categoryEnum,
              type: finalData.budgetType,
              targetAmount: finalData.targetAmount,
              currentAmount: 0
            }
          },
          refetchQueries: ['GetBudgets']
        })
        message.success('Бюджет создан')
      }

      form.resetFields()
      setFormData({
        categoryId: '',
        targetAmount: 0,
        budgetType: BudgetType.Monthly,
        name: ''
      })
      setCurrentStep(0)
      onSuccess()
      onClose()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(error.message || 'Ошибка сохранения бюджета')
    }
  }

  const adjustedStep = isEditing ? currentStep - 1 : currentStep
  const totalSteps = isEditing ? STEPS.length - 1 : STEPS.length
  const progress = ((adjustedStep + 1) / totalSteps) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="wizard-step-type">
            <div className="step-title">Выберите категорию</div>
            <div className="step-subtitle">Какую категорию бюджета вы хотите добавить?</div>
            <div className="category-type-cards">
              {BUDGET_CATEGORIES.map((cat) => {
                const isActive = formData.categoryId === cat.id
                
                return (
                  <div
                    key={cat.id}
                    className={`category-type-card ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, categoryId: cat.id }))
                      form.setFieldValue('categoryId', cat.id)
                    }}
                    style={{
                      '--card-gradient': cat.gradient,
                      '--card-bg': cat.bg,
                      '--card-border': cat.border
                    } as React.CSSProperties}
                  >
                    <div 
                      className="type-card-icon"
                      style={{ background: cat.gradient }}
                    >
                      <span style={{ fontSize: '24px' }}>{cat.emoji}</span>
                    </div>
                    <div className="type-card-title">{cat.name}</div>
                    {isActive && (
                      <div className="type-card-check" style={{ background: cat.gradient }}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="wizard-step-details">
            <div className="step-title">Информация о бюджете</div>
            <div className="step-subtitle">Установите параметры бюджета</div>
            <div className="details-form-wrapper">
              <Form.Item
                name="name"
                className="wizard-form-item"
                label="Название бюджета"
              >
                <Input
                  placeholder="Например: Бюджет на продукты"
                  size="large"
                  className="wizard-input"
                  autoFocus
                />
              </Form.Item>
              <Form.Item
                name="targetAmount"
                rules={[
                  { required: true, message: 'Введите лимит бюджета' },
                  { type: 'number', min: 1, message: 'Лимит должен быть больше 0' }
                ]}
                className="wizard-form-item"
                label="Лимит бюджета (максимум трат)"
              >
                <InputNumber
                  placeholder="Например: 20000"
                  size="large"
                  className="wizard-input"
                  prefix="₽"
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  min={0}
                />
              </Form.Item>
              <Form.Item
                name="budgetType"
                rules={[{ required: true, message: 'Выберите тип бюджета' }]}
                className="wizard-form-item"
                label="Тип бюджета"
                initialValue={BudgetType.Monthly}
              >
                <Select
                  size="large"
                  className="wizard-input"
                  options={[
                    { label: 'Месячный', value: BudgetType.Monthly },
                    { label: 'Недельный', value: BudgetType.Weekly },
                    { label: 'Годовой', value: BudgetType.Yearly },
                    { label: 'Произвольный', value: BudgetType.Custom }
                  ]}
                />
              </Form.Item>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      className="budget-wizard-modal"
      width={700}
      destroyOnClose={false}
      closable={true}
      centered
      maskClosable={true}
      mask={true}
      zIndex={1000}
      forceRender={true}
    >
      <div className="budget-wizard">
        <div className="wizard-header">
          <div className="wizard-title">
            {isEditing ? 'Редактировать категорию' : 'Добавление категории бюджета'}
          </div>
          <div className="wizard-steps-indicator">
            {STEPS.filter((_, index) => !isEditing || index !== 0).map((step, index) => {
              const actualIndex = isEditing ? index + 1 : index
              return (
                <div
                  key={step.key}
                  className={`step-indicator ${actualIndex === currentStep ? 'active' : ''} ${actualIndex < currentStep ? 'completed' : ''}`}
                >
                  <div className="step-indicator-icon">
                    {actualIndex < currentStep ? <Check size={14} /> : <step.icon size={14} />}
                  </div>
                  <span className="step-indicator-label">{step.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="wizard-content">
          <Form
            form={form}
            layout="vertical"
            className="wizard-form"
            initialValues={{
              targetAmount: 0,
              budgetType: BudgetType.Monthly
            }}
          >
            <Form.Item name="categoryId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="budgetType" hidden>
              <Input />
            </Form.Item>
            {renderStepContent()}
          </Form>
        </div>

        <div className="wizard-footer">
          <div className="wizard-progress-section">
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor={{
                '0%': '#10b981',
                '100%': '#059669',
              }}
              className="wizard-progress-bar"
            />
            <div className="wizard-progress-text">
              Шаг {adjustedStep + 1} из {totalSteps}
            </div>
          </div>
          <div className="wizard-footer-buttons">
            <Button
              onClick={currentStep === 0 ? onClose : handleBack}
              size="large"
              icon={currentStep === 0 ? null : <ArrowLeft size={18} />}
              className="wizard-button-back"
            >
              {currentStep === 0 ? 'Отмена' : 'Назад'}
            </Button>
            <Button
              type="primary"
              onClick={handleNext}
              size="large"
              loading={loading && currentStep === STEPS.length - 1}
              icon={currentStep === STEPS.length - 1 ? null : <ArrowRight size={18} />}
              className="wizard-button-next"
            >
              {currentStep === STEPS.length - 1 ? (isEditing ? 'Сохранить' : 'Создать категорию') : 'Далее'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

