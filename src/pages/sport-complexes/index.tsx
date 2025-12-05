import { useGetAllSportComplexesForAdminQuery } from '@/graphql/generated'
import { useSEO } from '@/hooks/use-seo'
import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useState } from 'react'
import { SportComplexesTable } from './sport-complexes-table'
import { Toolbar } from '@/components/layout'

const TITLE = 'Спорткомплексы'

export default function SportComplexesPage() {
    const [searchQuery, setSearchQuery] = useState('')

    useSEO({
        title: TITLE,
        description: 'Управление спортивными комплексами системы бронирования.',
        keywords: 'спорткомплексы, управление, бронирование',
        noindex: true,
        url: `${window.location.origin}/sport-complexes`
    })

    const { data, loading, refetch } = useGetAllSportComplexesForAdminQuery({
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
    })

    const handleRefresh = () => {
        refetch()
    }

    return (
        <div className="flex flex-col flex-1">
            <Toolbar
                title={TITLE}
                actions={
                    <Input
                        placeholder="Поиск"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        allowClear
                        size="middle"
                        className="max-w-sm"
                    />
                }
                className="shrink-0"
            />

            <div className="flex-1 flex flex-col px-4 mt-4">
                <SportComplexesTable
                    data={data?.sportComplexes_Get || []}
                    loading={loading}
                    onRefresh={handleRefresh}
                    searchQuery={searchQuery}
                />
            </div>
        </div>
    )
}
