import { DataTable, EditableCell } from '@/components/ui'
import { ThemeContext } from '@/contexts/theme-context'
import type { GetAllManagersQuery } from '@/graphql/generated'
import {
    useDeleteUserMutation,
    useGetCurrentUserQuery,
    useRegisterManagerMutation,
    useUpdateUserMutation,
    useChangePasswordMutation
} from '@/graphql/generated'
import { App, Avatar, Button, Input, Menu, Popconfirm, theme, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Check, Edit2, Home, Trash2, User, X, Building2, Key } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SportComplexesModal } from './modals/sport-complexes-modal'

type Manager = GetAllManagersQuery['user_GetAllManagers'][0]

interface ManagersTableProps {
    data: Manager[]
    loading?: boolean
    onRefresh?: () => void
    isCreating?: boolean
    onCreateComplete?: () => void
    onCancelCreate?: () => void
}

export function ManagersTable({
    data,
    loading,
    onRefresh,
    isCreating,
    onCreateComplete,
    onCancelCreate
}: ManagersTableProps) {
    const { message } = App.useApp()
    const { isDark } = useContext(ThemeContext)
    const [registerManager] = useRegisterManagerMutation()
    const [updateUser] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()
    const { refetch: refetchCurrentUser } = useGetCurrentUserQuery()
    const { token } = theme.useToken()
    const [changePassword] = useChangePasswordMutation()
    const [passwordEditId, setPasswordEditId] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState('')

    // Состояния для создания нового менеджера
    const [newManagerFirstName, setNewManagerFirstName] = useState('')
    const [newManagerLastName, setNewManagerLastName] = useState('')
    const [newManagerPatronymic, setNewManagerPatronymic] = useState('')
    const [newManagerLogin, setNewManagerLogin] = useState('')
    const [newManagerPassword, setNewManagerPassword] = useState('')

    // Состояния для модальных окон
    const [sportComplexesModal, setSportComplexesModal] = useState<{ visible: boolean; manager: Manager | null }>({
        visible: false,
        manager: null
    })

    // Состояние для контекстного меню
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean
        x: number
        y: number
        manager: Manager | null
        fieldKey?: string
    }>({ visible: false, x: 0, y: 0, manager: null })

    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = async (event: MouseEvent) => {
            if (isCreating && newManagerFirstName.trim() && newManagerLogin.trim() && newManagerPassword.trim()) {
                const target = event.target as HTMLElement
                const isClickOnTable = target.closest('.ant-table') || target.closest('.ant-table-body')
                const isClickOnInput = target.closest('input') || target.closest('button')

                if (!isClickOnTable && !isClickOnInput) {
                    try {
                        await registerManager({
                            variables: {
                                input: {
                                    firstName: newManagerFirstName.trim(),
                                    lastName: newManagerLastName.trim() || null,
                                    patronymic: newManagerPatronymic.trim() || null,
                                    login: newManagerLogin.trim(),
                                    password: newManagerPassword.trim()
                                }
                            }
                        })

                        message.success('Менеджер создан')
                        setNewManagerFirstName('')
                        setNewManagerLastName('')
                        setNewManagerPatronymic('')
                        setNewManagerLogin('')
                        setNewManagerPassword('')
                        onCreateComplete?.()
                    } catch (error: any) {
                        message.error(error.message || 'Ошибка создания менеджера')
                    }
                }
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isCreating) {
                cancelNewManager()
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
    }, [
        isCreating,
        newManagerFirstName,
        newManagerLastName,
        newManagerPatronymic,
        newManagerLogin,
        newManagerPassword,
        registerManager,
        onCreateComplete
    ])

    const saveNewManager = async () => {
        if (!newManagerFirstName.trim() || !newManagerLogin.trim() || !newManagerPassword.trim()) {
            message.error('Заполните обязательные поля: имя, логин и пароль')
            return
        }

        try {
            await registerManager({
                variables: {
                    input: {
                        firstName: newManagerFirstName.trim(),
                        lastName: newManagerLastName.trim() || null,
                        patronymic: newManagerPatronymic.trim() || null,
                        login: newManagerLogin.trim(),
                        password: newManagerPassword.trim()
                    }
                }
            })

            message.success('Менеджер создан')
            setNewManagerFirstName('')
            setNewManagerLastName('')
            setNewManagerPatronymic('')
            setNewManagerLogin('')
            setNewManagerPassword('')
            onCreateComplete?.()
        } catch (error: any) {
            message.error(error.message || 'Ошибка создания менеджера')
        }
    }

    const cancelNewManager = () => {
        setNewManagerFirstName('')
        setNewManagerLastName('')
        setNewManagerPatronymic('')
        setNewManagerLogin('')
        setNewManagerPassword('')
        onCancelCreate?.()
    }

    const handleCreateKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveNewManager()
        } else if (e.key === 'Escape') {
            cancelNewManager()
        }
    }

    const newManagerRow = isCreating
        ? {
              id: 'creating',
              firstName: newManagerFirstName,
              lastName: newManagerLastName,
              patronymic: newManagerPatronymic,
              login: newManagerLogin,
              role: 'Manager' as const,
              createdAt: new Date().toISOString(),
              updatedAt: null,
              sportComplexes: []
          }
        : null

    const tableData = newManagerRow ? [newManagerRow, ...data] : data

    const handleSportComplexesUpdate = async () => {
        await refetchCurrentUser()
        onRefresh?.()
    }

    const handleDeleteManager = async (managerId: string) => {
        try {
            await deleteUser({
                variables: {
                    userIds: [managerId]
                }
            })

            message.success('Менеджер удален')
            onRefresh?.()
        } catch (error: any) {
            message.error(error.message || 'Ошибка удаления менеджера')
        }
    }

    const handlePasswordChange = async (managerId: string) => {
        if (!newPassword.trim()) {
            message.error('Введите новый пароль')
            return
        }
        try {
            await changePassword({ variables: { userId: managerId, newPassword } })
            message.success('Пароль успешно изменён')
            setPasswordEditId(null)
            setNewPassword('')
        } catch (error: any) {
            message.error(error.message || 'Ошибка смены пароля')
        }
    }

    // Обработчик закрытия контекстного меню
    useEffect(() => {
        if (!contextMenu.visible) return

        const handleClick = () => setContextMenu({ ...contextMenu, visible: false, manager: null })
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [contextMenu])

    const getRowMenu = (manager: Manager, fieldKey?: string) => {
        const isEditable = fieldKey && ['firstName', 'lastName', 'patronymic', 'login'].includes(fieldKey)

        return (
            <Menu
                className="!border-none !rounded-md"
                style={{
                    backgroundColor: token.colorBgElevated,
                    color: token.colorText,
                    fontSize: token.fontSizeSM,
                    border: `1px solid ${token.colorBorder}`,
                    boxShadow: token.boxShadowTertiary
                }}
            >
                {isEditable && (
                    <Menu.Item
                        key="edit"
                        icon={<Edit2 size={14} />}
                        onClick={() => {
                            // Находим элемент ячейки в конкретной строке и симулируем клик для начала редактирования
                            const row = document.querySelector(`[data-row-key="${manager.id}"]`) as HTMLElement
                            if (row) {
                                const cell = row.querySelector(`[data-col-key="${fieldKey}"]`) as HTMLElement
                                if (cell) {
                                    const editableElement = cell.querySelector('[data-clickable="true"]') as HTMLElement
                                    if (editableElement) {
                                        editableElement.click()
                                    }
                                }
                            }
                            setContextMenu({ ...contextMenu, visible: false, manager: null })
                        }}
                    >
                        Редактировать
                    </Menu.Item>
                )}
                <Menu.Divider style={{ margin: '4px 0' }} />
                <Menu.Item
                    key="delete"
                    icon={<Trash2 size={14} />}
                    onClick={() => handleDeleteManager(manager.id)}
                    danger
                >
                    Удалить
                </Menu.Item>
            </Menu>
        )
    }

    // Функция для получения инициалов менеджера
    const getManagerInitials = (manager: any) => {
        const firstName = manager.firstName || ''
        const lastName = manager.lastName || ''

        const firstInitial = firstName.charAt(0).toUpperCase()
        const lastInitial = lastName.charAt(0).toUpperCase()

        return firstInitial + lastInitial || '?'
    }

    // Компоненты для рендера ячеек
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

    const columns: ColumnsType<Manager | typeof newManagerRow> = [
        {
            title: '',
            key: 'avatar',
            width: 60,
            align: 'center',
            render: (_, manager: any) => {
                if (manager.id === 'creating') {
                    return (
                        <Avatar size={32} className="!bg-gray-100 dark:!bg-gray-800 !text-gray-500 dark:!text-gray-400">
                            ?
                        </Avatar>
                    )
                }
                return (
                    <Avatar
                        size={32}
                        className="!bg-blue-100 dark:!bg-blue-900 !text-blue-700 dark:!text-blue-200 !font-semibold"
                    >
                        {getManagerInitials(manager)}
                    </Avatar>
                )
            }
        },
        {
            title: 'Имя',
            dataIndex: 'firstName',
            key: 'firstName',
            width: 150,
            render: (firstName: string, manager: any) => {
                if (manager.id === 'creating') {
                    return renderInputCell(
                        newManagerFirstName,
                        setNewManagerFirstName,
                        'Имя *',
                        !newManagerFirstName.trim()
                    )
                }
                return (
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-500" />
                        <EditableCell
                            value={firstName || ''}
                            onSave={async (newValue: string) => {
                                try {
                                    await updateUser({ variables: { input: { id: manager.id, firstName: newValue } } })
                                    message.success('Данные обновлены')
                                    onRefresh?.()
                                } catch (error: any) {
                                    message.error(error.message || 'Ошибка обновления данных')
                                    throw error
                                }
                            }}
                            placeholder="Имя менеджера"
                            className="font-medium"
                        />
                    </div>
                )
            }
        },
        {
            title: 'Фамилия',
            dataIndex: 'lastName',
            key: 'lastName',
            width: 150,
            render: (lastName: string, manager: any) => {
                if (manager.id === 'creating') {
                    return renderInputCell(newManagerLastName, setNewManagerLastName, 'Фамилия', false)
                }
                return (
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-green-500" />
                        <EditableCell
                            value={lastName || ''}
                            onSave={async (newValue: string) => {
                                try {
                                    await updateUser({
                                        variables: { input: { id: manager.id, lastName: newValue || null } }
                                    })
                                    message.success('Данные обновлены')
                                    onRefresh?.()
                                } catch (error: any) {
                                    message.error(error.message || 'Ошибка обновления данных')
                                    throw error
                                }
                            }}
                            placeholder="Фамилия менеджера"
                        />
                    </div>
                )
            }
        },
        {
            title: 'Отчество',
            dataIndex: 'patronymic',
            key: 'patronymic',
            width: 150,
            render: (patronymic: string, manager: any) => {
                if (manager.id === 'creating') {
                    return renderInputCell(newManagerPatronymic, setNewManagerPatronymic, 'Отчество', false)
                }
                return (
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-purple-500" />
                        <EditableCell
                            value={patronymic || ''}
                            onSave={async (newValue: string) => {
                                try {
                                    await updateUser({
                                        variables: { input: { id: manager.id, patronymic: newValue || null } }
                                    })
                                    message.success('Данные обновлены')
                                    onRefresh?.()
                                } catch (error: any) {
                                    message.error(error.message || 'Ошибка обновления данных')
                                    throw error
                                }
                            }}
                            placeholder="Отчество менеджера"
                        />
                    </div>
                )
            }
        },
        {
            title: 'Логин',
            dataIndex: 'login',
            key: 'login',
            width: 150,
            render: (login: string, manager: any) => {
                if (manager.id === 'creating') {
                    return renderInputCell(newManagerLogin, setNewManagerLogin, 'Логин *', !newManagerLogin.trim())
                }
                return (
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-orange-500" />
                        <EditableCell
                            value={login || ''}
                            onSave={async (newValue: string) => {
                                try {
                                    await updateUser({ variables: { input: { id: manager.id, login: newValue } } })
                                    message.success('Данные обновлены')
                                    onRefresh?.()
                                } catch (error: any) {
                                    message.error(error.message || 'Ошибка обновления данных')
                                    throw error
                                }
                            }}
                            placeholder="Логин менеджера"
                        />
                    </div>
                )
            }
        },
        {
            title: 'Пароль',
            key: 'password',
            width: 120,
            render: (_, manager: any) => {
                if (manager.id === 'creating') {
                    return (
                        <Input.Password
                            value={newManagerPassword}
                            onChange={e => setNewManagerPassword(e.target.value)}
                            onKeyDown={handleCreateKeyPress}
                            placeholder="Пароль *"
                            size="small"
                            className="!rounded-md !py-1 !px-2 !text-sm w-full"
                            status={!newManagerPassword.trim() ? 'error' : ''}
                            variant="filled"
                            autoComplete="new-password"
                        />
                    )
                }
                if (passwordEditId === manager.id) {
                    return (
                        <div className="flex gap-1 items-center">
                            <Input.Password
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                size="small"
                                placeholder="Новый пароль"
                                className="!rounded-md !py-1 !px-2 !text-sm w-full"
                                autoFocus
                                style={{ width: '150px' }}
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<Check size={16} />}
                                onClick={() => handlePasswordChange(manager.id)}
                                className="!text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<X size={16} />}
                                onClick={() => {
                                    setPasswordEditId(null)
                                    setNewPassword('')
                                }}
                                className="!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                            />
                        </div>
                    )
                }
                return (
                    <span style={{ color: token.colorTextDisabled }}>
                        ••••••••
                        <Button
                            type="text"
                            size="small"
                            icon={<Key size={16} />}
                            onClick={() => setPasswordEditId(manager.id)}
                            className="ml-2 !text-blue-600 hover:!bg-blue-50 dark:hover:!bg-blue-900/20"
                        />
                    </span>
                )
            }
        },
        {
            title: 'Спорткомплексы',
            key: 'sportComplexes',
            width: 120,
            align: 'center',
            render: (_, manager: any) => {
                if (manager.id === 'creating') {
                    return <span style={{ color: token.colorTextDisabled }}>-</span>
                }
                const sportComplexes = manager.sportComplexes || []
                return (
                    <div className="flex items-center gap-2 justify-end">
                        <Avatar.Group
                            max={{
                                count: 3,
                                style: {
                                    background: token.colorBgElevated,
                                    color: token.colorTextSecondary,
                                    fontSize: 12,
                                    width: 24,
                                    height: 24,
                                    lineHeight: '24px'
                                }
                            }}
                        >
                            {sportComplexes.map((sc: any) => {
                                const title = sc.sportComplex?.title || ''
                                const initials = title
                                    ? title
                                          .split(' ')
                                          .map((w: string) => w[0])
                                          .join('')
                                          .slice(0, 2)
                                          .toUpperCase()
                                    : 'СК'
                                return (
                                    <Avatar
                                        key={sc.sportComplex?.id}
                                        size={24}
                                        className="!bg-purple-100 dark:!bg-purple-900 !text-purple-700 dark:!text-purple-200 !font-semibold !text-xs !font-mono !leading-none"
                                    >
                                        {initials}
                                    </Avatar>
                                )
                            })}
                        </Avatar.Group>
                        <Button
                            type="text"
                            icon={<Building2 size={16} />}
                            onClick={() => setSportComplexesModal({ visible: true, manager })}
                            className="!text-purple-600 dark:!text-purple-400 !p-0 !h-7 hover:!bg-purple-50 dark:hover:!bg-purple-900/20"
                            data-clickable="true"
                        />
                    </div>
                )
            }
        },
        {
            key: 'actions',
            width: 80,
            align: 'center',
            render: (_, manager: any) => {
                if (manager.id === 'creating') {
                    return (
                        <div className="flex gap-1 items-center" data-actions>
                            <Button
                                type="text"
                                size="small"
                                icon={<Check size={16} />}
                                onClick={saveNewManager}
                                className="!text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<X size={16} />}
                                onClick={cancelNewManager}
                                className="!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                            />
                        </div>
                    )
                }
                return (
                    <div className="flex gap-1 items-center" data-actions>
                        <Popconfirm
                            title="Удалить менеджера?"
                            description="Это действие нельзя отменить"
                            onConfirm={() => handleDeleteManager(manager.id)}
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

    // Обработчик контекстного меню
    const getRowProps = (record: Manager | typeof newManagerRow, rowIndex: number | undefined) => {
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
                    manager: record as Manager,
                    fieldKey
                })
            }
        }
    }

    return (
        <>
            <div className="h-full" ref={tableRef}>
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

                {/* Кастомное контекстное меню */}
                {contextMenu.visible && contextMenu.manager && (
                    <div
                        style={{
                            position: 'fixed',
                            top: contextMenu.y,
                            left: contextMenu.x,
                            zIndex: 10000,
                            minWidth: 180
                        }}
                    >
                        {getRowMenu(contextMenu.manager, contextMenu.fieldKey)}
                    </div>
                )}
            </div>

            <SportComplexesModal
                visible={sportComplexesModal.visible}
                manager={sportComplexesModal.manager}
                onClose={() => setSportComplexesModal({ visible: false, manager: null })}
                onUpdate={handleSportComplexesUpdate}
            />
        </>
    )
}
