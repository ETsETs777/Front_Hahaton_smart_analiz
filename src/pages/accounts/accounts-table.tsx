import { DataTable, EditableCell } from '@/components/ui'
import { ThemeContext } from '@/contexts/theme-context'
import type { GetAccountsQuery } from '@/graphql/generated'
import {
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,
    useSetDefaultAccountMutation
} from '@/graphql/generated'
import { App, Avatar, Button, Input, InputNumber, Menu, Popconfirm, Select, Tag, theme, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Check, Edit2, Star, Trash2, Wallet, X } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { formatCurrency } from '@/utils'
import { AccountType, BankType } from '@/graphql/generated'

type Account = GetAccountsQuery['accounts'][0]

interface AccountsTableProps {
    data: Account[]
    loading?: boolean
    onRefresh?: () => void
    isCreating?: boolean
    onCreateComplete?: () => void
    onCancelCreate?: () => void
}

const BANK_TYPE_LABELS: Record<BankType, string> = {
    [BankType.Sberbank]: 'Сбербанк',
    [BankType.AlfaBank]: 'Альфа-Банк',
    [BankType.CenterBank]: 'Центральный банк',
    [BankType.Invest]: 'Инвест',
    [BankType.Tbank]: 'Т-Банк'
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
    [AccountType.Current]: 'Дебетовый',
    [AccountType.Savings]: 'Накопительный'
}

export function AccountsTable({
    data,
    loading,
    onRefresh,
    isCreating,
    onCreateComplete,
    onCancelCreate
}: AccountsTableProps) {
    const { message } = App.useApp()
    const { isDark } = useContext(ThemeContext)
    const [createAccount] = useCreateAccountMutation()
    const [updateAccount] = useUpdateAccountMutation()
    const [deleteAccount] = useDeleteAccountMutation()
    const [setDefaultAccount] = useSetDefaultAccountMutation()
    const { token } = theme.useToken()

    const [newAccountName, setNewAccountName] = useState('')
    const [newAccountType, setNewAccountType] = useState<AccountType>(AccountType.Current)
    const [newAccountBalance, setNewAccountBalance] = useState<number>(0)
    const [newAccountBankType, setNewAccountBankType] = useState<BankType | undefined>(undefined)
    const [newAccountNumber, setNewAccountNumber] = useState('')
    const [newAccountIsDefault, setNewAccountIsDefault] = useState(false)

    const [contextMenu, setContextMenu] = useState<{
        visible: boolean
        x: number
        y: number
        account: Account | null
        fieldKey?: string
    }>({ visible: false, x: 0, y: 0, account: null })

    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = async (event: MouseEvent) => {
            if (isCreating && newAccountName.trim()) {
                const target = event.target as HTMLElement
                const isClickOnTable = target.closest('.ant-table') || target.closest('.ant-table-body')
                const isClickOnInput = target.closest('input') || target.closest('button') || target.closest('.ant-select')

                if (!isClickOnTable && !isClickOnInput) {
                    await saveNewAccount()
                }
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isCreating) {
                cancelNewAccount()
            }
        }

        if (isCreating) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isCreating, newAccountName])

    const saveNewAccount = async () => {
        if (!newAccountName.trim()) {
            message.error('Введите название счета')
            return
        }

        try {
            await createAccount({
                variables: {
                    input: {
                        name: newAccountName.trim(),
                        type: newAccountType,
                        balance: newAccountBalance || 0,
                        bankType: newAccountBankType || undefined,
                        accountNumber: newAccountNumber.trim() || undefined,
                        isDefault: newAccountIsDefault
                    }
                }
            })

            message.success('Счет создан')
            setNewAccountName('')
            setNewAccountType(AccountType.Current)
            setNewAccountBalance(0)
            setNewAccountBankType(undefined)
            setNewAccountNumber('')
            setNewAccountIsDefault(false)
            onCreateComplete?.()
        } catch (error: any) {
            message.error(error.message || 'Ошибка создания счета')
        }
    }

    const cancelNewAccount = () => {
        setNewAccountName('')
        setNewAccountType(AccountType.Current)
        setNewAccountBalance(0)
        setNewAccountBankType(undefined)
        setNewAccountNumber('')
        setNewAccountIsDefault(false)
        onCancelCreate?.()
    }

    const handleCreateKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveNewAccount()
        } else if (e.key === 'Escape') {
            cancelNewAccount()
        }
    }

    const handleDeleteAccount = async (accountId: string) => {
        try {
            await deleteAccount({
                variables: {
                    id: accountId
                }
            })

            message.success('Счет удален')
            onRefresh?.()
        } catch (error: any) {
            message.error(error.message || 'Ошибка удаления счета')
        }
    }

    const handleSetDefault = async (accountId: string) => {
        try {
            await setDefaultAccount({
                variables: {
                    id: accountId
                }
            })

            message.success('Счет установлен по умолчанию')
            onRefresh?.()
        } catch (error: any) {
            message.error(error.message || 'Ошибка установки счета по умолчанию')
        }
    }

    useEffect(() => {
        if (!contextMenu.visible) return

        const handleClick = () => setContextMenu({ ...contextMenu, visible: false, account: null })
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [contextMenu])

    const getRowMenu = (account: Account, fieldKey?: string) => {
        const isEditable = fieldKey && ['name', 'type', 'bankType', 'accountNumber'].includes(fieldKey)

        return (
            <Menu
                className="!border-none !rounded-md"
                style={{
                    backgroundColor: token.colorBgElevated,
                    color: token.colorText,
                    fontSize: token.fontSizeSM,
                    padding: '4px',
                    border: `1px solid ${token.colorBorder}`,
                    boxShadow: token.boxShadowTertiary
                }}
            >
                {isEditable && (
                    <Menu.Item
                        key="edit"
                        icon={<Edit2 size={14} />}
                        onClick={() => {
                            const row = document.querySelector(`[data-row-key="${account.id}"]`) as HTMLElement
                            if (row) {
                                const cell = row.querySelector(`[data-col-key="${fieldKey}"]`) as HTMLElement
                                if (cell) {
                                    const editableElement = cell.querySelector('[data-clickable="true"]') as HTMLElement
                                    if (editableElement) {
                                        editableElement.click()
                                    }
                                }
                            }
                            setContextMenu({ ...contextMenu, visible: false, account: null })
                        }}
                    >
                        Редактировать
                    </Menu.Item>
                )}
                {!account.isDefault && (
                    <Menu.Item
                        key="setDefault"
                        icon={<Star size={14} />}
                        onClick={() => {
                            handleSetDefault(account.id)
                            setContextMenu({ ...contextMenu, visible: false, account: null })
                        }}
                    >
                        Установить по умолчанию
                    </Menu.Item>
                )}
                <Menu.Divider style={{ margin: '4px 0' }} />
                <Menu.Item
                    key="delete"
                    icon={<Trash2 size={14} />}
                    onClick={() => handleDeleteAccount(account.id)}
                    danger
                >
                    Удалить
                </Menu.Item>
            </Menu>
        )
    }

    const renderInputCell = (
        value: string,
        onChange: (value: string) => void,
        placeholder: string,
        hasError: boolean
    ) => (
        <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleCreateKeyPress}
            placeholder={placeholder}
            size="small"
            className="!rounded-md !py-1 !px-2 !text-sm w-full"
            status={hasError ? 'error' : ''}
            variant="filled"
        />
    )

    const newAccountRow = isCreating
        ? {
              id: 'creating',
              name: newAccountName,
              type: newAccountType,
              balance: newAccountBalance,
              isDefault: newAccountIsDefault,
              bankType: newAccountBankType || null,
              accountNumber: newAccountNumber || null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              transactions: []
          }
        : null

    const tableData = newAccountRow ? [newAccountRow, ...data] : data

    const columns: ColumnsType<Account | typeof newAccountRow> = [
        {
            title: '',
            key: 'icon',
            width: 60,
            align: 'center',
            render: (_, account: any) => {
                if (account.id === 'creating') {
                    return (
                        <Avatar size={32} className="!bg-gray-100 dark:!bg-gray-800 !text-gray-500 dark:!text-gray-400">
                            <Wallet size={16} />
                        </Avatar>
                    )
                }
                return (
                    <Avatar
                        size={32}
                        className={`!font-semibold ${
                            account.isDefault
                                ? '!bg-blue-100 dark:!bg-blue-900 !text-blue-700 dark:!text-blue-200'
                                : '!bg-gray-100 dark:!bg-gray-800 !text-gray-500 dark:!text-gray-400'
                        }`}
                    >
                        <Wallet size={16} />
                    </Avatar>
                )
            }
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string, account: any) => {
                if (account.id === 'creating') {
                    return renderInputCell(newAccountName, setNewAccountName, 'Название счета *', !newAccountName.trim())
                }
                return (
                    <div className="flex items-center gap-2">
                        <EditableCell
                            value={name || ''}
                            onSave={async (newValue: string) => {
                                try {
                                    await updateAccount({
                                        variables: {
                                            id: account.id,
                                            input: { name: newValue }
                                        }
                                    })
                                    message.success('Название обновлено')
                                    onRefresh?.()
                                } catch (error: any) {
                                    message.error(error.message || 'Ошибка обновления')
                                    throw error
                                }
                            }}
                            placeholder="Название счета"
                            className="font-medium"
                        />
                        {account.isDefault && (
                            <Tooltip title="Счет по умолчанию">
                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            </Tooltip>
                        )}
                    </div>
                )
            }
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            render: (type: AccountType, account: any) => {
                if (account.id === 'creating') {
                    return (
                        <Select
                            value={newAccountType}
                            onChange={setNewAccountType}
                            size="small"
                            className="w-full"
                            options={[
                                { label: ACCOUNT_TYPE_LABELS[AccountType.Current], value: AccountType.Current },
                                { label: ACCOUNT_TYPE_LABELS[AccountType.Savings], value: AccountType.Savings }
                            ]}
                        />
                    )
                }
                return (
                    <Tag
                        color={type === AccountType.Current ? 'blue' : 'green'}
                        className="!rounded-md !px-2 !py-0.5"
                    >
                        {ACCOUNT_TYPE_LABELS[type]}
                    </Tag>
                )
            }
        },
        {
            title: 'Баланс',
            dataIndex: 'balance',
            key: 'balance',
            width: 150,
            align: 'right',
            render: (balance: number, account: any) => {
                if (account.id === 'creating') {
                    return (
                        <InputNumber
                            value={newAccountBalance}
                            onChange={value => setNewAccountBalance(value || 0)}
                            onKeyDown={handleCreateKeyPress}
                            size="small"
                            className="w-full"
                            placeholder="0.00"
                            min={0}
                            step={0.01}
                            formatter={value => value ? formatCurrency(parseFloat(value.toString()), '') : '0 ₽'}
                            parser={value => {
                                const parsed = value?.replace(/\s/g, '').replace('₽', '').replace(',', '.') || '0'
                                return parseFloat(parsed) || 0
                            }}
                        />
                    )
                }
                return (
                    <span className="font-semibold text-right">
                        {formatCurrency(balance)}
                    </span>
                )
            }
        },
        {
            title: 'Банк',
            dataIndex: 'bankType',
            key: 'bankType',
            width: 150,
            render: (bankType: BankType | null, account: any) => {
                if (account.id === 'creating') {
                    return (
                        <Select
                            value={newAccountBankType}
                            onChange={setNewAccountBankType}
                            size="small"
                            className="w-full"
                            placeholder="Выберите банк"
                            allowClear
                            options={Object.values(BankType).map(bt => ({
                                label: BANK_TYPE_LABELS[bt],
                                value: bt
                            }))}
                        />
                    )
                }
                return bankType ? (
                    <Tag color="purple" className="!rounded-md !px-2 !py-0.5">
                        {BANK_TYPE_LABELS[bankType]}
                    </Tag>
                ) : (
                    <span className="text-gray-400">Локальный</span>
                )
            }
        },
        {
            title: 'Номер счета',
            dataIndex: 'accountNumber',
            key: 'accountNumber',
            width: 200,
            render: (accountNumber: string | null, account: any) => {
                if (account.id === 'creating') {
                    return renderInputCell(
                        newAccountNumber,
                        setNewAccountNumber,
                        'Номер счета',
                        false
                    )
                }
                return (
                    <EditableCell
                        value={accountNumber || ''}
                        onSave={async (newValue: string) => {
                            try {
                                await updateAccount({
                                    variables: {
                                        id: account.id,
                                        input: { accountNumber: newValue || null }
                                    }
                                })
                                message.success('Номер счета обновлен')
                                onRefresh?.()
                            } catch (error: any) {
                                message.error(error.message || 'Ошибка обновления')
                                throw error
                            }
                        }}
                        placeholder="Не указан"
                        className="text-gray-600"
                    />
                )
            }
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 120,
            align: 'center',
            render: (_, account: any) => {
                if (account.id === 'creating') {
                    return (
                        <div className="flex gap-1 items-center" data-actions>
                            <Button
                                type="text"
                                size="small"
                                icon={<Check size={16} />}
                                onClick={saveNewAccount}
                                className="!text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<X size={16} />}
                                onClick={cancelNewAccount}
                                className="!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                            />
                        </div>
                    )
                }
                return (
                    <div className="flex gap-1 items-center" data-actions>
                        {!account.isDefault && (
                            <Tooltip title="Установить по умолчанию">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<Star size={16} />}
                                    onClick={() => handleSetDefault(account.id)}
                                    className="!text-yellow-600 hover:!bg-yellow-50 dark:hover:!bg-yellow-900/20"
                                />
                            </Tooltip>
                        )}
                        <Popconfirm
                            title="Удалить счет?"
                            description="Это действие нельзя отменить"
                            onConfirm={() => handleDeleteAccount(account.id)}
                            okText="Удалить"
                            cancelText="Отмена"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Удалить">
                                <Button
                                    type="text"
                                    danger
                                    icon={<Trash2 size={16} />}
                                    size="small"
                                    data-clickable="true"
                                />
                            </Tooltip>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ]

    const getRowProps = (record: Account | typeof newAccountRow, rowIndex: number | undefined) => {
        if (!record || record.id === 'creating') return {}

        return {
            onContextMenu: (e: React.MouseEvent) => {
                const cell = (e.target as HTMLElement).closest('td')
                if ((e.target as HTMLElement).closest('[data-actions]')) return

                e.preventDefault()
                const fieldKey = cell?.getAttribute('data-col-key') || undefined

                setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    account: record as Account,
                    fieldKey
                })
            }
        }
    }

    return (
        <>
            <div className="h-full flex-1 flex flex-col min-h-0" ref={tableRef}>
                <DataTable
                    data={tableData}
                    loading={loading}
                    columns={columns.map(col => ({
                        ...col,
                        onCell: (record: any) =>
                            ({
                                'data-col-key': (col as any).key || (col as any).dataIndex
                            } as React.HTMLAttributes<HTMLTableCellElement>)
                    }))}
                    rowKey="id"
                    onRow={getRowProps}
                />

                {contextMenu.visible && contextMenu.account && (
                    <div
                        style={{
                            position: 'fixed',
                            top: contextMenu.y,
                            left: contextMenu.x,
                            zIndex: 10000,
                            minWidth: 180
                        }}
                    >
                        {getRowMenu(contextMenu.account, contextMenu.fieldKey)}
                    </div>
                )}
            </div>
        </>
    )
}

