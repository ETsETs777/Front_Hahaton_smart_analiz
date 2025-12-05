import { useGetAllAggregatorsQuery } from '@/graphql/generated'
import { useSEO } from '@/hooks/use-seo'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Layout, Typography } from 'antd'
import { useState } from 'react'
import { AggregatorsTable } from './aggregators-table'
import { Toolbar } from '@/components/layout'

const TITLE = 'Агрегаторы'

export default function AggregatorsPage() {
    const [isCreatingAggregator, setIsCreatingAggregator] = useState(false)

    useSEO({
        title: TITLE,
        description: 'Управление агрегаторами системы бронирования.',
        keywords: 'агрегаторы, управление, бронирование',
        noindex: true,
        url: `${window.location.origin}/aggregators`
    })

    const { data, loading, refetch } = useGetAllAggregatorsQuery({
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
    })

    const handleRefresh = () => {
        refetch()
    }

    const startCreateAggregator = () => {
        setIsCreatingAggregator(true)
    }

    const handleCreateComplete = () => {
        setIsCreatingAggregator(false)
        refetch()
    }

    return (
        <div className="flex flex-col flex-1">
            <Toolbar
                title={TITLE}
                actions={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={startCreateAggregator}
                        disabled={isCreatingAggregator}
                        className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 w-full sm:w-auto"
                    >
                        Добавить агрегатора
                    </Button>
                }
                className="shrink-0"
            />

            <div className="flex-1 flex flex-col px-4 mt-4">
                <AggregatorsTable
                    data={data?.aggregator_GetAll || []}
                    loading={loading}
                    onRefresh={handleRefresh}
                    isCreating={isCreatingAggregator}
                    onCreateComplete={handleCreateComplete}
                    onCancelCreate={() => setIsCreatingAggregator(false)}
                />
            </div>
        </div>
    )
}
