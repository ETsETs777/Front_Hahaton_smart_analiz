import React, { useState, useMemo, useEffect } from 'react'
import { App, Button, Input, Select, Popconfirm, Tabs, theme, Typography, Form, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Home, Package, Wrench, Plus, Trash2, Building2, Check, X, Network, LayoutList } from 'lucide-react'
import { DataTable, IconBadge, StatsCard } from '@/components/ui'
import {
    useGetSportRoomsByIdsForModalQuery,
    useCreateServiceMutation,
    useDeleteServicesMutation,
    useGetAllAggregatorsQuery,
    useCreateSportRoomToAggregatorMutation,
    useDeleteSportRoomToAggregatorMutation,
    useUpdateSportRoomIasMutation
} from '@/graphql/generated'
import { BaseModal } from '../../aggregators/modals/components'

const { Text } = Typography

type SportRoom = NonNullable<ReturnType<typeof useGetSportRoomsByIdsForModalQuery>['data']>['sportRooms_Get'][0]

const CREATING_ID = 'creating'
const CREATING_AGGREGATOR_ID = 'creating_aggregator'

interface SportRoomModalProps {
    visible: boolean
    sportRoom: SportRoom | null
    onClose: () => void
}

export function SportRoomModal({ visible, sportRoom, onClose }: SportRoomModalProps) {
    const { message } = App.useApp()
    const { token } = theme.useToken()
    const [activeTab, setActiveTab] = useState('info')

    // Состояния для создания услуги
    const [isCreatingService, setIsCreatingService] = useState(false)
    const [newServiceTitle, setNewServiceTitle] = useState('')
    const [newServiceId, setNewServiceId] = useState('')

    // Состояния для создания связи с агрегатором
    const [isCreatingAggregator, setIsCreatingAggregator] = useState(false)
    const [newAggregatorId, setNewAggregatorId] = useState('')

    // Локальное состояние для услуг и агрегаторов
    const [localServices, setLocalServices] = useState<any[]>([])
    const [localAggregators, setLocalAggregators] = useState<any[]>([])
    const [iasRegistryNumber, setIasRegistryNumber] = useState('')
    const [iasId, setIasId] = useState('')
    const [sportRoomTitle, setSportRoomTitle] = useState('')
    const [modalTitle, setModalTitle] = useState('')

    // GraphQL hooks
    const { data: sportRoomData, loading: loadingSportRoom } = useGetSportRoomsByIdsForModalQuery({
        variables: { ids: sportRoom ? [sportRoom.id] : [] },
        skip: !sportRoom,
        fetchPolicy: 'cache-and-network'
    })

    const { data: aggregatorsData } = useGetAllAggregatorsQuery()

    const [createService, { loading: creatingService }] = useCreateServiceMutation()
    const [deleteServices] = useDeleteServicesMutation()
    const [createSportRoomToAggregator] = useCreateSportRoomToAggregatorMutation()
    const [deleteSportRoomToAggregator] = useDeleteSportRoomToAggregatorMutation()
    const [updateSportRoomIas, { loading: updatingIas }] = useUpdateSportRoomIasMutation()

    const currentSportRoom = sportRoomData?.sportRooms_Get?.[0]
    const allAggregators = aggregatorsData?.aggregator_GetAll || []

    useEffect(() => {
        if (visible) {
            setActiveTab('info')
        }
    }, [visible])

    // Инициализация локального состояния при загрузке данных
    useEffect(() => {
        if (currentSportRoom?.services) {
            setLocalServices(currentSportRoom.services)
        }
    }, [currentSportRoom?.services])

    useEffect(() => {
        if (currentSportRoom?.aggregators) {
            const aggregators = currentSportRoom.aggregators.map((agg: any) => agg.aggregator)
            setLocalAggregators(aggregators)
        }
    }, [currentSportRoom?.aggregators])

    useEffect(() => {
        if (currentSportRoom) {
            setIasRegistryNumber(currentSportRoom.iasRegistryNumber || '')
            setIasId(currentSportRoom.iasId || '')
            setSportRoomTitle(currentSportRoom.title || '')
            setModalTitle(currentSportRoom.title || '')
        } else {
            setIasRegistryNumber('')
            setIasId('')
            setSportRoomTitle('')
            setModalTitle('')
        }
    }, [currentSportRoom])

    // Фильтруем услуги для текущего спортпомещения
    const roomServices = useMemo(() => {
        return localServices
    }, [localServices])

    // Фильтруем агрегаторы, исключая уже добавленные
    const availableAggregators = useMemo(() => {
        const currentAggregatorIds = localAggregators.map(agg => agg.id)
        return allAggregators.filter(agg => !currentAggregatorIds.includes(agg.id))
    }, [allAggregators, localAggregators])

    // Статистика для карточек
    const stats = useMemo(() => {
        if (!currentSportRoom) return { aggregators: 0, resources: 0, services: 0 }

        return {
            aggregators: localAggregators.length,
            resources: currentSportRoom.sportResources?.length || 0,
            services: roomServices.length
        }
    }, [currentSportRoom, roomServices, localAggregators])

    // Обработчик клика вне таблицы и нажатия ESC при создании услуги
    useEffect(() => {
        const handleClickOutside = async (event: MouseEvent) => {
            if (!isCreatingService || !newServiceTitle.trim()) return

            const target = event.target as HTMLElement
            const isClickOnTable = target.closest('.ant-table') || target.closest('.ant-table-body')
            const isClickOnInput = target.closest('input') || target.closest('button')

            if (!isClickOnTable && !isClickOnInput) {
                // Прямой вызов создания услуги
                if (!newServiceTitle.trim()) {
                    message.error('Введите название услуги')
                    return
                }
                if (!newServiceId.trim()) {
                    message.error('Введите Service ID')
                    return
                }
                if (!sportRoom?.id) {
                    message.error('Спортивная площадка не выбрана')
                    return
                }

                try {
                    const result = await createService({
                        variables: {
                            input: {
                                title: newServiceTitle.trim(),
                                serviceId: newServiceId.trim(),
                                sportRoomId: sportRoom.id
                            }
                        }
                    })

                    if (result.data) {
                        const newService = {
                            id: result.data.service_Create?.id || Date.now().toString(),
                            title: newServiceTitle.trim(),
                            serviceId: newServiceId.trim(),
                            sportRoomId: sportRoom.id,
                            createdAt: new Date().toISOString()
                        }
                        setLocalServices(prev => [newService, ...prev])
                        message.success('Услуга создана')
                    }

                    setNewServiceTitle('')
                    setNewServiceId('')
                    setIsCreatingService(false)
                } catch (error: any) {
                    message.error(error.message || 'Ошибка создания услуги')
                }
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isCreatingService) {
                setNewServiceTitle('')
                setNewServiceId('')
                setIsCreatingService(false)
            }
        }

        if (isCreatingService) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isCreatingService, newServiceTitle, newServiceId, sportRoom?.id, createService, message])

    // Обработчик клика вне таблицы и нажатия ESC при создании связи с агрегатором
    useEffect(() => {
        const handleClickOutside = async (event: MouseEvent) => {
            if (!isCreatingAggregator || !newAggregatorId.trim()) return

            const target = event.target as HTMLElement
            const isClickOnTable = target.closest('.ant-table') || target.closest('.ant-table-body')
            const isClickOnInput = target.closest('input') || target.closest('button')

            if (!isClickOnTable && !isClickOnInput) {
                // Прямой вызов создания агрегатора
                if (!newAggregatorId.trim()) {
                    message.error('Выберите агрегатора')
                    return
                }
                if (!currentSportRoom?.id) {
                    message.error('Спортивная площадка не выбрана')
                    return
                }

                try {
                    const result = await createSportRoomToAggregator({
                        variables: {
                            input: {
                                sportRoomId: currentSportRoom.id,
                                aggregatorId: newAggregatorId
                            }
                        }
                    })

                    if (result.data) {
                        const selectedAggregator = allAggregators.find(agg => agg.id === newAggregatorId)
                        if (selectedAggregator) {
                            setLocalAggregators(prev => [selectedAggregator, ...prev])
                            message.success('Связь с агрегатором создана')
                        }
                    }

                    setNewAggregatorId('')
                    setIsCreatingAggregator(false)
                } catch (error: any) {
                    message.error(error.message || 'Ошибка создания связи с агрегатором')
                }
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isCreatingAggregator) {
                setNewAggregatorId('')
                setIsCreatingAggregator(false)
            }
        }

        if (isCreatingAggregator) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [
        isCreatingAggregator,
        newAggregatorId,
        currentSportRoom?.id,
        createSportRoomToAggregator,
        allAggregators,
        message
    ])

    const handleAggregatorsChange = async (aggregatorIds: string[]) => {
        if (!currentSportRoom) return

        try {
            const currentAggregatorIds = currentSportRoom.aggregators?.map((agg: any) => agg.aggregator.id) || []

            const aggregatorsToAdd = aggregatorIds.filter((id: string) => !currentAggregatorIds.includes(id))
            const aggregatorsToRemove = currentAggregatorIds.filter((id: string) => !aggregatorIds.includes(id))

            for (const aggregatorId of aggregatorsToAdd) {
                await createSportRoomToAggregator({
                    variables: {
                        input: {
                            sportRoomId: currentSportRoom.id,
                            aggregatorId
                        }
                    }
                })
            }

            for (const aggregatorId of aggregatorsToRemove) {
                await deleteSportRoomToAggregator({
                    variables: {
                        sportRoomId: currentSportRoom.id,
                        aggregatorId
                    }
                })
            }

            message.success('Связи с агрегаторами обновлены')
            // refetchSportRoom() // Удалено, так как localAggregators обновляется в useEffect
        } catch (error) {
            console.error('Error updating aggregators:', error)
            message.error('Ошибка обновления связей с агрегаторами')
        }
    }

    const handleDeleteService = async (serviceId: string) => {
        try {
            const result = await deleteServices({
                variables: { serviceIds: [serviceId] }
            })

            if (result.data) {
                setLocalServices(prev => prev.filter(service => service.id !== serviceId))
                message.success('Услуга удалена')
            }
        } catch (error) {
            console.error('Error deleting service:', error)
            message.error('Ошибка удаления услуги')
        }
    }

    const handleDeleteAggregator = async (aggregatorId: string) => {
        if (!currentSportRoom?.id) return

        try {
            const result = await deleteSportRoomToAggregator({
                variables: {
                    sportRoomId: currentSportRoom.id,
                    aggregatorId
                }
            })

            if (result.data) {
                setLocalAggregators(prev => prev.filter(agg => agg.id !== aggregatorId))
                message.success('Связь с агрегатором удалена')
            }
        } catch (error) {
            console.error('Error deleting aggregator:', error)
            message.error('Ошибка удаления связи с агрегатором')
        }
    }

    // Компоненты для рендера ячеек создания услуги
    const renderInputCell = (
        value: string,
        onChange: (value: string) => void,
        placeholder: string,
        hasError: boolean
    ) => (
        <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => {
                if (e.key === 'Enter' && newServiceTitle.trim() && newServiceId.trim()) {
                    // Прямой вызов создания услуги
                    if (!newServiceTitle.trim()) {
                        message.error('Введите название услуги')
                        return
                    }
                    if (!newServiceId.trim()) {
                        message.error('Введите Service ID')
                        return
                    }
                    if (!sportRoom?.id) {
                        message.error('Спортивная площадка не выбрана')
                        return
                    }

                    createService({
                        variables: {
                            input: {
                                title: newServiceTitle.trim(),
                                serviceId: newServiceId.trim(),
                                sportRoomId: sportRoom.id
                            }
                        }
                    })
                        .then(result => {
                            if (result.data) {
                                const newService = {
                                    id: result.data.service_Create?.id || Date.now().toString(),
                                    title: newServiceTitle.trim(),
                                    serviceId: newServiceId.trim(),
                                    sportRoomId: sportRoom.id,
                                    createdAt: new Date().toISOString()
                                }
                                setLocalServices(prev => [newService, ...prev])
                                message.success('Услуга создана')
                            }

                            setNewServiceTitle('')
                            setNewServiceId('')
                            setIsCreatingService(false)
                        })
                        .catch(error => {
                            message.error(error.message || 'Ошибка создания услуги')
                        })
                } else if (e.key === 'Escape') {
                    setNewServiceTitle('')
                    setNewServiceId('')
                    setIsCreatingService(false)
                }
            }}
            placeholder={placeholder}
            size="small"
            className="!rounded-md !py-1 !px-2 !text-sm w-full"
            status={hasError ? 'error' : ''}
            variant="filled"
        />
    )

    // Компоненты для рендера ячеек создания агрегатора
    const renderSelectCell = (
        value: string,
        onChange: (value: string) => void,
        placeholder: string,
        options: { label: string; value: string }[],
        hasError: boolean
    ) => (
        <Select
            value={value || undefined}
            onChange={onChange}
            onKeyDown={e => {
                if (e.key === 'Enter' && newAggregatorId.trim()) {
                    // Прямой вызов создания агрегатора
                    if (!newAggregatorId.trim()) {
                        message.error('Выберите агрегатора')
                        return
                    }
                    if (!currentSportRoom?.id) {
                        message.error('Спортивная площадка не выбрана')
                        return
                    }

                    createSportRoomToAggregator({
                        variables: {
                            input: {
                                sportRoomId: currentSportRoom.id,
                                aggregatorId: newAggregatorId
                            }
                        }
                    })
                        .then(result => {
                            if (result.data) {
                                const selectedAggregator = allAggregators.find(agg => agg.id === newAggregatorId)
                                if (selectedAggregator) {
                                    setLocalAggregators(prev => [selectedAggregator, ...prev])
                                    message.success('Связь с агрегатором создана')
                                }
                            }

                            setNewAggregatorId('')
                            setIsCreatingAggregator(false)
                        })
                        .catch(error => {
                            message.error(error.message || 'Ошибка создания связи с агрегатором')
                        })
                } else if (e.key === 'Escape') {
                    setNewAggregatorId('')
                    setIsCreatingAggregator(false)
                }
            }}
            placeholder={placeholder}
            className="!rounded-md !py-1 !px-2 !text-sm w-full"
            status={hasError ? 'error' : ''}
            variant="filled"
            options={options}
        />
    )

    const startCreateService = () => {
        setIsCreatingService(true)
    }

    const startCreateAggregator = () => {
        setIsCreatingAggregator(true)
    }

    // Колонки для агрегаторов
    const aggregatorsColumns: ColumnsType<any> = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, aggregator: any) => {
                if (aggregator.id === CREATING_AGGREGATOR_ID) {
                    return renderSelectCell(
                        newAggregatorId,
                        setNewAggregatorId,
                        'Выберите агрегатора *',
                        availableAggregators.map(agg => ({
                            label: agg.name,
                            value: agg.id
                        })),
                        !newAggregatorId
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
            title: 'Действия',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, aggregator: any) => {
                if (aggregator.id === CREATING_AGGREGATOR_ID) {
                    return (
                        <div className="flex gap-1" data-actions>
                            <Button
                                type="text"
                                size="small"
                                icon={<Check size={16} />}
                                onClick={() => {
                                    if (!newAggregatorId.trim()) {
                                        message.error('Выберите агрегатора')
                                        return
                                    }
                                    if (!currentSportRoom?.id) {
                                        message.error('Спортивная площадка не выбрана')
                                        return
                                    }
                                    createSportRoomToAggregator({
                                        variables: {
                                            input: {
                                                sportRoomId: currentSportRoom.id,
                                                aggregatorId: newAggregatorId
                                            }
                                        }
                                    })
                                        .then(result => {
                                            if (result.data) {
                                                const selectedAggregator = allAggregators.find(
                                                    agg => agg.id === newAggregatorId
                                                )
                                                if (selectedAggregator) {
                                                    setLocalAggregators(prev => [selectedAggregator, ...prev])
                                                    message.success('Связь с агрегатором создана')
                                                }
                                            }
                                            setNewAggregatorId('')
                                            setIsCreatingAggregator(false)
                                        })
                                        .catch(error => {
                                            message.error(error.message || 'Ошибка создания связи с агрегатором')
                                        })
                                }}
                                className="!text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<X size={16} />}
                                onClick={() => {
                                    setNewAggregatorId('')
                                    setIsCreatingAggregator(false)
                                }}
                                className="!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                            />
                        </div>
                    )
                }
                return (
                    <Popconfirm
                        title="Удалить связь с агрегатором?"
                        description="Это действие нельзя отменить"
                        onConfirm={() => handleDeleteAggregator(aggregator.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button type="text" danger icon={<Trash2 size={16} />} size="small" />
                    </Popconfirm>
                )
            }
        }
    ]

    // Колонки для спортивных ресурсов
    const resourcesColumns: ColumnsType<any> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            render: (title: string) => (
                <div className="flex items-center gap-2">
                    <LayoutList size={16} className="text-cyan-500" />
                    <span className="font-medium">{title}</span>
                </div>
            )
        }
    ]

    // Колонки для услуг
    const servicesColumns: ColumnsType<any> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, service: any) => {
                if (service.id === CREATING_ID) {
                    return renderInputCell(
                        newServiceTitle,
                        setNewServiceTitle,
                        'Название услуги *',
                        !newServiceTitle.trim()
                    )
                }
                return (
                    <div className="flex items-center gap-2">
                        <Wrench size={16} className="text-purple-500" />
                        <span className="font-medium">{title}</span>
                    </div>
                )
            }
        },
        {
            title: 'Service ID',
            dataIndex: 'serviceId',
            key: 'serviceId',
            render: (serviceId: string, service: any) => {
                if (service.id === CREATING_ID) {
                    return renderInputCell(newServiceId, setNewServiceId, 'Service ID *', !newServiceId.trim())
                }
                return <span>{serviceId}</span>
            }
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, service: any) => {
                if (service.id === CREATING_ID) {
                    return (
                        <div className="flex gap-1" data-actions>
                            <Button
                                type="text"
                                size="small"
                                icon={<Check size={16} />}
                                onClick={() => {
                                    if (!newServiceTitle.trim()) {
                                        message.error('Введите название услуги')
                                        return
                                    }
                                    if (!newServiceId.trim()) {
                                        message.error('Введите Service ID')
                                        return
                                    }
                                    if (!sportRoom?.id) {
                                        message.error('Спортивная площадка не выбрана')
                                        return
                                    }
                                    createService({
                                        variables: {
                                            input: {
                                                title: newServiceTitle.trim(),
                                                serviceId: newServiceId.trim(),
                                                sportRoomId: sportRoom.id
                                            }
                                        }
                                    })
                                        .then(result => {
                                            if (result.data) {
                                                const newService = {
                                                    id: result.data.service_Create?.id || Date.now().toString(),
                                                    title: newServiceTitle.trim(),
                                                    serviceId: newServiceId.trim(),
                                                    sportRoomId: sportRoom.id,
                                                    createdAt: new Date().toISOString()
                                                }
                                                setLocalServices(prev => [newService, ...prev])
                                                message.success('Услуга создана')
                                            }
                                            setNewServiceTitle('')
                                            setNewServiceId('')
                                            setIsCreatingService(false)
                                        })
                                        .catch(error => {
                                            message.error(error.message || 'Ошибка создания услуги')
                                        })
                                }}
                                className="!text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<X size={16} />}
                                onClick={() => {
                                    setNewServiceTitle('')
                                    setNewServiceId('')
                                    setIsCreatingService(false)
                                }}
                                className="!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                            />
                        </div>
                    )
                }
                return (
                    <Popconfirm
                        title="Удалить услугу?"
                        description="Это действие нельзя отменить"
                        onConfirm={() => handleDeleteService(service.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button type="text" danger icon={<Trash2 size={16} />} size="small" />
                    </Popconfirm>
                )
            }
        }
    ]

    // Данные для таблицы услуг
    const newServiceRow = isCreatingService
        ? {
              id: CREATING_ID,
              title: newServiceTitle,
              serviceId: newServiceId,
              createdAt: new Date().toISOString()
          }
        : null

    const servicesTableData = newServiceRow ? [newServiceRow, ...roomServices] : roomServices

    // Данные для таблицы агрегаторов
    const newAggregatorRow = isCreatingAggregator
        ? {
              id: CREATING_AGGREGATOR_ID,
              name: '',
              createdAt: new Date().toISOString()
          }
        : null

    const aggregatorsTableData = newAggregatorRow ? [newAggregatorRow, ...localAggregators] : localAggregators

    const tabItems = [
          {
            key: 'info',
            label: (
                <div className="flex items-center gap-2">
                    <Home size={16} />
                    <span>Информация</span>
                </div>
            )
        },
        {
            key: 'aggregators',
            label: (
                <div className="flex items-center gap-2">
                    <Network size={16} />
                    <span>Агрегаторы</span>
                    <Button
                        type="text"
                        icon={<Plus size={16} />}
                        size="small"
                        onClick={startCreateAggregator}
                        disabled={isCreatingAggregator}
                        className="ml-2"
                    />
                </div>
            )
        },
        {
            key: 'resources',
            label: (
                <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span>Спортивные ресурсы</span>
                </div>
            )
        },
        {
            key: 'services',
            label: (
                <div className="flex items-center gap-2">
                    <Wrench size={16} />
                    <span>Услуги</span>
                    <Button
                        type="text"
                        icon={<Plus size={16} />}
                        size="small"
                        onClick={startCreateService}
                        disabled={isCreatingService}
                        className="ml-2"
                    />
                </div>
            )
        },
    ]

    if (!sportRoom) return null

    return (
        <BaseModal visible={visible} onClose={onClose} title={modalTitle} subtitle="" icon={<Home size={16} />}>
            <div className="flex flex-col gap-1">
                {/* Карточки статистики */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <StatsCard
                        title="Агрегаторы"
                        value={stats.aggregators}
                        icon={<Network size={14} />}
                        color={token.colorInfo}
                    />
                    <StatsCard
                        title="Спортивные ресурсы"
                        value={stats.resources}
                        icon={<LayoutList size={14} />}
                        color={token.colorSuccess}
                    />
                    <StatsCard
                        title="Услуги"
                        value={stats.services}
                        icon={<Wrench size={14} />}
                        color={token.colorWarning}
                    />
                </div>

                {/* Разделы */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    size="middle"
                    className="shrink-0"
                    tabBarStyle={{ marginBottom: 4 }}
                />

                <div className="flex-1">
                    {activeTab === 'aggregators' && (
                        <DataTable
                            data={aggregatorsTableData}
                            columns={aggregatorsColumns}
                            rowKey="id"
                            loading={loadingSportRoom}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: false,
                                showQuickJumper: false,
                                size: 'small'
                            }}
                            className="overflow-x-auto"
                            locale={{
                                emptyText: 'Нет агрегаторов'
                            }}
                        />
                    )}
                    {activeTab === 'info' && (
                        <div className="max-w-xl">
                            <Form layout="vertical" size="middle">
                                <Form.Item label="Название">
                                    <Input
                                        value={sportRoomTitle}
                                        onChange={e => setSportRoomTitle(e.target.value)}
                                        placeholder="Введите название"
                                        allowClear
                                    />
                                </Form.Item>
                                <Form.Item label="Номер в реестре ИАС">
                                    <Input
                                        value={iasRegistryNumber}
                                        onChange={e => setIasRegistryNumber(e.target.value)}
                                        placeholder="Введите номер в реестре ИАС"
                                        allowClear
                                    />
                                </Form.Item>
                                <Form.Item label="Идентификатор в ИАС">
                                    <Input
                                        value={iasId}
                                        onChange={e => setIasId(e.target.value)}
                                        onPressEnter={async () => {
                                            if (!currentSportRoom) return
                                            try {
                                                const result = await updateSportRoomIas({
                                                    variables: {
                                                        input: {
                                                            id: currentSportRoom.id,
                                                            iasRegistryNumber: iasRegistryNumber || null,
                                                            iasId: iasId || null,
                                                            title: sportRoomTitle || null
                                                        }
                                                    }
                                                })
                                                message.success('Данные ИАС обновлены')
                                                if (sportRoomTitle.trim()) {
                                                    setModalTitle(sportRoomTitle.trim())
                                                }
                                            } catch (err: any) {
                                                message.error(err.message || 'Ошибка обновления ИАС')
                                            }
                                        }}
                                        placeholder="Введите идентификатор в ИАС"
                                        allowClear
                                    />
                                </Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<Check size={16} />}
                                        loading={updatingIas}
                                        onClick={async () => {
                                            if (!currentSportRoom) return
                                            try {
                                                const result = await updateSportRoomIas({
                                                    variables: {
                                                        input: {
                                                            id: currentSportRoom.id,
                                                            iasRegistryNumber: iasRegistryNumber || null,
                                                            iasId: iasId || null,
                                                            title: sportRoomTitle || null
                                                        }
                                                    }
                                                })
                                                message.success('Данные ИАС обновлены')
                                                if (sportRoomTitle.trim()) {
                                                    setModalTitle(sportRoomTitle.trim())
                                                }
                                            } catch (err: any) {
                                                message.error(err.message || 'Ошибка обновления ИАС')
                                            }
                                        }}
                                    >
                                        Сохранить
                                    </Button>
                                </Space>
                            </Form>
                        </div>
                    )}
                    {activeTab === 'resources' && (
                        <DataTable
                            data={currentSportRoom?.sportResources || []}
                            columns={resourcesColumns}
                            rowKey="id"
                            loading={loadingSportRoom}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: false,
                                showQuickJumper: false,
                                size: 'small'
                            }}
                            className="overflow-x-auto"
                            locale={{
                                emptyText: 'Нет спортивных ресурсов'
                            }}
                        />
                    )}
                    {activeTab === 'services' && (
                        <DataTable
                            data={servicesTableData}
                            columns={servicesColumns}
                            rowKey="id"
                            loading={loadingSportRoom}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: false,
                                showQuickJumper: false,
                                size: 'small'
                            }}
                            className="overflow-x-auto"
                            locale={{
                                emptyText: 'Нет услуг'
                            }}
                        />
                    )}
                </div>
            </div>
        </BaseModal>
    )
}
