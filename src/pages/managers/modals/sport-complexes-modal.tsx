import { DataTable, IconBadge, StatsCard } from '@/components/ui'
import type { GetAllManagersQuery } from '@/graphql/generated'
import { useGetAllSportComplexesForAdminQuery, useUpdateUserMutation } from '@/graphql/generated'
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { App, Button, Checkbox, Input, Popover, Space, Spin, Tag, theme, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Building2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BaseModal } from '../../aggregators/modals/components'

type Manager = GetAllManagersQuery['user_GetAllManagers'][0]
type SportComplex = NonNullable<Manager['sportComplexes']>[0]
type SportComplexFromQuery = NonNullable<import('@/graphql/generated').GetAllSportComplexesForAdminQuery['sportComplexes_Get']>[0]

const { Text } = Typography

interface SportComplexesModalProps {
    visible: boolean
    manager: Manager | null
    onClose: () => void
    onUpdate?: () => void
}

// Константы для улучшения читаемости
const PAGINATION_CONFIG = {
    pageSize: 10,
    showSizeChanger: false,
    showQuickJumper: true
} as const

const SEARCH_DEBOUNCE_MS = 300

export function SportComplexesModal({ visible, manager, onClose, onUpdate }: SportComplexesModalProps) {
    const { token } = theme.useToken()
    const { message } = App.useApp()
    const [updateUser, { loading: updateLoading }] = useUpdateUserMutation()
    const [selectedComplexIds, setSelectedComplexIds] = useState<string[]>([])
    const [allComplexes, setAllComplexes] = useState<SportComplex[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [isInitialized, setIsInitialized] = useState(false)
    const [assignmentsPopoverVisible, setAssignmentsPopoverVisible] = useState(false)

    const { data: complexesData, loading: complexesLoading } = useGetAllSportComplexesForAdminQuery({
        fetchPolicy: 'cache-and-network'
    })

    // Мемоизированная обработка данных спорткомплексов
    const processedComplexes = useMemo(() => {
        if (!complexesData?.sportComplexes_Get) return []

        return complexesData.sportComplexes_Get.map((complex: SportComplexFromQuery) => ({
            id: complex.id,
            title: complex.title,
            idFrom1C: complex.id,
            createdAt: new Date().toISOString(),
            updatedAt: null
        })).sort((a, b) => a.title.localeCompare(b.title))
    }, [complexesData])

    // Обновление списка комплексов
    useEffect(() => {
        if (processedComplexes.length > 0) {
            setAllComplexes(processedComplexes)
            setIsInitialized(true)
        }
    }, [processedComplexes])

    // Инициализация выбранных комплексов при изменении менеджера
    useEffect(() => {
        if (manager?.sportComplexes) {
            setSelectedComplexIds(manager.sportComplexes.map(sc => sc.id))
        } else {
            setSelectedComplexIds([])
        }
    }, [manager])

    // Сброс пагинации при открытии модального окна
    useEffect(() => {
        if (visible) {
            setCurrentPage(1)
        }
    }, [visible])

    // Сброс пагинации при изменении поискового запроса
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    // Мемоизированная фильтрация комплексов
    const filteredComplexes = useMemo(() => {
        if (!searchQuery.trim()) {
            return allComplexes
        }

        const query = searchQuery.toLowerCase().trim()
        return allComplexes.filter(complex => complex.title.toLowerCase().includes(query))
    }, [allComplexes, searchQuery])

    // Мемоизированные статистики
    const stats = useMemo(() => {
        const selectedComplexes = allComplexes.filter(complex => selectedComplexIds.includes(complex.id))
        const unselectedComplexes = allComplexes.filter(complex => !selectedComplexIds.includes(complex.id))

        return {
            total: allComplexes.length,
            selected: selectedComplexIds.length,
            unselected: unselectedComplexes.length,
            selectedComplexes,
            unselectedComplexes
        }
    }, [allComplexes, selectedComplexIds])

    // Проверка изменений
    const isChanged = useMemo(() => {
        const currentIds = manager?.sportComplexes?.map(sc => sc.id) || []
        return JSON.stringify(currentIds.sort()) !== JSON.stringify(selectedComplexIds.sort())
    }, [manager?.sportComplexes, selectedComplexIds])

    // Обработчики событий с useCallback для предотвращения лишних ре-рендеров
    const handleClose = useCallback(() => {
        setSearchQuery('')
        setCurrentPage(1)
        onClose()
    }, [onClose])

    const handleSave = useCallback(async () => {
        if (!manager) return

        try {
            await updateUser({
                variables: {
                    input: {
                        id: manager.id,
                        sportComplexIds: selectedComplexIds
                    }
                }
            })

            message.success('Спорткомплексы обновлены')
            onUpdate?.()
            onClose()
        } catch (error: any) {
            message.error(error.message || 'Ошибка обновления спорткомплексов')
        }
    }, [manager, selectedComplexIds, updateUser, message, onUpdate, onClose])

    const handleComplexToggle = useCallback((complexId: string) => {
        setSelectedComplexIds(prev => {
            if (prev.includes(complexId)) {
                return prev.filter(id => id !== complexId)
            } else {
                return [...prev, complexId]
            }
        })
    }, [])

    const handleSelectAll = useCallback(() => {
        const filteredIds = filteredComplexes.map(c => c.id)
        const allFilteredSelected = filteredIds.every(id => selectedComplexIds.includes(id))

        if (allFilteredSelected) {
            setSelectedComplexIds(prev => prev.filter(id => !filteredIds.includes(id)))
        } else {
            setSelectedComplexIds(prev => [...new Set([...prev, ...filteredIds])])
        }
    }, [filteredComplexes, selectedComplexIds])

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    // Мемоизированные колонки таблицы
    const columns: ColumnsType<SportComplex> = useMemo(
        () => [
            {
                title: (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={
                                filteredComplexes.length > 0 &&
                                filteredComplexes.every(c => selectedComplexIds.includes(c.id))
                            }
                            indeterminate={
                                filteredComplexes.some(c => selectedComplexIds.includes(c.id)) &&
                                !filteredComplexes.every(c => selectedComplexIds.includes(c.id))
                            }
                            onChange={handleSelectAll}
                        />
                        <span>Название спорткомплекса</span>
                    </div>
                ),
                key: 'title',
                render: (_, complex: SportComplex) => (
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={selectedComplexIds.includes(complex.id)}
                            onChange={() => handleComplexToggle(complex.id)}
                        />
                        <div className="flex items-center gap-3">
                            <IconBadge icon={<Building2 size={16} />} color={token.colorInfo} />
                            <div style={{ color: token.colorText, fontWeight: token.fontWeightStrong }}>
                                {complex.title}
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'Статус',
                key: 'status',
                width: 120,
                align: 'center',
                render: (_, complex: SportComplex) =>
                    selectedComplexIds.includes(complex.id) ? (
                        <Tag color="green" icon={<CheckOutlined />}>
                            Назначен
                        </Tag>
                    ) : (
                        <Tag color="default" icon={<CloseOutlined />}>
                            Не назначен
                        </Tag>
                    )
            }
        ],
        [filteredComplexes, selectedComplexIds, handleSelectAll, handleComplexToggle, token]
    )

    // Мемоизированная конфигурация пагинации
    const paginationConfig = useMemo(
        () => ({
            ...PAGINATION_CONFIG,
            current: currentPage,
            showTotal: (total: number, range: [number, number]) => {
                const isFiltered = searchQuery.trim().length > 0
                if (isFiltered) {
                    return `${range[0]}-${range[1]} из ${total} найденных (всего ${stats.total})`
                }
                return `${range[0]}-${range[1]} из ${total} спорткомплексов`
            },
            onChange: handlePageChange
        }),
        [currentPage, searchQuery, stats.total, handlePageChange]
    )

    // Мемоизированные данные для отображения назначений
    const assignmentsDisplay = useMemo(() => {
        if (!manager?.sportComplexes || manager.sportComplexes.length === 0) {
            return { visible: [], hidden: [], hiddenCount: 0 }
        }

        const visible = manager.sportComplexes.slice(0, 3)
        const hidden = manager.sportComplexes.slice(3)
        const hiddenCount = hidden.length

        return { visible, hidden, hiddenCount }
    }, [manager?.sportComplexes])

    // Компонент для отображения скрытых назначений в попапе
    const HiddenAssignmentsContent = useCallback(
        () => (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <div className="flex flex-col gap-2">
                    {assignmentsDisplay.hidden.map(complex => (
                        <div
                            key={complex.id}
                            className="flex items-center gap-2 p-2 rounded"
                            style={{ background: token.colorBgContainer }}
                        >
                            <Building2 size={16} style={{ color: token.colorPrimary }} />
                            <span style={{ fontSize: token.fontSizeSM }}>{complex.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        [assignmentsDisplay.hidden, token]
    )

    // Обработка состояния загрузки
    if (complexesLoading && !isInitialized) {
        return (
            <BaseModal
                visible={visible}
                onClose={handleClose}
                title="Спорткомплексы"
                subtitle="Загрузка..."
                icon={<Building2 size={16} />}
            >
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            </BaseModal>
        )
    }

    return (
        <BaseModal
            visible={visible}
            onClose={handleClose}
            title="Спорткомплексы"
            subtitle={`${manager?.firstName} ${manager?.lastName} • ${stats.selected} из ${stats.total} назначено`}
            icon={<Building2 size={16} />}
            actions={
                <Space>
                    <Input
                        placeholder="Поиск спорткомплексов..."
                        prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        allowClear
                        style={{
                            width: 300,
                            borderRadius: token.borderRadius
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleSave}
                        disabled={!isChanged}
                        loading={updateLoading}
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
            <div className="flex flex-col h-full">
                {/* Статистики - фиксированная высота */}
                <div className="shrink-0" style={{ marginBottom: token.marginLG }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatsCard
                            title="Всего спорткомплексов"
                            value={stats.total}
                            icon={<Building2 size={16} />}
                            color={token.colorPrimary}
                        />
                        <StatsCard
                            title="Назначено"
                            value={stats.selected}
                            icon={<CheckOutlined />}
                            color={token.colorSuccess}
                        />
                        <StatsCard
                            title="Не назначено"
                            value={stats.unselected}
                            icon={<CloseOutlined />}
                            color={token.colorError}
                        />
                    </div>
                </div>

                {/* Таблица - занимает все доступное пространство */}
                <div className="flex-1 min-h-0">
                    <DataTable
                        data={filteredComplexes}
                        columns={columns}
                        rowKey="id"
                        loading={complexesLoading}
                        pagination={paginationConfig}
                        locale={{
                            emptyText: searchQuery.trim() ? 'Спорткомплексы не найдены' : 'Нет спорткомплексов'
                        }}
                        scroll={{ y: 'calc(100vh - 400px)' }}
                    />
                </div>

                {/* Текущие назначения - фиксированная высота */}
                {manager?.sportComplexes && manager.sportComplexes.length > 0 && (
                    <div className="shrink-0" style={{ marginTop: token.marginLG }}>
                        <Text strong style={{ marginLeft: '8px' }}>
                            Текущие назначения
                        </Text>
                        <div className="mt-2 flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                {/* Видимые назначения */}
                                {assignmentsDisplay.visible.map(complex => (
                                    <Tag
                                        key={complex.id}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            height: 28,
                                            padding: '0 10px',
                                            fontSize: 13,
                                            borderRadius: 10,
                                            lineHeight: 1.2,
                                            marginBottom: token.marginXS,
                                            background: 'rgba(24, 144, 255, 0.08)',
                                            border: `1px solid ${token.colorPrimary}`,
                                            color: token.colorPrimary,
                                            fontWeight: 500,
                                            maxWidth: 'calc(33.333% - 8px)',
                                            minWidth: 0,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Building2 size={13} style={{ flexShrink: 0 }} />
                                        <Typography.Text
                                            ellipsis={{
                                                tooltip: complex.title
                                            }}
                                            style={{
                                                fontSize: 13,
                                                color: 'inherit',
                                                fontWeight: 'inherit',
                                                margin: 0,
                                                lineHeight: 1.2,
                                                flex: 1,
                                                minWidth: 0
                                            }}
                                        >
                                            {complex.title}
                                        </Typography.Text>
                                    </Tag>
                                ))}
                            </div>

                            <div className="flex-shrink-0">
                                {/* Аватар с счетчиком для скрытых назначений */}
                                {assignmentsDisplay.hiddenCount > 0 && (
                                    <Popover
                                        content={<HiddenAssignmentsContent />}
                                        title={`Ещё ${assignmentsDisplay.hiddenCount} назначений`}
                                        trigger="hover"
                                        placement="bottomRight"
                                        open={assignmentsPopoverVisible}
                                        onOpenChange={setAssignmentsPopoverVisible}
                                    >
                                        <div
                                            className="flex items-center gap-1 cursor-pointer rounded-full px-2 py-1 flex-shrink-0"
                                            style={{
                                                background: token.colorPrimaryBg,
                                                border: `1px solid ${token.colorPrimaryBorder}`,
                                                marginBottom: token.marginXS
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: token.fontSizeSM,
                                                    color: token.colorPrimary,
                                                    fontWeight: 500
                                                }}
                                            >
                                                +{assignmentsDisplay.hiddenCount}
                                            </span>
                                        </div>
                                    </Popover>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseModal>
    )
}
