import { App, Dropdown, Tag, Tooltip } from 'antd'
import { MoreVertical, Star, Trash2, Edit2 } from 'lucide-react'
import { formatCurrency } from '@/utils'
import type { AccountEntity } from '@/graphql/generated'
import { AccountType } from '@/graphql/generated'
import {
    useDeleteAccountMutation,
    useSetDefaultAccountMutation
} from '@/graphql/generated'
import { BANK_COLORS, BANK_NAMES, ACCOUNT_TYPE_LABELS, DEFAULT_BANK_COLOR } from '@/constants/banks'
import './AccountCard.scss'

interface AccountCardProps {
  account: AccountEntity
  onEdit: (account: AccountEntity) => void
  onDelete: () => void
  onSetDefault: () => void
}

export function AccountCard({ account, onEdit, onDelete, onSetDefault }: AccountCardProps) {
  const { modal, message } = App.useApp()
  const [deleteAccount] = useDeleteAccountMutation()
  const [setDefaultAccount] = useSetDefaultAccountMutation()
  
  const bankColor = account.bankType ? BANK_COLORS[account.bankType] : DEFAULT_BANK_COLOR
  const bankName = account.bankType ? BANK_NAMES[account.bankType] : 'Локальный'

  const menuItems = [
    {
      key: 'edit',
      label: 'Редактировать',
      icon: <Edit2 size={14} />,
      onClick: () => onEdit(account)
    },
    ...(account.isDefault ? [] : [{
      key: 'setDefault',
      label: 'Установить по умолчанию',
      icon: <Star size={14} />,
      onClick: async () => {
        try {
          await setDefaultAccount({
            variables: { id: account.id }
          })
          message.success('Счет установлен по умолчанию')
          onSetDefault()
        } catch (error: any) {
          message.error(error.message || 'Ошибка установки счета по умолчанию')
        }
      }
    }]),
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
          title: 'Удалить счет?',
          content: `Вы уверены, что хотите удалить счет "${account.name}"? Это действие нельзя отменить.`,
          okText: 'Удалить',
          cancelText: 'Отмена',
          okButtonProps: { danger: true },
          onOk: async () => {
            try {
              await deleteAccount({
                variables: { id: account.id }
              })
              message.success('Счет удален')
              onDelete()
            } catch (error: any) {
              message.error(error.message || 'Ошибка удаления счета')
            }
          }
        })
      }
    }
  ]

  return (
    <div className={`account-card ${account.isDefault ? 'default' : ''}`}>
      <div className="account-card-background" style={{ background: bankColor.gradient }} />
      <div className="account-card-content">
        <div className="account-card-header">
          <div className="account-card-icon" style={{ background: bankColor.gradient }}>
            <span className="bank-icon">{bankColor.icon}</span>
          </div>
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <button className="account-card-menu" onClick={(e) => e.stopPropagation()}>
              <MoreVertical size={18} />
            </button>
          </Dropdown>
        </div>

        <div className="account-card-body">
          <div className="account-card-name">
            <span>{account.name}</span>
            {account.isDefault && (
              <Tooltip title="Счет по умолчанию">
                <Star size={14} className="default-star" />
              </Tooltip>
            )}
          </div>
          <div className="account-card-balance">{formatCurrency(account.balance)}</div>
        </div>

        <div className="account-card-footer">
          <Tag className="account-type-tag" color={account.type === AccountType.Current ? 'blue' : 'green'}>
            {ACCOUNT_TYPE_LABELS[account.type] || account.type}
          </Tag>
          <span className="account-bank-name">{bankName}</span>
        </div>
      </div>
    </div>
  )
}

