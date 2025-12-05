import { Toolbar } from '@/components/layout'
import { useSynchronizeMutation } from '@/graphql/generated'
import { SyncOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Space, Spin, Typography } from 'antd'
import { App } from 'antd'
import { useState } from 'react'

const { Title, Text } = Typography

export function SynchronizationPage() {
    const { message } = App.useApp()
    const [synchronize, { loading }] = useSynchronizeMutation()
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

    const handleSynchronize = async () => {
        try {
            const result = await synchronize()

            if (result.errors && result.errors.length > 0) {
                const errorMessages = result.errors.map(err => err.message).join('; ')
                console.error('GraphQL ошибки:', result.errors)

                message.error({
                    content: (
                        <div>
                            <div className="font-semibold">Ошибка синхронизации:</div>
                            <div className="text-sm mt-1">{errorMessages}</div>
                            <div className="text-xs mt-2 text-gray-500">Обратитесь к системному администратору</div>
                        </div>
                    ),
                    duration: 5
                })
                return
            }

            if (result.data?.synchronize) {
                message.success('Синхронизация прошла успешно')
                setLastSyncTime(new Date().toLocaleString('ru-RU'))
                console.log('Результат синхронизации:', result.data.synchronize)
            } else {
                message.warning('Синхронизация завершена, но данных нет')
            }
        } catch (error: any) {
            console.error('Ошибка синхронизации:', error)

            let errorMessage = 'Не удалось синхронизировать данные'

            if (error.networkError) {
                errorMessage = 'Нет связи с сервером. Проверьте интернет'
            } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                errorMessage = error.graphQLErrors.map((err: any) => err.message).join('; ')
            } else if (error.message) {
                errorMessage = error.message
            }

            message.error({
                content: (
                    <div>
                        <div className="font-semibold">Критическая ошибка:</div>
                        <div className="text-sm mt-1">{errorMessage}</div>
                        <div className="text-xs mt-2 text-gray-500">Попробуйте повторить операцию позже</div>
                    </div>
                ),
                duration: 10
            })
        }
    }

    return (
        <>
            <Toolbar
                title={'Синхронизация'}
                description={'Синхронизация данных из внешних систем (1С) в базу данных платформы'}
                className="shrink-0"
            />
            <div className="flex flex-col gap-8 px-8 pt-2 flex-1 justify-center items-center">
                <Space direction="vertical" size="large" className="w-full items-center justify-center py-8">
                    <div className="text-center flex flex-col gap-4">
                        {lastSyncTime && (
                            <Alert
                                message={`Последняя синхронизация: ${lastSyncTime}`}
                                type="success"
                                showIcon
                                className="mb-4"
                            />
                        )}

                        <Button
                            type="primary"
                            size="large"
                            icon={loading ? <Spin size="small" /> : <SyncOutlined />}
                            loading={loading}
                            onClick={handleSynchronize}
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600 px-8 m-5 py-2 h-auto"
                            disabled={loading}
                        >
                            {loading ? 'Выполняется синхронизация...' : 'Запустить синхронизацию'}
                        </Button>

                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Операция может занять от 30 секунд до нескольких минут
                        </div>
                    </div>
                </Space>
            </div>
        </>
    )
}
