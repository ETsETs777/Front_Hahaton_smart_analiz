import {
    useCreateApiTokenMutation,
    useDeleteApiTokensMutation,
    useGetAggregatorByIdQuery,
    useGetApiTokensQuery,
    useUpdateAggregatorMutation
} from '@/graphql/generated'
import {
    App,
    Button,
    Card,
    DatePicker,
    Descriptions,
    Input,
    Popconfirm,
    Tabs,
    Tag,
    Tooltip,
    Typography,
    theme
} from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, Calendar, Check, X, Trash2, Key, Search, Users, Building2, Link2, Phone, Plus } from 'lucide-react'

import { LoadingSpinner, DataTable, EditableCell } from '@/components/ui'
import { Toolbar } from '@/components/layout/Toolbar/Toolbar'
import { useSEO } from '@/hooks/use-seo'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { SportRoomsBulkModal } from './modals/sport-rooms-bulk-modal'

const { Title, Text } = Typography

interface Aggregator {
    id: string
    name: string
    createBookingWebhook: string
    changeStatusWebhook: string
    createdAt: string
    updatedAt?: string
    tokens: Array<{
        id: string
        description: string
        expiresAt?: string
        createdAt: string
    }>
    clients: Array<{
        createdAt: string
        client: {
            id: string
            phone: string
            snils: string
            birthdate: string
            lastName: string
            firstName: string
            patronymic: string
        }
    }>
}

const SearchInput = React.memo(function SearchInput({
    activeTab,
    tokensSearchQuery,
    setTokensSearchQuery,
    clientsSearchQuery,
    setClientsSearchQuery,
    token
}: {
    activeTab: string
    tokensSearchQuery: string
    setTokensSearchQuery: (v: string) => void
    clientsSearchQuery: string
    setClientsSearchQuery: (v: string) => void
    token: any
}) {
    if (activeTab === 'tokens') {
        return (
            <Input
                placeholder="Поиск токена"
                prefix={<Search size={16} style={{ color: token.colorTextSecondary }} />}
                value={tokensSearchQuery}
                onChange={e => setTokensSearchQuery(e.target.value)}
                allowClear
                size="middle"
                style={{ width: 300 }}
            />
        )
    }
    if (activeTab === 'clients') {
        return (
                <Input
                    placeholder="Телефон, СНИЛС, ФИО или дата рождения"
                prefix={<Search size={16} style={{ color: token.colorTextSecondary }} />}
                value={clientsSearchQuery}
                onChange={e => setClientsSearchQuery(e.target.value)}
                allowClear
                size="middle"
                style={{ width: 300 }}
            />
        )
    }
    return null
})

export default function AggregatorDetailPage() {
    const { message, modal } = App.useApp()
    const { token } = theme.useToken()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('tokens')

    const [deleteApiTokens] = useDeleteApiTokensMutation()
    const [createApiToken] = useCreateApiTokenMutation()

    const [isCreatingToken, setIsCreatingToken] = useState(false)
    const [newTokenDescription, setNewTokenDescription] = useState('')
    const [newTokenExpiresAt, setNewTokenExpiresAt] = useState<string | null>(null)

    const [sportRoomsBulkVisible, setSportRoomsBulkVisible] = useState(false)

    const [tokensSearchQuery, setTokensSearchQuery] = useState('')
    const [clientsSearchQuery, setClientsSearchQuery] = useState('')

    const [pendingCreation, setPendingCreation] = useState<'token' | null>(null)

    const { data: tokensData, refetch: refetchTokens } = useGetApiTokensQuery({
        variables: { aggregatorIds: id ? [id] : [] },
        skip: !id,
        fetchPolicy: 'cache-and-network'
    })

    const tokens = tokensData?.apiTokens || []

    useSEO({
        title: 'Детали агрегатора',
        description: 'Просмотр и редактирование информации об агрегаторе.',
        keywords: 'агрегатор, токены, клиенты, спортивные площадки',
        noindex: true,
        url: `${window.location.origin}/aggregators/${id}`
    })

    const { data, loading, refetch } = useGetAggregatorByIdQuery({
        variables: { id: id || '' },
        skip: !id
    })

    const [updateAggregator] = useUpdateAggregatorMutation()

    const aggregator = data?.aggregator_GetById as Aggregator | undefined
    

    useEffect(() => {
        if (pendingCreation === 'token' && activeTab === 'tokens' && !isCreatingToken) {
            startCreateToken()
            setPendingCreation(null)
        }
    }, [activeTab, pendingCreation, isCreatingToken])

    const hasUnsavedChanges = () => {
        if (isCreatingToken) {
            return newTokenDescription.trim() !== '' || newTokenExpiresAt !== null
        }
        return false
    }

    const handleTabChange = (newActiveTab: string) => {
        if (hasUnsavedChanges()) {
            modal.confirm({
                title: 'Сохранить изменения?',
                content: 'У вас есть несохраненные изменения. Хотите сохранить их перед сменой вкладки?',
                okText: 'Сохранить',
                cancelText: 'Отменить',
                onOk: async () => {
                    if (isCreatingToken) {
                        await saveCreateToken()
                    }
                    setActiveTab(newActiveTab)
                    if (newActiveTab === 'sportRooms') {
                        setSportRoomsBulkVisible(true)
                    }
                },
                onCancel: () => {
                    if (isCreatingToken) {
                        cancelCreateToken()
                    }
                    setActiveTab(newActiveTab)
                    if (newActiveTab === 'sportRooms') {
                        setSportRoomsBulkVisible(true)
                    }
                }
            })
        } else {
            if (isCreatingToken) {
                cancelCreateToken()
            }
            setActiveTab(newActiveTab)
            if (newActiveTab === 'sportRooms') {
                setSportRoomsBulkVisible(true)
            }
        }
    }

    const handleSaveField = async (field: string, value: string) => {
        try {
            await updateAggregator({
                variables: {
                    input: {
                        id: id || '',
                        [field]: value
                    }
                }
            })
            message.success('Данные обновлены успешно')
            refetch()
        } catch (error) {
            message.error('Ошибка при обновлении данных')
            throw error
        }
    }

    const handleDeleteToken = async (tokenId: string) => {
        try {
            await deleteApiTokens({
                variables: { tokenIds: [tokenId] }
            })
            await refetchTokens()
            message.success('Токен удален')
        } catch (error: any) {
            message.error(error.message || 'Ошибка удаления токена')
        }
    }

    const startCreateToken = () => {
        setIsCreatingToken(true)
        setNewTokenDescription('')
        setNewTokenExpiresAt(null)
    }

    const cancelCreateToken = () => {
        setIsCreatingToken(false)
        setNewTokenDescription('')
        setNewTokenExpiresAt(null)
        setPendingCreation(null)
    }

    const saveCreateToken = async () => {
        if (!id || !newTokenDescription.trim()) {
            message.error('Введите описание токена')
            return
        }

        try {
            const { data } = await createApiToken({
                variables: {
                    input: {
                        tokenDescription: newTokenDescription.trim(),
                        aggregatorId: id,
                        expiresAt: newTokenExpiresAt
                    }
                }
            })

            if (data?.apiTokenCreate?.token) {
                await refetchTokens()
                message.success('Токен создан')
                setIsCreatingToken(false)
                setNewTokenDescription('')
                setNewTokenExpiresAt(null)
                setPendingCreation(null)
            } else {
                message.error('Токен не был создан')
            }
        } catch (error: any) {
            message.error(error.message || 'Ошибка создания токена')
        }
    }

    const handleTokenKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTokenDescription.trim()) {
            e.preventDefault()
            saveCreateToken()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            cancelCreateToken()
        }
    }

    const filteredTokens = useMemo(() => {
        if (!tokens || !tokensSearchQuery.trim()) {
            return tokens
        }

        const query = tokensSearchQuery.toLowerCase().trim()

        return tokens.filter(token => {
            const description = token.description.toLowerCase()

            const searchWords = query.split(/\s+/).filter(word => word.length > 0)

            return searchWords.every(word => description.includes(word))
        })
    }, [tokens, tokensSearchQuery])

    const filteredClients = useMemo(() => {
        if (!aggregator?.clients || !clientsSearchQuery.trim()) {
            return aggregator?.clients || []
        }

        const query = clientsSearchQuery.toLowerCase().trim()

        return aggregator.clients.filter(clientRecord => {
            const client = clientRecord.client
            const phone = (client.phone || '').toLowerCase()
            const snils = (client.snils || '').toLowerCase()
            const birthdate = (client.birthdate || '').toLowerCase()
            const fio = [client.lastName, client.firstName, client.patronymic]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            const cleanPhone = (client.phone || '').replace(/[^0-9]/g, '')
            const cleanSnils = (client.snils || '').replace(/[^0-9]/g, '')

            const searchWords = query.split(/\s+/).filter(word => word.length > 0)

            return searchWords.every(word => {
                const cleanWord = word.replace(/[^0-9]/g, '')
                return (
                    phone.includes(word) ||
                    snils.includes(word) ||
                    fio.includes(word) ||
                    birthdate.includes(word) ||
                    (cleanWord.length > 0 && (cleanPhone.includes(cleanWord) || cleanSnils.includes(cleanWord)))
                )
            })
        })
    }, [aggregator?.clients, clientsSearchQuery])

    const newTokenRow = isCreatingToken
        ? {
              id: 'creating',
              description: newTokenDescription,
              expiresAt: newTokenExpiresAt,
              createdAt: new Date().toISOString()
          }
        : null

    const tokensTableData = newTokenRow ? [newTokenRow, ...filteredTokens] : filteredTokens

    const tokensColumns: ColumnsType<any> = [
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (description: string, record: any) => {
                if (record.id === 'creating') {
                    return (
                        <div className="flex items-center gap-1">
                            <Input
                                value={newTokenDescription}
                                onChange={e => setNewTokenDescription(e.target.value)}
                                onKeyDown={handleTokenKeyPress}
                                placeholder="Описание токена"
                                autoFocus
                                size="small"
                                className="flex-1"
                            />
                        </div>
                    )
                }
                return (
                    <div className="flex items-center gap-2">
                        <Key size={16} style={{ color: token.colorWarning }} />
                        <Text className="!mb-0" strong>
                            {description}
                        </Text>
                    </div>
                )
            }
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date: string, record: any) => {
                if (record.id === 'creating') {
                    return (
                        <div className="flex items-center gap-2">
                            <Calendar size={16} style={{ color: token.colorInfo }} />
                            <Text className="!mb-0" style={{ color: token.colorTextSecondary }}>
                                Сейчас
                            </Text>
                        </div>
                    )
                }
                return (
                    <div className="flex items-center gap-2">
                        <Calendar size={16} style={{ color: token.colorInfo }} />
                        <Text className="!mb-0">{dayjs(date).format('DD.MM.YYYY HH:mm')}</Text>
                    </div>
                )
            }
        },
        {
            title: 'Дата истечения',
            dataIndex: 'expiresAt',
            key: 'expiresAt',
            width: 200,
            render: (expiresAt: string | null, record: any) => {
                if (record.id === 'creating') {
                    return (
                        <div className="flex items-center gap-1 w-full">
                            <DatePicker
                                value={newTokenExpiresAt ? dayjs(newTokenExpiresAt) : null}
                                onChange={date => setNewTokenExpiresAt(date ? date.toISOString() : null)}
                                onKeyDown={handleTokenKeyPress}
                                placeholder="Выберите дату"
                                size="small"
                                className="flex-1"
                                format="DD.MM.YYYY"
                                disabledDate={current => current && current < dayjs().startOf('day')}
                            />
                        </div>
                    )
                }
                return (
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        {expiresAt ? (
                            <span className="font-medium">{dayjs(expiresAt).format('DD.MM.YYYY HH:mm')}</span>
                        ) : (
                            <Tag color="green">Бессрочный</Tag>
                        )}
                    </div>
                )
            }
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 120,
            align: 'center',
            render: (_, record: any) => {
                if (record.id === 'creating') {
                    return (
                        <div className="flex gap-1">
                            <Button
                                type="text"
                                size="small"
                                icon={<Check size={16} />}
                                onClick={saveCreateToken}
                                style={{ color: token.colorSuccess }}
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<X size={16} />}
                                onClick={cancelCreateToken}
                                style={{ color: token.colorError }}
                            />
                        </div>
                    )
                }
                return (
                    <div className="flex justify-center">
                        <Popconfirm
                            title="Удалить токен?"
                            description="Это действие нельзя отменить"
                            onConfirm={() => handleDeleteToken(record.id)}
                            okText="Удалить"
                            cancelText="Отмена"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Удалить токен">
                                <Button type="text" danger icon={<Trash2 size={16} />} size="small" />
                            </Tooltip>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ]

    const clientsColumns = [
        {
            title: 'ФИО',
            key: 'fio',
            render: (_: any, record: any) => {
                const { firstName, lastName, patronymic } = record.client || {}
                const fio = [lastName, firstName, patronymic].filter(Boolean).join(' ') || '—'
                return (
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        <span className="font-medium">{fio}</span>
                    </div>
                )
            }
        },
        {
            title: 'Телефон',
            dataIndex: ['client', 'phone'],
            key: 'phone',
            render: (phone: string | undefined) => <span>{phone || '—'}</span>
        },
        {
            title: 'СНИЛС',
            dataIndex: ['client', 'snils'],
            key: 'snils',
            render: (snils: string | undefined) => <span>{snils || '—'}</span>
        },
        {
            title: 'Дата рождения',
            dataIndex: ['client', 'birthdate'],
            key: 'birthdate',
            render: (date: string | undefined) => <span>{date ? dayjs(date).format('DD.MM.YYYY') : '—'}</span>
        }
    ]

    if (loading) {
        return (
            <div className="flex flex-col flex-1">
                <Toolbar
                    title="Агрегатор"
                    prefix={
                        <Button
                            type="text"
                            size="small"
                            shape="circle"
                            className="mr-2"
                            icon={<ArrowLeft size={16} />}
                            onClick={() => navigate('/aggregators')}
                        />
                    }
                />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    if (!aggregator) {
        return (
            <div className="flex flex-col flex-1">
                <Toolbar
                    title="Агрегатор"
                    prefix={
                        <Button
                            type="text"
                            size="small"
                            shape="circle"
                            className="mr-2"
                            icon={<ArrowLeft size={16} />}
                            onClick={() => navigate('/aggregators')}
                        />
                    }
                />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <Title level={3}>Агрегатор не найден</Title>
                    <Button onClick={() => navigate('/aggregators')} className="mt-4">
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        )
    }

    const tabItems = [
        {
            key: 'tokens',
            label: (
                <div className="flex items-center gap-2">
                    <Key size={16} />
                    <span>Токены</span>
                    {!isCreatingToken && (
                        <Button
                            type="text"
                            icon={<Plus size={16} />}
                            size="small"
                            onClick={e => {
                                e.stopPropagation()
                                if (activeTab !== 'tokens') {
                                    setPendingCreation('token')
                                    handleTabChange('tokens')
                                } else {
                                    startCreateToken()
                                }
                            }}
                        />
                    )}
                </div>
            )
        },
        {
            key: 'clients',
            label: (
                <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>Клиенты</span>
                </div>
            )
        }
    ]

    return (
        <div className="flex flex-col flex-1">
            <Toolbar
                title={aggregator.name}
                prefix={
                    <Button
                        type="text"
                        size="small"
                        shape="circle"
                        className="mr-2"
                        icon={<ArrowLeft size={16} />}
                        onClick={() => navigate('/aggregators')}
                    />
                }
                actions={
                    <div className="flex items-center gap-2">
                        <SearchInput
                            activeTab={activeTab}
                            tokensSearchQuery={tokensSearchQuery}
                            setTokensSearchQuery={setTokensSearchQuery}
                            clientsSearchQuery={clientsSearchQuery}
                            setClientsSearchQuery={setClientsSearchQuery}
                            token={token}
                        />
                        <Button onClick={() => setSportRoomsBulkVisible(true)}>
                            Спортивные площадки
                        </Button>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col px-4 mt-4 gap-4">
                <Card size="small" classNames={{ body: '!px-4' }} className="shrink-0">
                    <Descriptions size="small" title="Основная информация" bordered>
                        <Descriptions.Item label="Название" span={3}>
                            <EditableCell
                                value={aggregator.name}
                                onSave={value => handleSaveField('name', value)}
                                placeholder="Введите название агрегатора"
                                icon={<Building2 size={16} style={{ color: token.colorPrimary }} />}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <Tooltip title="URL, на который будет отправлен запрос при создании бронирования, для списания средств и проверки возможности бронирования">
                                    Webhook создания бронирования
                                </Tooltip>
                            }
                            span={3}
                        >
                            <EditableCell
                                value={aggregator.createBookingWebhook}
                                onSave={value => handleSaveField('createBookingWebhook', value)}
                                placeholder="Введите URL webhook"
                                icon={<Link2 size={16} style={{ color: token.colorInfo }} />}
                                inputType="textarea"
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={
                                <Tooltip title="URL, на который будет отправлен запрос при изменении статуса бронирования">
                                    Webhook изменения статуса
                                </Tooltip>
                            }
                            span={3}
                        >
                            <EditableCell
                                value={aggregator.changeStatusWebhook}
                                onSave={value => handleSaveField('changeStatusWebhook', value)}
                                placeholder="Введите URL webhook"
                                icon={<Link2 size={16} style={{ color: token.colorInfo }} />}
                                inputType="textarea"
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Дата создания">
                            {dayjs(aggregator.createdAt).format('DD.MM.YYYY HH:mm')}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card
                    size="small"
                    className=" flex-1 flex flex-col"
                    classNames={{
                        body: 'flex-1 flex flex-col !px-4 !pt-0'
                    }}
                >
                    <Tabs
                        defaultActiveKey="tokens"
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        className="shrink-0"
                        tabBarStyle={{ marginBottom: 16 }}
                        items={tabItems}
                    />

                    <div className="flex-1 h-full">
                        {activeTab === 'tokens' && (
                            <DataTable
                                data={tokensTableData}
                                columns={tokensColumns}
                                rowKey="id"
                                loading={loading}
                                locale={{
                                    emptyText: isCreatingToken
                                        ? 'Заполните поля для создания токена'
                                        : tokensSearchQuery.trim()
                                        ? 'Токены не найдены'
                                        : 'Нет токенов'
                                }}
                            />
                        )}
                        
                        {activeTab === 'clients' && (
                            <DataTable
                                data={filteredClients}
                                columns={clientsColumns}
                                rowKey={record => `${record.client.id}-${record.createdAt}`}
                                locale={{
                                    emptyText: clientsSearchQuery.trim() ? 'Клиенты не найдены' : 'Нет клиентов'
                                }}
                            />
                        )}
                    </div>
                </Card>
            </div>
            <SportRoomsBulkModal
                visible={sportRoomsBulkVisible}
                aggregator={aggregator as any}
                onClose={() => setSportRoomsBulkVisible(false)}
                onRefresh={() => {
                    refetch()
                }}
                onSportRoomChange={() => {
                    refetch()
                }}
            />
        </div>
    )
}
