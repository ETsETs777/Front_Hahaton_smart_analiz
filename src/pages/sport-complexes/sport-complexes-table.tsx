import { DataTable } from '@/components/ui'
import type { GetAllSportComplexesForAdminQuery } from '@/graphql/generated'
import type { ColumnsType } from 'antd/es/table'
import { Building2, Pencil } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Tooltip } from 'antd'
import { SportComplexEditModal } from './modals/sport-complex-edit-modal'

type SportComplex = GetAllSportComplexesForAdminQuery['sportComplexes_Get'][0]

interface SportComplexesTableProps {
    data: SportComplex[]
    loading?: boolean
    onRefresh?: () => void
    searchQuery?: string
}

export function SportComplexesTable({ data, loading, onRefresh, searchQuery = '' }: SportComplexesTableProps) {
    const navigate = useNavigate()
    const [editModal, setEditModal] = useState<{ visible: boolean; sportComplex: SportComplex | null }>({
        visible: false,
        sportComplex: null
    })

    const filteredSportComplexes = useMemo(() => {
        if (!searchQuery.trim()) {
            return data
        }

        const query = searchQuery.toLowerCase().trim()

        return data.filter(sportComplex => {
            const title = sportComplex.title.toLowerCase()
            const iasEgip = (sportComplex.iasEgipRegistryNumber || '').toLowerCase()
            return title.includes(query) || iasEgip.includes(query)
        })
    }, [data, searchQuery])

    const handleRowClick = (sportComplex: SportComplex) => {
        navigate(`/sport-complexes/${sportComplex.id}`)
    }

    const columns: ColumnsType<SportComplex> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: (title: string) => (
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-blue-500" />
                    <span className="font-medium">{title}</span>
                </div>
            )
        },
        {
            title: 'ИАС ЕГИП номер',
            dataIndex: 'iasEgipRegistryNumber',
            key: 'iasEgipRegistryNumber',
            width: 180,
            render: (val: string | null) => <span>{val || '—'}</span>
        },
        {
            title: 'Действие',
            key: 'action',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Tooltip title="Редактировать">
                    <Button
                        type="text"
                        size="small"
                        onClick={e => {
                            e.stopPropagation()
                            setEditModal({ visible: true, sportComplex: record })
                        }}
                        icon={<Pencil size={16} />}
                    />
                </Tooltip>
            )
        }
    ]

    return (
        <>
            <DataTable
                data={filteredSportComplexes}
                loading={loading}
                columns={columns}
                rowKey="id"
                className="shadow-sm"
                onRow={record => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' }
                })}
                locale={{
                    emptyText: searchQuery.trim() ? 'Спорткомплексы не найдены' : 'Нет спорткомплексов'
                }}
            />
            <SportComplexEditModal
                visible={editModal.visible}
                sportComplex={editModal.sportComplex}
                onClose={() => setEditModal({ visible: false, sportComplex: null })}
                onUpdated={onRefresh}
            />
        </>
    )
}
