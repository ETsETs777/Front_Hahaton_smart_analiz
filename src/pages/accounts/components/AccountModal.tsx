import { App, Button, Form, Input, InputNumber, Modal, Select, Switch } from 'antd'
import { useEffect } from 'react'
import {
    useCreateAccountMutation,
    useUpdateAccountMutation
} from '@/graphql/generated'
import { AccountType, BankType } from '@/graphql/generated'
import type { AccountEntity } from '@/graphql/generated'
import './AccountModal.scss'

interface AccountModalProps {
  visible: boolean
  account?: AccountEntity | null
  onClose: () => void
  onSuccess: () => void
}

const BANK_TYPE_LABELS: Record<BankType, string> = {
  [BankType.Sberbank]: 'Сбербанк',
  [BankType.AlfaBank]: 'Альфа-Банк',
  [BankType.CenterBank]: 'Центральный банк',
  [BankType.Invest]: 'Инвест',
  [BankType.Tbank]: 'Т-Банк'
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.Current]: 'Текущий',
  [AccountType.Savings]: 'Накопительный'
}

export function AccountModal({ visible, account, onClose, onSuccess }: AccountModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [createAccount, { loading: creating }] = useCreateAccountMutation()
  const [updateAccount, { loading: updating }] = useUpdateAccountMutation()

  const isEditing = !!account
  const loading = creating || updating

  useEffect(() => {
    if (visible) {
      if (account) {
        form.setFieldsValue({
          name: account.name,
          type: account.type,
          balance: account.balance,
          bankType: account.bankType || undefined,
          accountNumber: account.accountNumber || undefined,
          isDefault: account.isDefault
        })
      } else {
        form.resetFields()
        form.setFieldsValue({
          type: AccountType.Current,
          balance: 0,
          isDefault: false
        })
      }
    }
  }, [visible, account, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (isEditing) {
        await updateAccount({
          variables: {
            id: account.id,
            input: {
              name: values.name,
              type: values.type,
              bankType: values.bankType || undefined,
              accountNumber: values.accountNumber || undefined,
              isDefault: values.isDefault
            }
          }
        })
        message.success('Счет обновлен')
      } else {
        await createAccount({
          variables: {
            input: {
              name: values.name,
              type: values.type,
              balance: values.balance || 0,
              bankType: values.bankType || undefined,
              accountNumber: values.accountNumber || undefined,
              isDefault: values.isDefault
            }
          }
        })
        message.success('Счет создан')
      }

      form.resetFields()
      onSuccess()
      onClose()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(error.message || 'Ошибка сохранения счета')
    }
  }

  return (
    <Modal
      title={isEditing ? 'Редактировать счет' : 'Добавить счет'}
      open={visible}
      onCancel={onClose}
      footer={null}
      className="account-modal"
      width={520}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="account-form"
      >
        <Form.Item
          name="name"
          label="Название счета"
          rules={[{ required: true, message: 'Введите название счета' }]}
        >
          <Input
            placeholder="Например: Основной счет"
            size="large"
            className="account-form-input"
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Тип счета"
          rules={[{ required: true, message: 'Выберите тип счета' }]}
        >
          <Select
            size="large"
            className="account-form-input"
            options={[
              { label: ACCOUNT_TYPE_LABELS[AccountType.Current], value: AccountType.Current },
              { label: ACCOUNT_TYPE_LABELS[AccountType.Savings], value: AccountType.Savings }
            ]}
          />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="balance"
            label="Начальный баланс"
          >
            <InputNumber
              size="large"
              className="account-form-input w-full"
              placeholder="0.00"
              min={0}
              step={0.01}
              formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'}
              parser={value => value?.replace(/\s/g, '') || '0'}
            />
          </Form.Item>
        )}

        <Form.Item
          name="bankType"
          label="Банк"
        >
          <Select
            size="large"
            className="account-form-input"
            placeholder="Выберите банк"
            allowClear
            options={Object.values(BankType).map(bt => ({
              label: BANK_TYPE_LABELS[bt],
              value: bt
            }))}
          />
        </Form.Item>

        <Form.Item
          name="accountNumber"
          label="Номер счета"
        >
          <Input
            placeholder="Номер счета в банке"
            size="large"
            className="account-form-input"
          />
        </Form.Item>

        <Form.Item
          name="isDefault"
          valuePropName="checked"
          label="Счет по умолчанию"
        >
          <Switch />
        </Form.Item>

        <div className="account-form-actions">
          <Button onClick={onClose} size="large">
            Отмена
          </Button>
          <Button type="primary" htmlType="submit" size="large" loading={loading}>
            {isEditing ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

