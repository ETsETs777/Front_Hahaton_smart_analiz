import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Layout, Typography, Button, Input, theme } from 'antd'
import { App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ArrowLeft, Home, Search, CheckCircle, XCircle } from 'lucide-react'

import { LoadingSpinner, DataTable } from '@/components/ui'
import { useSEO } from '@/hooks/use-seo'
import { useGetSportComplexByIdQuery } from '@/graphql/generated'
import { Toolbar } from '@/components/layout'
import { SportRoomModal } from './modals'
import { Button as AntButton, Tooltip } from 'antd'
import { Pencil } from 'lucide-react'

const { Title, Text } = Typography

type SportComplex = NonNullable<ReturnType<typeof useGetSportComplexByIdQuery>['data']>['sportComplexes_Get'][0]
type SportRoom = any

const SearchInput = React.memo(function SearchInput({
    roomsSearch,
    setRoomsSearch,
    token
}: {
    roomsSearch: string
    setRoomsSearch: (v: string) => void
    token: any
}) {
    return (
        <Input
            placeholder="Поиск"
            prefix={<Search size={16} style={{ color: token.colorTextSecondary }} />}
            value={roomsSearch}
            onChange={e => setRoomsSearch(e.target.value)}
            allowClear
            size="middle"
            style={{ width: 250 }}
        />
    )
})

export default function SportComplexDetailPage() {
    const { message } = App.useApp()
    const { token } = theme.useToken()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [roomsSearch, setRoomsSearch] = useState('')
    const [sportRoomModal, setSportRoomModal] = useState<{ visible: boolean; sportRoom: SportRoom | null }>({
        visible: false,
        sportRoom: null
    })

    // GraphQL hooks
    const {
        data: sportComplexData,
        loading: loadingSportComplex,
        refetch: refetchSportComplex
    } = useGetSportComplexByIdQuery({
        variables: { ids: id ? [id as string] : [] },
        skip: !id,
        fetchPolicy: 'cache-and-network'
    })

    const sportComplex = sportComplexData?.sportComplexes_Get?.[0]

    useSEO({
        title: `${sportComplex?.title || 'Спорткомплекс'} - Спортпомещения`,
        description: `Управление спортивными помещениями комплекса ${sportComplex?.title}`,
        keywords: 'спорткомплекс, спортпомещения, управление',
        noindex: true,
        url: `${window.location.origin}/sport-complexes/${id}`
    })

    // Filtered data
    const filteredRooms = useMemo(() => {
        if (!sportComplex?.sportRooms) return []
        if (!roomsSearch.trim()) return sportComplex.sportRooms

        const query = roomsSearch.toLowerCase().trim()
        return sportComplex.sportRooms.filter(room => {
            const title = room.title.toLowerCase()
            const iasId = (room.iasId || '').toLowerCase()
            const iasNumber = (room.iasRegistryNumber || '').toLowerCase()
            return title.includes(query) || iasId.includes(query) || iasNumber.includes(query)
        })
    }, [sportComplex?.sportRooms, roomsSearch])

    const handleSportRoomClick = (sportRoom: SportRoom) => {
        setSportRoomModal({ visible: true, sportRoom })
    }

    const handleSportRoomModalClose = () => {
        setSportRoomModal({ visible: false, sportRoom: null })
    }

    if (loadingSportComplex && !sportComplexData) {
        return (
            <div className="flex flex-col flex-1">
                <Toolbar
                    title="Спорткомплекс"
                    prefix={
                        <Button
                            type="text"
                            size="small"
                            shape="circle"
                            className="mr-2"
                            icon={<ArrowLeft size={16} />}
                            onClick={() => navigate('/sport-complexes')}
                        />
                    }
                />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    if (!sportComplex) {
        return (
            <div className="flex flex-col flex-1">
                <Toolbar
                    title="Спорткомплекс"
                    prefix={
                        <Button
                            type="text"
                            size="small"
                            shape="circle"
                            className="mr-2"
                            icon={<ArrowLeft size={16} />}
                            onClick={() => navigate('/sport-complexes')}
                        />
                    }
                />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <Title level={3}>Спорткомплекс не найден</Title>
                    <Button onClick={() => navigate('/sport-complexes')} className="mt-4">
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        )
    }

    // Sport Rooms columns
    const roomsColumns: ColumnsType<SportRoom> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            width: 280,
            ellipsis: true,
            render: (title: string) => (
                <div className="flex items-center gap-2">
                    <Home size={16} className="text-blue-500" />
                    <span className="font-medium">{title}</span>
                </div>
            )
        },
        {
            title: 'ИАС номер',
            dataIndex: 'iasRegistryNumber',
            key: 'iasRegistryNumber',
            width: 150,
            render: (val: string | null) => <span>{val || '—'}</span>
        },
        {
            title: 'ИАС ID',
            dataIndex: 'iasId',
            key: 'iasId',
            width: 150,
            render: (val: string | null) => <span>{val || '—'}</span>
        },
        {
            title: 'Активна',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            align: 'center',
            render: (isActive: boolean) => (
                <div className="flex justify-center items-center">
                    {isActive ? (
                        <CheckCircle size={16} style={{ color: token.colorSuccess }} />
                    ) : (
                        <XCircle size={16} style={{ color: token.colorError }} />
                    )}
                </div>
            )
        },
    ]

    // Обработчик клика по строке
    const handleRowClick = (sportRoom: SportRoom) => ({
        onClick: () => handleSportRoomClick(sportRoom),
        style: {
            cursor: 'pointer',
            background: 'none',
            transition: 'background 0.1s'
        },
        onMouseEnter: (e: any) => {
            e.currentTarget.style.background = document.body.classList.contains('dark')
                ? 'rgba(30, 58, 138, 0.10)' // тёмная тема: лёгкий синий оттенок
                : 'rgba(30, 64, 175, 0.06)' // светлая тема: лёгкий синий оттенок
        },
        onMouseLeave: (e: any) => {
            e.currentTarget.style.background = 'none'
        },
        onFocus: (e: any) => {
            e.currentTarget.style.boxShadow = 'none'
        }
    })

    return (
        <div className="flex flex-col flex-1">
            <Toolbar
                title={sportComplex.title || 'Спорткомплекс'}
                prefix={
                    <Button
                        type="text"
                        size="small"
                        shape="circle"
                        className="mr-2"
                        icon={<ArrowLeft size={16} />}
                        onClick={() => navigate('/sport-complexes')}
                    />
                }
                actions={<SearchInput roomsSearch={roomsSearch} setRoomsSearch={setRoomsSearch} token={token} />}
            />
            <div className="flex-1 flex flex-col px-4 mt-4">
                <DataTable
                    data={filteredRooms}
                    columns={roomsColumns}
                    rowKey="id"
                    loading={loadingSportComplex}
                    onRow={handleRowClick}
                    locale={{
                        emptyText: roomsSearch.trim() ? 'Спортпомещения не найдены' : 'Нет спортпомещений'
                    }}
                />
            </div>

            <SportRoomModal
                visible={sportRoomModal.visible}
                sportRoom={sportRoomModal.sportRoom}
                onClose={handleSportRoomModalClose}
            />
        </div>
    )
}
