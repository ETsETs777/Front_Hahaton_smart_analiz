import { DataTable } from '@/components/ui'
import { DateDisplay, DeleteButton, StatsCard } from '@/components/ui'
import type { GetAllAggregatorsQuery } from '@/graphql/generated'
import { useCreateApiTokenMutation, useDeleteApiTokensMutation, useGetApiTokensQuery } from '@/graphql/generated'
import { Key, Plus, RotateCcw } from 'lucide-react'
import { App, Button, DatePicker, Input, Space, Tag, theme, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { ActionButtons, BaseModal } from './components'

type Aggregator = GetAllAggregatorsQuery['aggregator_GetAll'][0]
type ApiToken = NonNullable<Aggregator['tokens']>[0]
type ApiTokenFromQuery = NonNullable<import('@/graphql/generated').GetApiTokensQuery['apiTokens']>[0]

const { Text } = Typography

interface TokensModalProps {
    visible: boolean
    aggregator: Aggregator | null
    onClose: () => void
    onRefresh?: () => void
    onTokenChange?: (aggregatorId: string, newTokensCount: number) => void
}

export function TokensModal({ visible, aggregator, onClose, onRefresh, onTokenChange }: TokensModalProps) {
    const { token } = theme.useToken()
    const { message } = App.useApp()
    const [deleteApiTokens] = useDeleteApiTokensMutation()
    const [createApiToken] = useCreateApiTokenMutation()
    const [isCreating, setIsCreating] = useState(false)
    const [newTokenDescription, setNewTokenDescription] = useState('')
    const [newTokenExpiresAt, setNewTokenExpiresAt] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const { data: tokensData, refetch: refetchTokens } = useGetApiTokensQuery({
        variables: { aggregatorIds: aggregator ? [aggregator.id] : [] },
        skip: !aggregator,
        fetchPolicy: 'cache-and-network'
    })

    const tokens = tokensData?.apiTokens || []
    const activeTokens = tokens.filter(token => !token.expiresAt || new Date(token.expiresAt) > new Date())
    const expiredTokens = tokens.filter(token => token.expiresAt && new Date(token.expiresAt) <= new Date())

    useEffect(() => {
        if (visible) {
            setCurrentPage(1)
        }
    }, [visible])

    const handleClose = () => {
        setIsCreating(false)
        setNewTokenDescription('')
        setNewTokenExpiresAt(null)
        setCurrentPage(1)
        onClose()
    }

    const handleDeleteToken = async (tokenId: string) => {
        try {
            await deleteApiTokens({
                variables: { tokenIds: [tokenId] }
            })
            await refetchTokens()
            const newTokensCount = tokens.filter(token => token.id !== tokenId).length
            if (aggregator) {
                onTokenChange?.(aggregator.id, newTokensCount)
            }
            onRefresh?.()
            message.success('Токен удален')
        } catch (error: any) {
            message.error(error.message || 'Ошибка удаления токена')
        }
    }

    const startCreateToken = () => {
        setIsCreating(true)
        setNewTokenDescription('')
        setNewTokenExpiresAt(null)
    }

    const cancelCreateToken = () => {
        setIsCreating(false)
        setNewTokenDescription('')
        setNewTokenExpiresAt(null)
    }

    const saveCreateToken = async () => {
        if (!aggregator || !newTokenDescription.trim()) {
            message.error('Введите описание токена')
            return
        }

        try {
            const { data } = await createApiToken({
                variables: {
                    input: {
                        tokenDescription: newTokenDescription.trim(),
                        aggregatorId: aggregator.id,
                        expiresAt: newTokenExpiresAt
                    }
                }
            })

            if (data?.apiTokenCreate?.token) {
                await navigator.clipboard.writeText(data.apiTokenCreate.token)
                await refetchTokens()
                const newTokensCount = tokens.length + 1
                if (aggregator) {
                    onTokenChange?.(aggregator.id, newTokensCount)
                }
                onRefresh?.()
                message.success('Токен создан и скопирован в буфер обмена!')
                setIsCreating(false)
                setNewTokenDescription('')
                setNewTokenExpiresAt(null)
                setCurrentPage(1)
            } else {
                message.error('Токен не был создан.')
            }
        } catch (error: any) {
            message.error(error.message || 'Ошибка создания токена')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTokenDescription.trim()) {
            saveCreateToken()
        } else if (e.key === 'Escape') {
            cancelCreateToken()
        }
    }

    const newTokenRow = isCreating
        ? {
              id: 'creating',
              description: newTokenDescription,
              expiresAt: newTokenExpiresAt,
              aggregator: null
          }
        : null

    const tableData = newTokenRow ? [newTokenRow, ...tokens] : tokens

    const columns: ColumnsType<ApiTokenFromQuery | typeof newTokenRow> = [
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            render: (description: string, record: any) => {
                if (record.id === 'creating') {
                    return (
                        <Input
                            value={newTokenDescription}
                            onChange={e => setNewTokenDescription(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Описание токена"
                            autoFocus
                            variant="filled"
                            className="w-full"
                        />
                    )
                }
                return (
                    <div className="flex items-center gap-2">
                        <Key size={16} className="text-yellow-500" />
                        <div>
                            <span className="font-medium">{description}</span>
                            {record.expiresAt && new Date(record.expiresAt) <= new Date() && (
                                <Tag color="red" style={{ marginLeft: token.marginXS }}>
                                    Просрочен
                                </Tag>
                            )}
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Создан',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
            render: (date: string, record: any) => {
                if (record.id === 'creating') {
                    return <DateDisplay date={null} fallbackText="Сейчас" iconColor={token.colorPrimary} />
                }
                return <DateDisplay date={date} fallbackText="Неизвестно" iconColor={token.colorPrimary} />
            }
        },
        {
            title: 'Истекает',
            dataIndex: 'expiresAt',
            key: 'expiresAt',
            width: 160,
            render: (expiresAt: string | null, record: any) => {
                if (record.id === 'creating') {
                    return (
                        <DatePicker
                            value={newTokenExpiresAt ? dayjs(newTokenExpiresAt) : null}
                            onChange={date => setNewTokenExpiresAt(date ? date.toISOString() : null)}
                            onKeyDown={handleKeyPress}
                            placeholder="Выберите дату"
                            format="DD.MM.YYYY"
                            disabledDate={current => current && current < dayjs().startOf('day')}
                            variant="filled"
                            className="w-full"
                        />
                    )
                }
                return (
                    <div className="flex items-center space-x-2">
                        {!expiresAt ? (
                            <Tag color="success" style={{ borderRadius: token.borderRadius }}>
                                Бессрочный
                            </Tag>
                        ) : (
                            <DateDisplay date={expiresAt} iconColor={token.colorWarning} />
                        )}
                    </div>
                )
            }
        },
        {
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record: any) => {
                if (record.id === 'creating') {
                    return (
                        <ActionButtons
                            onSave={saveCreateToken}
                            onCancel={cancelCreateToken}
                            saveDisabled={!newTokenDescription.trim()}
                        />
                    )
                }
                return (
                    <DeleteButton
                        onDelete={() => handleDeleteToken(record.id)}
                        title="Удалить токен?"
                        description="Это действие нельзя отменить"
                        tooltipTitle="Удалить токен"
                    />
                )
            }
        }
    ]

    return (
        <BaseModal
            visible={visible}
            onClose={handleClose}
            title="API Токены"
            subtitle={`${aggregator?.name || 'Агрегатор'} • ${tokens.length} токенов`}
            icon={<Key size={20} />}
            actions={
                <Space>
                    <Button icon={<RotateCcw size={16} />} onClick={() => refetchTokens()} type="text" />
                    {!isCreating && (
                        <Button icon={<Plus size={16} />} type="primary" onClick={startCreateToken}>
                            Добавить токен
                        </Button>
                    )}
                </Space>
            }
        >
            <div className="shrink-0" style={{ marginBottom: token.marginLG }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                        title="Всего токенов"
                        value={tokens.length}
                        icon={<Key size={20} />}
                        color={token.colorPrimary}
                    />
                    <StatsCard
                        title="Активных"
                        value={activeTokens.length}
                        icon={<Key size={20} />}
                        color={token.colorSuccess}
                    />
                    <StatsCard
                        title="Просроченных"
                        value={expiredTokens.length}
                        icon={<Key size={20} />}
                        color={token.colorError}
                    />
                </div>
            </div>

            <div className="flex-1 ">
                <DataTable
                    data={tableData}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: currentPage,
                        pageSize: 10,
                        showSizeChanger: false,
                        showQuickJumper: true,
                        showTotal: (total: number, range: [number, number]) =>
                            `${range[0]}-${range[1]} из ${total} токенов`,
                        onChange: setCurrentPage
                    }}
                    locale={{
                        emptyText: isCreating ? 'Заполните поля для создания токена' : 'Нет токенов'
                    }}
                />
            </div>
        </BaseModal>
    )
}
