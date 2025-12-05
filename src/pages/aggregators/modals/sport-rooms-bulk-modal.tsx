import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { App, Button, Input, Space, theme } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DataTable, StatsCard } from '@/components/ui'
import {
    useGetAllSportRoomsForAdminQuery,
    useGetSportRoomToAggregatorQuery,
    useUpdateSportRoomToAggregatorMutation
} from '@/graphql/generated'
import { BaseModal } from './components'
import { Building2, Check, Home, Search, X } from 'lucide-react'

type Aggregator = import('@/graphql/generated').GetAllAggregatorsQuery['aggregator_GetAll'][0]
type SportRoomFromQuery = NonNullable<import('@/graphql/generated').GetAllSportRoomsForAdminQuery['sportRooms_Get']>[0]


interface SportRoomsBulkModalProps {
    visible: boolean
    aggregator: Aggregator | null
    onClose: () => void
    onRefresh?: () => void
    onSportRoomChange?: (aggregatorId: string, newSportRoomsCount: number) => void
}

type ComplexRow = {
    key: string
    type: 'complex'
    id: string
    title: string
    children: RoomRow[]
}

type RoomRow = {
    key: string
    type: 'room'
    id: string
    title: string
    parentId: string
}

export function SportRoomsBulkModal({ visible, aggregator, onClose, onRefresh, onSportRoomChange }: SportRoomsBulkModalProps) {
    const { token } = theme.useToken()
    const { message } = App.useApp()

    const [searchQuery, setSearchQuery] = useState('')
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([])

    const { data: sportRoomsData, loading: loadingRooms } = useGetAllSportRoomsForAdminQuery({
        fetchPolicy: 'cache-and-network',
        skip: !visible
    })

    const { data: connectionsData, refetch: refetchConnections } = useGetSportRoomToAggregatorQuery({
        variables: { aggregatorId: aggregator?.id || '' },
        skip: !aggregator?.id || !visible,
        fetchPolicy: 'cache-and-network'
    })

    const [updateConnections, { loading: saving }] = useUpdateSportRoomToAggregatorMutation()

    useEffect(() => {
        if (connectionsData?.aggregator_GetSportRoomToAggregator) {
            const ids = connectionsData.aggregator_GetSportRoomToAggregator
                .map(c => c.sportRoom?.id)
                .filter(Boolean) as string[]
            setSelectedRoomIds(ids)
        } else if (visible) {
            setSelectedRoomIds([])
        }
    }, [connectionsData, visible])

    const groupedData: ComplexRow[] = useMemo(() => {
        const rooms = sportRoomsData?.sportRooms_Get || []
        const complexesMap = new Map<string, ComplexRow>()
        rooms.forEach((room: SportRoomFromQuery) => {
            const complexId = room.sportComplex.id
            const complexTitle = room.sportComplex.title
            if (!complexesMap.has(complexId)) {
                complexesMap.set(complexId, {
                    key: complexId,
                    type: 'complex',
                    id: complexId,
                    title: complexTitle,
                    children: []
                })
            }
            complexesMap.get(complexId)!.children.push({
                key: room.id,
                type: 'room',
                id: room.id,
                title: room.title,
                parentId: complexId
            })
        })
        const result = Array.from(complexesMap.values())
            .filter(c => c.children.length > 0)
            .map(c => ({
                ...c,
                children: c.children.sort((a, b) => a.title.localeCompare(b.title))
            }))
            .sort((a, b) => a.title.localeCompare(b.title))
        return result
    }, [sportRoomsData])

    useEffect(() => {
        if (visible) {
            setExpandedRowKeys(groupedData.map(c => c.key))
            setCurrentPage(1)
        }
    }, [visible, groupedData])

    const orderedData = useMemo(() => {
        const sorted = [...groupedData]
        sorted.sort((a, b) => {
            const aSelected = a.children.some(r => selectedRoomIds.includes(r.id))
            const bSelected = b.children.some(r => selectedRoomIds.includes(r.id))
            if (aSelected !== bSelected) return aSelected ? -1 : 1
            return a.title.localeCompare(b.title)
        })
        return sorted
    }, [groupedData, selectedRoomIds])

    const filteredData = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return orderedData
        const mapped = orderedData.map(c => {
            const complexMatches = c.title.toLowerCase().includes(q)
            if (complexMatches) {
                return c
            }
            return {
                ...c,
                children: c.children.filter(r => r.title.toLowerCase().includes(q))
            }
        })
        const filtered = mapped.filter(c => c.children.length > 0)
        filtered.sort((a, b) => {
            const aSelected = a.children.some(r => selectedRoomIds.includes(r.id))
            const bSelected = b.children.some(r => selectedRoomIds.includes(r.id))
            if (aSelected !== bSelected) return aSelected ? -1 : 1
            return a.title.localeCompare(b.title)
        })
        return filtered
    }, [orderedData, searchQuery, selectedRoomIds])

    const handleToggleRoom = useCallback((roomId: string) => {
        setSelectedRoomIds(prev => (prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]))
    }, [])

    const handleSelectAllFiltered = useCallback(() => {
        const allFilteredRoomIds = filteredData.flatMap(c => c.children.map(r => r.id))
        const allSelected = allFilteredRoomIds.every(id => selectedRoomIds.includes(id))
        if (allSelected) {
            setSelectedRoomIds(prev => prev.filter(id => !allFilteredRoomIds.includes(id)))
        } else {
            setSelectedRoomIds(prev => Array.from(new Set([...prev, ...allFilteredRoomIds])))
        }
    }, [filteredData, selectedRoomIds])

    const handleSave = async () => {
        if (!aggregator) return
        try {
            await updateConnections({
                variables: {
                    input: {
                        aggregatorId: aggregator.id,
                        sportRoomIds: selectedRoomIds
                    }
                }
            })
            await refetchConnections()
            onSportRoomChange?.(aggregator.id, selectedRoomIds.length)
            onRefresh?.()
            message.success('Связи обновлены')
            onClose()
        } catch (error: any) {
            message.error(error.message || 'Ошибка обновления связей')
        }
    }

    const columns: ColumnsType<ComplexRow | RoomRow> = [
        {
            title: (
                <div className="flex items-center gap-2">
                    <Search size={14} />
                    <span>Спорт-комплексы и площадки</span>
                </div>
            ),
            key: 'title',
            render: (_: any, record: any) => {
                if (record.type === 'complex') {
                    return (
                        <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-blue-500" />
                            <span className="font-medium">{record.title}</span>
                        </div>
                    )
                }
                const checked = selectedRoomIds.includes(record.id)
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleRoom(record.id)}
                            className="cursor-pointer"
                        />
                        <Home size={16} className="text-purple-500" />
                        <span className="font-medium">{record.title}</span>
                    </div>
                )
            }
        }
    ]

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            title="Спортивные площадки"
            subtitle={`${aggregator?.name || 'Агрегатор'}`}
            icon={<Home size={16} />}
            actions={
                <Space>
                    <Input
                        placeholder="Поиск"
                        prefix={<Search size={14} style={{ color: token.colorTextSecondary }} />}
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                        allowClear
                        size="middle"
                        style={{ width: 300, borderRadius: token.borderRadius }}
                    />
                    <Button
                        onClick={() => {
                            handleSelectAllFiltered()
                        }}
                        icon={
                            filteredData.flatMap(c => c.children.map(r => r.id)).every(id => selectedRoomIds.includes(id)) ? (
                                <X size={16} />
                            ) : (
                                <Check size={16} />
                            )
                        }
                    >
                        {filteredData.flatMap(c => c.children.map(r => r.id)).every(id => selectedRoomIds.includes(id))
                            ? 'Снять все'
                            : 'Выбрать все'}
                    </Button>
                    <Button
                        type="primary"
                        icon={<Check size={16} />}
                        onClick={handleSave}
                        loading={saving}
                        style={{
                            borderRadius: token.borderRadius,
                            background: token.colorSuccess,
                            borderColor: token.colorSuccess
                        }}
                    >
                        Сохранить
                    </Button>
                </Space>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <StatsCard title="Всего комплексов" value={filteredData.length} icon={<Building2 size={14} />} color={token.colorPrimary} />
                <StatsCard
                    title="Всего площадок"
                    value={filteredData.reduce((acc, c) => acc + c.children.length, 0)}
                    icon={<Home size={14} />}
                    color={token.colorInfo}
                />
                <StatsCard title="Выбрано площадок" value={selectedRoomIds.length} icon={<Check size={14} />} color={token.colorSuccess} />
            </div>

            <DataTable
                data={filteredData as any}
                columns={columns as any}
                rowKey="key"
                loading={loadingRooms}
                expandable={{
                    expandedRowKeys,
                    onExpandedRowsChange: keys => setExpandedRowKeys(keys as string[]),
                    rowExpandable: (record: any) => record.type === 'complex',
                    defaultExpandAllRows: true
                }}
                pagination={{ pageSize: 10, showSizeChanger: false, current: currentPage, onChange: setCurrentPage }}
                locale={{ emptyText: 'Нет доступных площадок' }}
            />
        </BaseModal>
    )
}


