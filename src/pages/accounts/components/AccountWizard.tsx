import { App, Button, Form, Input, Modal, Progress } from 'antd'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, Wallet, Building2, Settings, Eye } from 'lucide-react'
import {
    useCreateAccountMutation,
    useUpdateAccountMutation
} from '@/graphql/generated'
import { AccountType, BankType } from '@/graphql/generated'
import type { AccountEntity } from '@/graphql/generated'
import { TidButton } from '@/components/banks/TidButton'
import {
  BANK_COLORS,
  BANK_NAMES,
  BANK_CARDS,
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_DESCRIPTIONS,
  ACCOUNT_TYPE_ICONS,
  ACCOUNT_TYPE_COLORS,
  ACCOUNT_TYPES
} from '@/constants/banks'
import './AccountWizard.scss'

interface AccountWizardProps {
  visible: boolean
  account?: AccountEntity | null
  onClose: () => void
  onSuccess: () => void
}

const STEPS = [
  { key: 'type', title: 'Тип счета', icon: Wallet },
  { key: 'details', title: 'Информация', icon: Settings },
  { key: 'bank', title: 'Банк', icon: Building2 },
  { key: 'review', title: 'Подтверждение', icon: Eye }
]

export function AccountWizard({ visible, account, onClose, onSuccess }: AccountWizardProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [createAccount, { loading: creating }] = useCreateAccountMutation()
  const [updateAccount, { loading: updating }] = useUpdateAccountMutation()

  const isEditing = !!account
  const loading = creating || updating

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    type: AccountType.Current,
    name: '',
    balance: 0,
    bankType: undefined as BankType | undefined,
    isDefault: false
  })
  const [bankValidationError, setBankValidationError] = useState(false)
  const [tidAuthorized, setTidAuthorized] = useState(false)

  useEffect(() => {
    if (visible) {
      if (account) {
        setFormData({
          type: account.type,
          name: account.name,
          balance: account.balance,
          bankType: account.bankType || undefined,
          isDefault: account.isDefault
        })
        form.setFieldsValue({
          type: account.type,
          name: account.name,
          balance: account.balance,
          bankType: account.bankType || undefined,
          isDefault: account.isDefault
        })
        setCurrentStep(1)
      } else {
        setFormData({
          type: AccountType.Current,
          name: '',
          balance: 0,
          bankType: undefined,
          isDefault: false
        })
        form.resetFields()
        form.setFieldsValue({
          type: AccountType.Current,
          balance: 0,
          isDefault: false
        })
        setCurrentStep(0)
        setBankValidationError(false)
        setTidAuthorized(false)
      }
    } else {
      setCurrentStep(0)
      setBankValidationError(false)
      setTidAuthorized(false)
    }
  }, [visible, account, form])

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        if (!formData.type) {
          message.warning('Выберите тип счета')
          return
        }
        setCurrentStep(1)
      } else if (currentStep === 1) {
        const values = await form.validateFields(['name'])
        setFormData(prev => ({ ...prev, ...values }))
        setCurrentStep(2)
      } else if (currentStep === 2) {
        if (!formData.bankType) {
          message.warning('Выберите банк для подключения')
          setBankValidationError(true)
          return
        }
        setBankValidationError(false)
        const values = await form.validateFields(['bankType'])
        setFormData(prev => ({ ...prev, ...values }))
        setCurrentStep(3)
      } else if (currentStep === 3) {
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
        ...values,
        type: formData.type
      }

      if (isEditing) {
        await updateAccount({
          variables: {
            id: account.id,
            input: {
              name: finalData.name,
              type: finalData.type,
              bankType: finalData.bankType || undefined,
              isDefault: finalData.isDefault
            }
          }
        })
        message.success('Счет обновлен')
      } else {
        const isTbank = finalData.bankType === BankType.Tbank
        const input: any = {
          name: finalData.name,
          type: finalData.type,
          bankType: finalData.bankType || undefined,
          isDefault: finalData.isDefault
        }

        if (isTbank) {
          input.accountNumber = '40702810110011000000'
          input.bearerToken = 'TBankSandboxToken'
        }

        await createAccount({
          variables: {
            input
          }
        })
        message.success('Счет создан')
      }

      form.resetFields()
      setFormData({
        type: AccountType.Current,
        name: '',
        balance: 0,
        bankType: undefined,
        isDefault: false
      })
      setCurrentStep(0)
      onSuccess()
      onClose()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(error.message || 'Ошибка сохранения счета')
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
            <div className="step-title">Выберите тип счета</div>
            <div className="step-subtitle">Какой тип счета вы хотите добавить?</div>
            <div className="account-type-cards">
              {ACCOUNT_TYPES.map((accountType) => {
                const Icon = ACCOUNT_TYPE_ICONS[accountType.key]
                const colors = ACCOUNT_TYPE_COLORS[accountType.key]
                const isActive = formData.type === accountType.value || formData.type === accountType.key
                
                return (
                  <div
                    key={accountType.key}
                    className={`account-type-card ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, type: accountType.value }))
                      form.setFieldValue('type', accountType.value)
                    }}
                    style={{
                      '--card-gradient': colors.gradient,
                      '--card-bg': colors.bg,
                      '--card-border': colors.border
                    } as React.CSSProperties}
                  >
                    <div 
                      className="type-card-icon"
                      style={{ background: colors.gradient }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="type-card-title">{ACCOUNT_TYPE_LABELS[accountType.key]}</div>
                    <div className="type-card-description">{ACCOUNT_TYPE_DESCRIPTIONS[accountType.key]}</div>
                    {isActive && (
                      <div className="type-card-check" style={{ background: colors.gradient }}>
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
            <div className="step-title">Основная информация</div>
            <div className="step-subtitle">Дайте название вашему счету</div>
            <div className="details-form-wrapper">
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Введите название счета' }]}
                className="wizard-form-item"
                label="Название счета"
              >
                <Input
                  placeholder="Например: Основной счет, Зарплатная карта, Накопительный"
                  size="large"
                  className="wizard-input"
                  autoFocus
                  prefix={<Wallet size={18} className="input-icon" />}
                />
              </Form.Item>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="wizard-step-bank">
            <div className="step-title">Интеграция с банком</div>
            <div className="step-subtitle">Выберите банк для подключения</div>
            {bankValidationError && (
              <div className="bank-validation-error">
                Пожалуйста, выберите банк для продолжения
              </div>
            )}
            <div className="bank-cards-wrapper">
              <div className="bank-cards">
                {BANK_CARDS.map((bank) => {
                  const colors = BANK_COLORS[bank.type]
                  const isSelected = formData.bankType === bank.type
                  const isTbank = bank.type === BankType.Tbank
                  
                  return (
                    <div
                      key={bank.type}
                      className={`bank-card ${isSelected ? 'active' : ''} ${isTbank ? 'bank-card-tid' : ''}`}
                      onClick={() => {
                        const newBankType = bank.type
                        setFormData(prev => ({ ...prev, bankType: newBankType }))
                        form.setFieldValue('bankType', newBankType)
                        setBankValidationError(false)
                        if (newBankType !== BankType.Tbank) {
                          setTidAuthorized(false)
                        }
                      }}
                      style={{
                        '--bank-gradient': colors.gradient,
                        '--bank-bg': colors.bg,
                        '--bank-border': colors.border
                      } as React.CSSProperties}
                    >
                      <div className="bank-card-logo" style={{ background: colors.gradient }}>
                        {colors.logo}
                      </div>
                      <div className="bank-card-label">{bank.label}</div>
                      <div className="bank-card-name">{bank.name}</div>
                      {isTbank && isSelected && !tidAuthorized && (
                        <div className="bank-card-tid-auth">
                          <TidButton
                            containerId={`tid-button-${bank.type}`}
                            clientId={import.meta.env.VITE_TID_CLIENT_ID || 'YOUR_CLIENT_ID'}
                            redirectUri={`${window.location.origin}/accounts/tid-callback`}
                            onSuccess={() => {
                              message.success('Авторизация T-ID успешна')
                              setTidAuthorized(true)
                            }}
                            onError={(error) => {
                              message.error(`Ошибка авторизации: ${error.message}`)
                            }}
                            mockMode={true}
                          />
                        </div>
                      )}
                      {isSelected && (!isTbank || tidAuthorized) && (
                        <div className="bank-card-check" style={{ background: colors.gradient }}>
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="wizard-step-review">
            <div className="step-title">Подтверждение</div>
            <div className="step-subtitle">Проверьте данные добавлением счета</div>
            <div className="review-card">
              <div className="review-section">
                <div className="review-label">Тип счета</div>
                <div className="review-value">
                  <span className="review-badge" style={{ 
                    background: ACCOUNT_TYPE_COLORS[formData.type as string]?.bg || 'rgba(16, 185, 129, 0.1)',
                    color: ACCOUNT_TYPE_COLORS[formData.type as string]?.border || '#10b981'
                  }}>
                    {ACCOUNT_TYPE_LABELS[formData.type as string] || formData.type}
                  </span>
                </div>
              </div>
              <div className="review-section">
                <div className="review-label">Название</div>
                <div className="review-value">{form.getFieldValue('name') || 'Не указано'}</div>
              </div>
              {form.getFieldValue('bankType') && (
                <div className="review-section">
                  <div className="review-label">Банк</div>
                  <div className="review-value">
                    <span className="review-bank">
                      {BANK_COLORS[form.getFieldValue('bankType') as BankType]?.logo} {BANK_NAMES[form.getFieldValue('bankType') as BankType]}
                    </span>
                  </div>
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
      className="account-wizard-modal"
      width={700}
      destroyOnClose={false}
      closable={true}
      centered
      maskClosable={true}
      mask={true}
      zIndex={1000}
      forceRender={true}
    >
      <div className="account-wizard">
        <div className="wizard-header">
          <div className="wizard-title">
            {isEditing ? 'Редактировать счет' : 'Добавление нового счета'}
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
              type: AccountType.Current,
              balance: 0,
              isDefault: false
            }}
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
              {currentStep === STEPS.length - 1 ? (isEditing ? 'Сохранить' : 'Создать счет') : 'Далее'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

