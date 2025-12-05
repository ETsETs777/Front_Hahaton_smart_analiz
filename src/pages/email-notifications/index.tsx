import { useGetEmailNotificationSettingsQuery } from '@/graphql/generated'
import { useSEO } from '@/hooks/use-seo'
import { Tabs, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Toolbar } from '@/components/layout'
import { EmailNotificationTypeEnum } from '@/graphql/generated'
import { EmailNotificationsTable } from './email-notifications-table'
import { useState } from 'react'

const TITLE = 'Настройка Email уведомлений'

const getTypeLabel = (type: EmailNotificationTypeEnum) => {
    switch (type) {
        case EmailNotificationTypeEnum.SlotUnavailableError:
            return 'Уведомление о недоступности слотов'
        default:
            return type
    }
}

export default function EmailNotificationsPage() {
    const [activeTab, setActiveTab] = useState<EmailNotificationTypeEnum>(
        EmailNotificationTypeEnum.SlotUnavailableError
    )
    const [isCreating, setIsCreating] = useState(false)

    useSEO({
        title: TITLE,
        description: 'Управление настройками email уведомлений.',
        keywords: 'email, уведомления, настройки',
        noindex: true,
        url: `${window.location.origin}/email-notifications`
    })

    const { data, loading, refetch } = useGetEmailNotificationSettingsQuery({
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
    })

    const handleRefresh = () => {
        refetch()
    }

    const handleCreateComplete = () => {
        setIsCreating(false)
        refetch()
    }

    const settings = data?.emailNotificationSettings_Get || []

    const tabItems = Object.values(EmailNotificationTypeEnum).map(type => {
        const typeSettings = settings.filter(setting => setting.type === type)

        return {
            key: type,
            label: (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span>{getTypeLabel(type)}</span>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full min-w-[20px] h-5">
                            {typeSettings.length}
                        </span>
                    </div>
                    <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={e => {
                            e.stopPropagation()
                            setActiveTab(type)
                            setIsCreating(true)
                        }}
                        size="small"
                        className="ml-2 hover:bg-emerald-50 hover:text-emerald-600"
                    />
                </div>
            ),
            children: (
                <EmailNotificationsTable
                    data={typeSettings}
                    loading={loading}
                    onRefresh={handleRefresh}
                    notificationType={type}
                    isCreating={isCreating && activeTab === type}
                    onCreateComplete={handleCreateComplete}
                    onCancelCreate={() => setIsCreating(false)}
                />
            )
        }
    })

    return (
        <div className="flex flex-col flex-1">
            <Toolbar title={TITLE} className="shrink-0" />

            <div className="flex-1 flex flex-col px-4 mt-4">
                <Tabs
                    activeKey={activeTab}
                    onChange={key => setActiveTab(key as EmailNotificationTypeEnum)}
                    items={tabItems}
                    className="flex-1"
                />
            </div>
        </div>
    )
}
