import { App, Button, Form, Input, Modal, Progress, Select, DatePicker } from 'antd'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, BarChart3, TrendingUp, PieChart, Target, Calendar, MessageSquare, Eye } from 'lucide-react'
import { useCreateAnalyticsMutation } from '@/graphql/generated'
import { AnalyticsType } from '@/graphql/generated'
import { useGetAccountsQuery } from '@/graphql/generated'
import dayjs, { Dayjs } from 'dayjs'
import './AnalyticsWizard.scss'

const { RangePicker } = DatePicker
const { TextArea } = Input

interface AnalyticsWizardProps {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

const STEPS = [
  { key: 'type', title: 'Тип аналитики', icon: BarChart3 },
  { key: 'account', title: 'Счет', icon: Target },
  { key: 'period', title: 'Период', icon: Calendar },
  { key: 'comment', title: 'Комментарий', icon: MessageSquare },
  { key: 'review', title: 'Подтверждение', icon: Eye }
]

const ANALYTICS_TYPES = [
  {
    key: AnalyticsType.SpendingPatterns,
    value: AnalyticsType.SpendingPatterns,
    label: 'Паттерны расходов',
    description: 'Анализ ваших привычек трат и выявление закономерностей',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)',
    border: '#f59e0b'
  },
  {
    key: AnalyticsType.IncomeAnalysis,
    value: AnalyticsType.IncomeAnalysis,
    label: 'Анализ доходов',
    description: 'Детальный анализ источников и динамики ваших доходов',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
    border: '#10b981'
  },
  {
    key: AnalyticsType.BudgetCompliance,
    value: AnalyticsType.BudgetCompliance,
    label: 'Соответствие бюджету',
    description: 'Проверка соблюдения установленного бюджета',
    icon: Target,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
    border: '#3b82f6'
  },
  {
    key: AnalyticsType.CategoryBreakdown,
    value: AnalyticsType.CategoryBreakdown,
    label: 'Разбивка по категориям',
    description: 'Распределение расходов и доходов по категориям',
    icon: PieChart,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
    border: '#8b5cf6'
  },
  {
    key: AnalyticsType.TrendAnalysis,
    value: AnalyticsType.TrendAnalysis,
    label: 'Анализ трендов',
    description: 'Выявление трендов и прогнозирование финансовых показателей',
    icon: BarChart3,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(219, 39, 119, 0.05) 100%)',
    border: '#ec4899'
  }
]

export function AnalyticsWizard({ visible, onClose, onSuccess }: AnalyticsWizardProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [createAnalytics, { loading }] = useCreateAnalyticsMutation()
  const { data: accountsData } = useGetAccountsQuery()
  const accounts = accountsData?.accounts || []

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    type: undefined as AnalyticsType | undefined,
    accountId: undefined as string | undefined,
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
    comment: ''
  })

  useEffect(() => {
    if (visible) {
      setFormData({
        type: undefined,
        accountId: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        comment: ''
      })
      form.resetFields()
      setCurrentStep(0)
    }
  }, [visible, form])

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        if (!formData.type) {
          message.warning('Выберите тип аналитики')
          return
        }
        setCurrentStep(1)
      } else if (currentStep === 1) {
        const values = await form.validateFields(['accountId'])
        setFormData(prev => ({ ...prev, accountId: values.accountId }))
        setCurrentStep(2)
      } else if (currentStep === 2) {
        try {
          const values = await form.validateFields(['dateRange'])
          if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
            setFormData(prev => ({
              ...prev,
              dateFrom: values.dateRange[0].toISOString(),
              dateTo: values.dateRange[1].toISOString()
            }))
          } else {
            setFormData(prev => ({
              ...prev,
              dateFrom: undefined,
              dateTo: undefined
            }))
          }
        } catch {
          setFormData(prev => ({
            ...prev,
            dateFrom: undefined,
            dateTo: undefined
          }))
        }
        setCurrentStep(3)
      } else if (currentStep === 3) {
        const values = await form.validateFields(['comment'])
        setFormData(prev => ({ ...prev, comment: values.comment || '' }))
        setCurrentStep(4)
      } else if (currentStep === 4) {
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
      const input: any = {
        type: formData.type!,
        accountId: formData.accountId || undefined,
        dateFrom: formData.dateFrom || undefined,
        dateTo: formData.dateTo || undefined,
        comment: formData.comment || undefined
      }

      await createAnalytics({
        variables: { input }
      })

      message.success('Задача аналитики создана')
      form.resetFields()
      setFormData({
        type: undefined,
        accountId: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        comment: ''
      })
      setCurrentStep(0)
      onSuccess()
      onClose()
    } catch (error: any) {
      message.error(error.message || 'Ошибка создания задачи аналитики')
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="wizard-step-type">
            <div className="step-title">Выберите тип аналитики</div>
            <div className="step-subtitle">Какой анализ вы хотите выполнить?</div>
            <div className="analytics-type-cards">
              {ANALYTICS_TYPES.map((analyticsType) => {
                const Icon = analyticsType.icon
                const isActive = formData.type === analyticsType.value
                
                return (
                  <div
                    key={analyticsType.key}
                    className={`analytics-type-card ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, type: analyticsType.value }))
                      form.setFieldValue('type', analyticsType.value)
                    }}
                    style={{
                      '--card-gradient': analyticsType.gradient,
                      '--card-bg': analyticsType.bg,
                      '--card-border': analyticsType.border
                    } as React.CSSProperties}
                  >
                    <div 
                      className="type-card-icon"
                      style={{ background: analyticsType.gradient }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="type-card-title">{analyticsType.label}</div>
                    <div className="type-card-description">{analyticsType.description}</div>
                    {isActive && (
                      <div className="type-card-check" style={{ background: analyticsType.gradient }}>
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
          <div className="wizard-step-account">
            <div className="step-title">Выберите счет</div>
            <div className="step-subtitle">Для какого счета выполнить анализ?</div>
            <div className="details-form-wrapper">
              <Form.Item
                name="accountId"
                className="wizard-form-item"
                label="Счет"
              >
                <Select
                  placeholder="Все счета"
                  size="large"
                  className="wizard-input"
                  allowClear
                  options={accounts.map(acc => ({
                    label: acc.name,
                    value: acc.id
                  }))}
                />
              </Form.Item>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="wizard-step-period">
            <div className="step-title">Выберите период</div>
            <div className="step-subtitle">За какой период выполнить анализ?</div>
            <div className="details-form-wrapper">
              <Form.Item
                name="dateRange"
                className="wizard-form-item"
                label="Период"
              >
                <RangePicker
                  size="large"
                  className="wizard-input"
                  format="DD.MM.YYYY"
                  placeholder={['От', 'До']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="wizard-step-comment">
            <div className="step-title">Добавьте комментарий</div>
            <div className="step-subtitle">По желанию опишите, что вас интересует</div>
            <div className="details-form-wrapper">
              <Form.Item
                name="comment"
                className="wizard-form-item"
                label="Комментарий"
              >
                <TextArea
                  placeholder="Например: Проанализируйте мои расходы на продукты за последний месяц"
                  size="large"
                  className="wizard-input"
                  rows={4}
                  autoFocus
                />
              </Form.Item>
            </div>
          </div>
        )

      case 4:
        const selectedType = ANALYTICS_TYPES.find(t => t.value === formData.type)
        return (
          <div className="wizard-step-review">
            <div className="step-title">Подтверждение</div>
            <div className="step-subtitle">Проверьте данные перед созданием задачи</div>
            <div className="review-card">
              <div className="review-section">
                <div className="review-label">Тип аналитики</div>
                <div className="review-value">
                  <span className="review-badge" style={{ 
                    background: selectedType?.bg || 'rgba(16, 185, 129, 0.1)',
                    color: selectedType?.border || '#10b981'
                  }}>
                    {selectedType?.label || formData.type}
                  </span>
                </div>
              </div>
              {formData.accountId && (
                <div className="review-section">
                  <div className="review-label">Счет</div>
                  <div className="review-value">
                    {accounts.find(a => a.id === formData.accountId)?.name || 'Не указан'}
                  </div>
                </div>
              )}
              {(formData.dateFrom || formData.dateTo) && (
                <div className="review-section">
                  <div className="review-label">Период</div>
                  <div className="review-value">
                    {formData.dateFrom && formData.dateTo 
                      ? `${dayjs(formData.dateFrom).format('DD.MM.YYYY')} - ${dayjs(formData.dateTo).format('DD.MM.YYYY')}`
                      : 'Не указан'}
                  </div>
                </div>
              )}
              {formData.comment && (
                <div className="review-section">
                  <div className="review-label">Комментарий</div>
                  <div className="review-value">{formData.comment}</div>
                </div>
              )}
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
      className="analytics-wizard-modal"
      width={700}
      destroyOnClose={false}
      closable={true}
      centered
      maskClosable={true}
      mask={true}
      zIndex={1000}
      forceRender={true}
    >
      <div className="analytics-wizard">
        <div className="wizard-header">
          <div className="wizard-title">
            Создание задачи аналитики
          </div>
          <div className="wizard-steps-indicator">
            {STEPS.map((step, index) => (
              <div
                key={step.key}
                className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              >
                <div className="step-indicator-icon">
                  {index < currentStep ? <Check size={14} /> : <step.icon size={14} />}
                </div>
                <span className="step-indicator-label">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="wizard-content">
          <Form
            form={form}
            layout="vertical"
            className="wizard-form"
          >
            <Form.Item name="type" hidden>
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
              Шаг {currentStep + 1} из {STEPS.length}
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
              {currentStep === STEPS.length - 1 ? 'Создать задачу' : 'Далее'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

