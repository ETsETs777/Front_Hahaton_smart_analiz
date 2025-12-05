import {
    useCreateEmailNotificationSettingMutation,
    useDeleteEmailNotificationSettingsMutation,
    EmailNotificationTypeEnum
} from '@/graphql/generated'
import { DataTable, DeleteButton } from '@/components/ui'
import { Button, Input, Typography, message } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useState } from 'react'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

interface EmailNotificationSetting {
    id: string
    type: EmailNotificationTypeEnum
    email: string
    createdAt: string
}

interface EmailNotificationsTableProps {
    data: EmailNotificationSetting[]
    loading: boolean
    onRefresh: () => void
    notificationType: EmailNotificationTypeEnum
    isCreating?: boolean
    onCreateComplete?: () => void
    onCancelCreate?: () => void
}

const CREATING_ID = 'creating'

export function EmailNotificationsTable({
    data,
    loading,
    onRefresh,
    notificationType,
    isCreating: externalIsCreating = false,
    onCreateComplete,
    onCancelCreate
}: EmailNotificationsTableProps) {
    const [internalIsCreating, setInternalIsCreating] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [emailError, setEmailError] = useState(false)

    const isCreating = externalIsCreating || internalIsCreating

    const [createSetting] = useCreateEmailNotificationSettingMutation({
        onCompleted: () => {
            message.success('Настройка успешно создана')
            setInternalIsCreating(false)
            setNewEmail('')
            setEmailError(false)
            onCreateComplete?.()
            onRefresh()
        },
        onError: error => {
            message.error(error.message)
        }
    })

    const [deleteSettings] = useDeleteEmailNotificationSettingsMutation({
        onCompleted: () => {
            message.success('Настройка успешно удалена')
            onRefresh()
        },
        onError: error => {
            message.error(error.message)
        }
    })

    const handleCreate = async () => {
        if (!newEmail.trim()) {
            setEmailError(true)
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(newEmail)) {
            setEmailError(true)
            return
        }

        await createSetting({
            variables: {
                type: notificationType,
                email: newEmail.trim()
            }
        })
    }

    const handleDelete = async (ids: string[]) => {
        await deleteSettings({
            variables: {
                ids
            }
        })
    }

    const handleCreateKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCreate()
        } else if (e.key === 'Escape') {
            setInternalIsCreating(false)
            setNewEmail('')
            setEmailError(false)
            onCancelCreate?.()
        }
    }

    const cancelCreate = () => {
        setInternalIsCreating(false)
        setNewEmail('')
        setEmailError(false)
        onCancelCreate?.()
    }

    const startCreate = () => {
        setInternalIsCreating(true)
        setNewEmail('')
        setEmailError(false)
    }

    const renderInputCell = (
        value: string,
        onChange: (value: string) => void,
        placeholder: string,
        hasError: boolean,
        onKeyDown?: (e: React.KeyboardEvent) => void
    ) => (
        <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            size="small"
            className="!rounded-md !py-1 !px-2 !text-sm w-full"
            status={hasError ? 'error' : ''}
            variant="filled"
        />
    )

    const newSettingRow = {
        id: CREATING_ID,
        type: notificationType,
        email: newEmail,
        createdAt: ''
    }

    const tableData = isCreating ? [newSettingRow, ...data] : data

    const columns: ColumnsType<EmailNotificationSetting | typeof newSettingRow> = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 300,
            render: (email: string, record: any) => {
                if (record.id === CREATING_ID) {
                    return (
                        <div className="flex items-center gap-2 w-full">
                            <div className="flex-1 min-w-0">
                                {renderInputCell(
                                    newEmail,
                                    setNewEmail,
                                    'example@domain.com',
                                    emailError,
                                    handleCreateKeyPress
                                )}
                            </div>
                            <Button
                                type="text"
                                size="small"
                                icon={<CheckOutlined />}
                                onClick={handleCreate}
                                className="text-green-600 flex-shrink-0"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={cancelCreate}
                                className="text-red-600 flex-shrink-0"
                            />
                        </div>
                    )
                }
                return <Text style={{ fontFamily: 'monospace' }}>{email}</Text>
            }
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string, record: any) => {
                if (record.id === CREATING_ID) {
                    return <Text type="secondary">-</Text>
                }
                return <Text type="secondary">{dayjs(createdAt).format('DD.MM.YYYY HH:mm')}</Text>
            }
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: any) => {
                if (record.id === CREATING_ID) {
                    return null
                }
                return (
                    <DeleteButton
                        onDelete={() => handleDelete([record.id])}
                        title="Удалить настройку"
                        description="Вы уверены, что хотите удалить эту настройку?"
                    />
                )
            }
        }
    ]

    return (
        <DataTable
            columns={columns}
            data={tableData}
            loading={loading}
            rowKey="id"
            pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} записей`
            }}
            scroll={{ x: 600 }}
        />
    )
}
