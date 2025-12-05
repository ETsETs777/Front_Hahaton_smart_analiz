import { DataTable, EditableCell } from '@/components/ui'
import { ThemeContext } from '@/contexts/theme-context'
import type { ApiToken, ClientToAggregator, GetAllAggregatorsQuery } from '@/graphql/generated'
import {
    useCreateAggregatorMutation,
    useDeleteAggregatorsMutation,
    useUpdateAggregatorMutation
} from '@/graphql/generated'
import { App, Avatar, Button, Input, Menu, Popconfirm, theme, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Check, Eye, Home, Key, Link2, Trash2, Users2, X, Building2, Network } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ClientsModal } from './modals/clients-modal'
import { SportRoomsBulkModal } from './modals/sport-rooms-bulk-modal'
import { TokensModal } from './modals/tokens-modal'

type Aggregator = GetAllAggregatorsQuery['aggregator_GetAll'][0]

interface AggregatorsTableProps {
    data: Aggregator[]
    loading?: boolean
    onRefresh?: () => void
    isCreating?: boolean
    onCreateComplete?: () => void
    onCancelCreate?: () => void
}

// Константы
const EDITABLE_FIELDS = ['name', 'createBookingWebhook', 'changeStatusWebhook'] as const
const CREATING_ID = 'creating'

export function AggregatorsTable({
    data,
    loading,
    onRefresh,
    isCreating,
    onCreateComplete,
    onCancelCreate
}: AggregatorsTableProps) {
    const { message } = App.useApp()
    const navigate = useNavigate()
    const { isDark } = useContext(ThemeContext)
    const [deleteAggregators] = useDeleteAggregatorsMutation()
    const [updateAggregator] = useUpdateAggregatorMutation()
    const [createAggregator] = useCreateAggregatorMutation()
    const { token } = theme.useToken()

    // Состояния для счётчиков
    const [tokensCounts, setTokensCounts] = useState<Record<string, number>>({})
    const [sportRoomsCounts, setSportRoomsCounts] = useState<Record<string, number>>({})

    // Состояния для создания нового агрегатора
    const [newAggregatorName, setNewAggregatorName] = useState('')
    const [newAggregatorCreateBookingWebhook, setNewAggregatorCreateBookingWebhook] = useState('')
    const [newAggregatorChangeStatusWebhook, setNewAggregatorChangeStatusWebhook] = useState('')

    // Состояния для модальных окон
    const [clientsModal, setClientsModal] = useState<{ visible: boolean; aggregator: Aggregator | null }>({
        visible: false,
        aggregator: null
    })
    const [sportRoomsBulkModal, setSportRoomsBulkModal] = useState<{ visible: boolean; aggregator: Aggregator | null }>({
        visible: false,
        aggregator: null
    })
    const [tokensModal, setTokensModal] = useState<{ visible: boolean; aggregator: Aggregator | null }>({
        visible: false,
        aggregator: null
    })

    // Состояние для контекстного меню
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean
        x: number
        y: number
        aggregator: Aggregator | null
        fieldKey?: string
    }>({ visible: false, x: 0, y: 0, aggregator: null })

    const tableRef = useRef<HTMLDivElement>(null)

    // Обновление счётчиков при изменении данных
    useEffect(() => {
        const tokenCounts: Record<string, number> = {}
        const sportRoomCounts: Record<string, number> = {}

        data.forEach(aggregator => {
            tokenCounts[aggregator.id] = aggregator.tokens?.length || 0
            sportRoomCounts[aggregator.id] = aggregator.sportRooms?.length || 0
        })

        setTokensCounts(tokenCounts)
        setSportRoomsCounts(sportRoomCounts)
    }, [data])

    // Обработчик клика вне таблицы и нажатия ESC при создании
    useEffect(() => {
        const handleClickOutside = async (event: MouseEvent) => {
            if (!isCreating || !newAggregatorName.trim()) return

            const target = event.target as HTMLElement
            const isClickOnTable = target.closest('.ant-table') || target.closest('.ant-table-body')
            const isClickOnInput = target.closest('input') || target.closest('button')

            if (!isClickOnTable && !isClickOnInput) {
                await saveNewAggregator()
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isCreating) {
                cancelNewAggregator()
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
    }, [isCreating, newAggregatorName, createAggregator, onCreateComplete])

    // Обработчик закрытия контекстного меню
    useEffect(() => {
        if (!contextMenu.visible) return

        const handleClick = () => setContextMenu({ ...contextMenu, visible: false, aggregator: null })
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [contextMenu])

    // Функции для работы с агрегаторами
    const handleDelete = async (aggregatorId: string) => {
        try {
            await deleteAggregators({ variables: { ids: [aggregatorId] } })
            message.success('Агрегатор удален')
            onRefresh?.()
        } catch (error: any) {
            message.error(error.message || 'Ошибка удаления агрегатора')
        }
    }

    // Функции для создания нового агрегатора
    const saveNewAggregator = async () => {
        if (!newAggregatorName.trim()) {
            message.error('Введите название агрегатора')
            return
        }

        if (!newAggregatorCreateBookingWebhook.trim()) {
            message.error('Введите webhook для создания бронирования')
            return
        }

        if (!newAggregatorChangeStatusWebhook.trim()) {
            message.error('Введите webhook для изменения статуса')
            return
        }

        try {
            await createAggregator({
                variables: {
                    input: {
                        name: newAggregatorName.trim(),
                        createBookingWebhook: newAggregatorCreateBookingWebhook.trim(),
                        changeStatusWebhook: newAggregatorChangeStatusWebhook.trim()
                    }
                }
            })

            message.success('Агрегатор создан')
            resetNewAggregatorForm()
            onCreateComplete?.()
        } catch (error: any) {
            message.error(error.message || 'Ошибка создания агрегатора')
        }
    }

    const resetNewAggregatorForm = () => {
        setNewAggregatorName('')
        setNewAggregatorCreateBookingWebhook('')
        setNewAggregatorChangeStatusWebhook('')
    }

    const cancelNewAggregator = () => {
        resetNewAggregatorForm()
        onCancelCreate?.()
    }

    const handleCreateKeyPress = (e: React.KeyboardEvent) => {
        if (
            e.key === 'Enter' &&
            newAggregatorName.trim() &&
            newAggregatorCreateBookingWebhook.trim() &&
            newAggregatorChangeStatusWebhook.trim()
        ) {
            saveNewAggregator()
        } else if (e.key === 'Escape') {
            cancelNewAggregator()
        }
    }

    // Обработчики изменений счётчиков
    const handleTokensChange = (aggregatorId: string, newTokensCount: number) => {
        setTokensCounts(prev => ({ ...prev, [aggregatorId]: newTokensCount }))
    }

    const handleSportRoomsChange = (aggregatorId: string, newSportRoomsCount: number) => {
        setSportRoomsCounts(prev => ({ ...prev, [aggregatorId]: newSportRoomsCount }))
    }

    // Обработчик клика по строке
    const handleRowClick = (event: React.MouseEvent, aggregator: Aggregator) => {
        if (aggregator.id === CREATING_ID) return

        const target = event.target as HTMLElement
        const isClickOnInteractive =
            target.closest('button') ||
            target.closest('input') ||
            target.closest('.ant-btn') ||
            target.closest('.ant-input') ||
            target.closest('.ant-popover') ||
            target.closest('.ant-modal') ||
            target.closest('.ant-tooltip') ||
            target.closest('[role="button"]') ||
            target.closest('[data-clickable="true"]')

        if (!isClickOnInteractive) {
            navigate(`/aggregators/${aggregator.id}`)
        }
    }

    // Функции для навигации и меню
    const goToAggregator = (id: string) => navigate(`/aggregators/${id}`)
    const getRowMenu = (aggregator: Aggregator, fieldKey?: string) => {
        const isEditable = fieldKey && EDITABLE_FIELDS.includes(fieldKey as any)

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
                <Menu.Item key="details" icon={<Eye size={14} />} onClick={() => goToAggregator(aggregator.id)}>
                    Подробнее
                </Menu.Item>

                <Menu.Divider style={{ margin: '4px 0' }} />
                <Menu.Item key="delete" icon={<Trash2 size={14} />} onClick={() => handleDelete(aggregator.id)} danger>
                    Удалить
                </Menu.Item>
            </Menu>
        )
    }

    // Данные для таблицы
    const newAggregatorRow = isCreating
        ? {
              id: CREATING_ID,
              name: newAggregatorName,
              createBookingWebhook: newAggregatorCreateBookingWebhook,
              changeStatusWebhook: newAggregatorChangeStatusWebhook,
              createdAt: new Date().toISOString(),
              updatedAt: null,
              tokens: [],
              clients: [],
              sportRooms: []
          }
        : null

    const tableData = newAggregatorRow ? [newAggregatorRow, ...data] : data

    // Обработчик контекстного меню
    const getRowProps = (record: Aggregator | typeof newAggregatorRow, rowIndex: number | undefined) => {
        if (!record || record.id === CREATING_ID) return {}

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
                    aggregator: record as Aggregator,
                    fieldKey
                })
            }
        }
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

    const columns: ColumnsType<Aggregator | typeof newAggregatorRow> = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            render: (name: string, aggregator: any) => {
                if (aggregator.id === CREATING_ID) {
                    return renderInputCell(
                        newAggregatorName,
                        setNewAggregatorName,
                        'Название агрегатора *',
                        !newAggregatorName.trim()
                    )
                }
                return (
                    <div className="flex items-center gap-2">
                        <Network size={16} className="text-blue-500" />
                        <span className="font-medium">{name}</span>
                    </div>
                )
            }
        },
        {
            title: (
                <Tooltip title="URL, на который будет отправлен запрос при создании бронирования, для списания средств и проверки возможности бронирования">
                    <span>Webhook бронирования</span>
                </Tooltip>
            ),
            key: 'createBookingWebhook',
            width: 170,
            render: (_, aggregator: any) => {
                if (aggregator.id === CREATING_ID) {
                    return renderInputCell(
                        newAggregatorCreateBookingWebhook,
                        setNewAggregatorCreateBookingWebhook,
                        'URL webhook *',
                        !newAggregatorCreateBookingWebhook.trim()
                    )
                }
                const webhook = (aggregator as any).createBookingWebhook
                return (
                    <div className="flex items-center gap-2">
                        <Link2 size={16} className="text-blue-500" />
                        <span className="text-xs font-mono">{webhook}</span>
                    </div>
                )
            }
        },
        {
            title: (
                <Tooltip title="URL, на который будет отправлен запрос при изменении статуса бронирования">
                    <span>Webhook статуса</span>
                </Tooltip>
            ),
            key: 'changeStatusWebhook',
            width: 170,
            render: (_, aggregator: any) => {
                if (aggregator.id === CREATING_ID) {
                    return renderInputCell(
                        newAggregatorChangeStatusWebhook,
                        setNewAggregatorChangeStatusWebhook,
                        'URL webhook *',
                        !newAggregatorChangeStatusWebhook.trim()
                    )
                }
                const webhook = (aggregator as any).changeStatusWebhook
                return (
                    <div className="flex items-center gap-2">
                        <Link2 size={16} className="text-orange-500" />
                        <span className="text-xs font-mono">{webhook}</span>
                    </div>
                )
            }
        },
        {
            title: 'Токены',
            key: 'tokens',
            width: 90,
            align: 'center',
            render: (_, aggregator: any) => {
                if (aggregator?.id === CREATING_ID) {
                    return <span style={{ color: token.colorTextDisabled }}>-</span>
                }
                const tokens = aggregator?.tokens || []
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
                            {(tokens as ApiToken[]).map((t: ApiToken) => {
                                const token = t.description || ''
                                return (
                                    <Avatar
                                        key={t.id}
                                        size={24}
                                        className="!bg-yellow-100 dark:!bg-yellow-900 !text-yellow-700 dark:!text-yellow-200 !font-semibold !text-xs !font-mono"
                                    >
                                        {token.slice(0, 2).toUpperCase()}
                                    </Avatar>
                                )
                            })}
                        </Avatar.Group>
                        <Button
                            type="text"
                            icon={<Key size={16} />}
                            onClick={() => setTokensModal({ visible: true, aggregator })}
                            className="!text-yellow-600 dark:!text-yellow-400 !p-0 !h-7 hover:!bg-yellow-50 dark:hover:!bg-yellow-900/20"
                            data-clickable="true"
                        />
                    </div>
                )
            }
        },
        {
            title: 'Клиенты',
            key: 'clients',
            width: 120,
            align: 'center',
            render: (_, aggregator: any) => {
                if (aggregator?.id === CREATING_ID) {
                    return <span style={{ color: token.colorTextDisabled }}>-</span>
                }
                const clients = aggregator?.clients || []
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
                            {(clients as ClientToAggregator[]).map((c: ClientToAggregator) => {
                                const phone = c.client?.phone || ''
                                const digits = phone.replace(/\D/g, '').slice(7, 11) || '?'
                                return (
                                    <Avatar
                                        key={c.client?.id}
                                        size={24}
                                        className="!bg-green-100 dark:!bg-green-900 !text-green-700 dark:!text-blue-200 !font-semibold !text-xs !font-mono !leading-none"
                                    >
                                        {digits}
                                    </Avatar>
                                )
                            })}
                        </Avatar.Group>
                        <Button
                            type="text"
                            icon={<Users2 size={16} />}
                            onClick={() => setClientsModal({ visible: true, aggregator })}
                            className="!text-green-600 dark:!text-green-400 !p-0 !h-7 hover:!bg-green-50 dark:hover:!bg-green-900/20"
                            data-clickable="true"
                        />
                    </div>
                )
            }
        },
        {
            title: 'Спортивные площадки',
            key: 'sportRooms',
            width: 140,
            align: 'center',
            render: (_, aggregator: any) => {
                if (aggregator.id === CREATING_ID) {
                    return <span style={{ color: token.colorTextDisabled }}>-</span>
                }
                const sportRooms = aggregator.sportRooms || []
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
                            {sportRooms.map((r: any) => {
                                const title = r.sportRoom?.title || ''
                                const initials =
                                    title
                                        .split(' ')
                                        .map((w: string) => w[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase() || '?'
                                return (
                                    <Avatar
                                        key={r.sportRoom?.id}
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
                            icon={<Home size={16} />}
                            onClick={() => setSportRoomsBulkModal({ visible: true, aggregator })}
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
            render: (_, aggregator: any) => {
                if (aggregator.id === CREATING_ID) {
                    return (
                        <div className="flex gap-1" data-actions>
                            <Button
                                type="text"
                                size="small"
                                icon={<Check size={16} />}
                                onClick={saveNewAggregator}
                                className="!text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<X size={16} />}
                                onClick={cancelNewAggregator}
                                className="!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                            />
                        </div>
                    )
                }
                return (
                    <div className="flex gap-1 items-center" data-actions>
                        <Tooltip title="Подробнее">
                            <Button
                                type="text"
                                icon={<Eye size={18} />}
                                onClick={() => goToAggregator(aggregator.id)}
                                className="!text-blue-600 dark:!text-blue-400 !p-0 !h-7 hover:!bg-blue-50 dark:hover:!bg-blue-900/20"
                                data-clickable="true"
                            />
                        </Tooltip>
                        <Popconfirm
                            title="Удалить агрегатора?"
                            description="Это действие нельзя отменить"
                            onConfirm={() => handleDelete(aggregator.id)}
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
                {contextMenu.visible && contextMenu.aggregator && (
                    <div
                        style={{
                            position: 'fixed',
                            top: contextMenu.y,
                            left: contextMenu.x,
                            zIndex: 10000,
                            minWidth: 180
                        }}
                    >
                        {getRowMenu(contextMenu.aggregator, contextMenu.fieldKey)}
                    </div>
                )}
            </div>

            <ClientsModal
                visible={clientsModal.visible}
                aggregator={clientsModal.aggregator}
                onClose={() => setClientsModal({ visible: false, aggregator: null })}
            />

            <SportRoomsBulkModal
                visible={sportRoomsBulkModal.visible}
                aggregator={sportRoomsBulkModal.aggregator}
                onClose={() => setSportRoomsBulkModal({ visible: false, aggregator: null })}
                onRefresh={onRefresh}
                onSportRoomChange={handleSportRoomsChange}
            />

            <TokensModal
                visible={tokensModal.visible}
                aggregator={tokensModal.aggregator}
                onClose={() => setTokensModal({ visible: false, aggregator: null })}
                onRefresh={onRefresh}
                onTokenChange={handleTokensChange}
            />
        </>
    )
}
