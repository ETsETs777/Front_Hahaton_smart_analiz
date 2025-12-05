import { Button, Typography, Card, Space, Divider, Tag, theme } from 'antd'
import { RotateCcw, AlertTriangle, Bug } from 'lucide-react'
import type { ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'

const { Title, Paragraph, Text } = Typography

interface Props {
    children: ReactNode
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    const { token } = theme.useToken()

    const handleRetry = () => {
        resetErrorBoundary()
    }

    const handleReload = () => {
        window.location.reload()
    }

    const handleCopyError = async () => {
        try {
            await navigator.clipboard.writeText(error.stack || error.message)
        } catch (err) {
            console.error('Не удалось скопировать в буфер обмена:', err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: token.colorBgBase }}>
            <Card
                className="max-w-2xl w-full shadow-2xl border-0"
                style={{
                    borderRadius: '16px'
                }}
            >
                <div className="text-center flex flex-col gap-6">
                    {/* Иконка и заголовок */}
                    <div className="flex flex-col gap-4">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                            style={{ backgroundColor: token.colorErrorBg }}
                        >
                            <AlertTriangle className="w-8 h-8" style={{ color: token.colorError }} />
                        </div>

                        <div>
                            <Title level={2} className="!mb-2" style={{ color: token.colorError }}>
                                Что-то пошло не так
                            </Title>
                            <Text type="secondary" className="text-base">
                                Приложение столкнулось с неожиданной ошибкой
                            </Text>
                        </div>
                    </div>

                    {/* Информация об ошибке */}
                    <Card
                        size="small"
                        className="text-left"
                        style={{
                            borderRadius: '12px',
                            backgroundColor: token.colorErrorBg,
                            borderColor: token.colorErrorBorder
                        }}
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Bug className="w-4 h-4" style={{ color: token.colorError }} />
                                <Text strong style={{ color: token.colorError }}>
                                    Сообщение об ошибке:
                                </Text>
                            </div>
                            <Paragraph
                                className="!mb-0 font-mono text-sm p-3 rounded-lg"
                                style={{
                                    wordBreak: 'break-word',
                                    backgroundColor: token.colorBgContainer,
                                    border: `1px solid ${token.colorErrorBorder}`
                                }}
                            >
                                {error.message}
                            </Paragraph>
                        </div>
                    </Card>

                    {/* Детали ошибки в режиме разработки */}
                    {process.env.NODE_ENV === 'development' && (
                        <Card
                            size="small"
                            className="text-left"
                            style={{
                                borderRadius: '12px',
                                backgroundColor: token.colorBgLayout,
                                borderColor: token.colorBorderSecondary
                            }}
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bug className="w-4 h-4" style={{ color: token.colorTextSecondary }} />
                                        <Text strong style={{ color: token.colorText }}>
                                            Стек вызовов:
                                        </Text>
                                        <Tag color="orange" className="text-xs">
                                            dev mode
                                        </Tag>
                                    </div>
                                    <Button
                                        type="text"
                                        size="small"
                                        onClick={handleCopyError}
                                        className="flex items-center gap-1"
                                    >
                                        Копировать
                                    </Button>
                                </div>

                                <div
                                    className="p-3 rounded-lg max-h-48 overflow-auto"
                                    style={{
                                        fontFamily:
                                            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                        backgroundColor: token.colorBgContainer,
                                        border: `1px solid ${token.colorBorderSecondary}`
                                    }}
                                >
                                    <pre
                                        className="text-xs whitespace-pre-wrap !mb-0"
                                        style={{ color: token.colorTextSecondary }}
                                    >
                                        {error.stack}
                                    </pre>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Divider className="!my-6" />

                    {/* Кнопки действий */}
                    <Space size="middle" className="w-full flex justify-center">
                        <Button
                            type="primary"
                            size="large"
                            icon={<RotateCcw className="w-4 h-4" />}
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-6 h-10"
                        >
                            Попробовать снова
                        </Button>

                        <Button size="large" onClick={handleReload} className="flex items-center gap-2 px-6 h-10">
                            Перезагрузить страницу
                        </Button>
                    </Space>

                    {/* Дополнительная информация */}
                    <div className="pt-4 border-t" style={{ borderColor: token.colorBorderSecondary }}>
                        <Text type="secondary" className="text-sm">
                            Если проблема повторится, пожалуйста, обратитесь в службу поддержки
                        </Text>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export function ErrorBoundary({ children }: Props) {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Сбрасываем состояние ошибки
                console.log('Сброс состояния ошибки')

                // Можно добавить дополнительную логику очистки состояния
                // например, очистка localStorage, сброс глобального состояния и т.д.
            }}
            onError={(error, errorInfo) => {
                // Расширенное логирование ошибки
                console.group('🚨 Error Boundary')
                console.error('Ошибка:', error)
                console.error('Компонент:', errorInfo.componentStack)
                console.error('Стек вызовов:', error.stack)
                console.groupEnd()

                // Здесь можно добавить отправку ошибки в систему мониторинга
                // Пример структуры данных для отправки:
                const errorData = {
                    message: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    userId: undefined // получить из контекста авторизации
                }

                // Отправка в систему мониторинга (например, Sentry)
                // sendErrorToMonitoring(errorData)
            }}
        >
            {children}
        </ReactErrorBoundary>
    )
}
