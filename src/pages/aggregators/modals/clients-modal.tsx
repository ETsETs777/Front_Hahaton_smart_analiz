import { DataTable } from '@/components/ui'
import type { GetAllAggregatorsQuery } from '@/graphql/generated'
import { PhoneOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons'
import { Input, theme } from 'antd'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { BaseModal } from './components'
import { DateDisplay, IconBadge } from '@/components/ui'

// Типы

// Типы пропсов
interface ClientsModalProps {
    visible: boolean
    aggregator: GetAllAggregatorsQuery['aggregator_GetAll'][0] | null
    onClose: () => void
}

export function ClientsModal({ visible, aggregator, onClose }: ClientsModalProps) {
    const { token } = theme.useToken()
    const [searchQuery, setSearchQuery] = useState('')

    const handleClose = () => {
        setSearchQuery('')
        onClose()
    }

    const filteredClients = useMemo(() => {
        if (!aggregator?.clients || !searchQuery.trim()) {
            return aggregator?.clients || []
        }
        const query = searchQuery.toLowerCase().trim()
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
    }, [aggregator?.clients, searchQuery])

    const columns: ColumnsType<NonNullable<GetAllAggregatorsQuery['aggregator_GetAll'][0]['clients']>[0]> = [
        {
            title: 'ФИО',
            key: 'fio',
            render: (_, record) => {
                const { firstName, lastName, patronymic } = record.client
                const fio = [lastName, firstName, patronymic].filter(Boolean).join(' ') || '—'
                return (
                    <div className="flex items-center gap-3">
                        <IconBadge icon={<TeamOutlined />} color={token.colorPrimary} />
                        <div style={{ color: token.colorText }}>{fio}</div>
                    </div>
                )
            }
        },
        {
            title: 'Телефон',
            dataIndex: ['client', 'phone'],
            key: 'phone',
            render: (phone: string | undefined) => (
                <div className="flex items-center gap-3">
                    <div style={{ color: token.colorText }}>{phone || '—'}</div>
                </div>
            )
        },
        {
            title: 'СНИЛС',
            dataIndex: ['client', 'snils'],
            key: 'snils',
            render: (snils: string | undefined) => <span>{snils || '—'}</span>
        },
        {
            title: 'Дата рождения',
            width: 150,
            dataIndex: ['client', 'birthdate'],
            key: 'birthdate',
            render: (date: string | undefined) => (
                <span>{date ? dayjs(date).format('DD.MM.YYYY') : '—'}</span>
            )
        },
        {
            title: 'Дата привязки',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 260,
            render: (date: string) => (
                <DateDisplay date={date} showTime={true} iconColor={token.colorPrimary} />
            )
        }
    ]

    return (
        <BaseModal
            visible={visible}
            onClose={handleClose}
            title="Клиенты"
            subtitle={`${aggregator?.name || 'Агрегатор'} • ${filteredClients.length} клиентов`}
            icon={<TeamOutlined />}
            actions={
                <Input
                    placeholder="Телефон, СНИЛС, ФИО или дата рождения"
                    prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    allowClear
                    style={{
                        width: 300,
                        borderRadius: token.borderRadius
                    }}
                />
            }
        >
            <DataTable
                data={filteredClients}
                columns={columns}
                rowKey={record => record.client.id}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total: number, range: [number, number]) => {
                        const totalClients = aggregator?.clients?.length || 0
                        const isFiltered = searchQuery.trim().length > 0
                        if (isFiltered) {
                            return `${range[0]}-${range[1]} из ${total} найденных (всего ${totalClients})`
                        }
                        return `${range[0]}-${range[1]} из ${total} клиентов`
                    }
                }}
                locale={{
                    emptyText: searchQuery.trim() ? 'Клиенты не найдены' : 'Нет клиентов'
                }}
            />
        </BaseModal>
    )
}
