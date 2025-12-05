import { Toolbar } from '@/components/layout'
import { useGetAllManagersQuery } from '@/graphql/generated'
import { useSEO } from '@/hooks/use-seo'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { useState } from 'react'
import { ManagersTable } from './managers-table'

const { Title } = Typography

export default function ManagersPage() {
    const [isCreatingManager, setIsCreatingManager] = useState(false)

    useSEO({
        title: 'Менеджеры',
        description: 'Управление менеджерами системы бронирования.',
        keywords: 'менеджеры, управление, бронирование',
        noindex: true,
        url: `${window.location.origin}/managers`
    })

    const { data, loading, refetch } = useGetAllManagersQuery({
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
    })

    const handleRefresh = () => {
        refetch()
    }

    const startCreateManager = () => {
        setIsCreatingManager(true)
    }

    const handleCreateComplete = () => {
        setIsCreatingManager(false)
        refetch()
    }

    return (
        <>
            <Toolbar
                title="Менеджеры"
                actions={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={startCreateManager}
                        disabled={isCreatingManager}
                        className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                    >
                        Добавить менеджера
                    </Button>
                }
                className="shrink-0"
            />
            <div className="flex-1 flex flex-col px-4 mt-4">
                <ManagersTable
                    data={data?.user_GetAllManagers || []}
                    loading={loading}
                    onRefresh={handleRefresh}
                    isCreating={isCreatingManager}
                    onCreateComplete={handleCreateComplete}
                    onCancelCreate={() => setIsCreatingManager(false)}
                />
            </div>
        </>
    )
}
