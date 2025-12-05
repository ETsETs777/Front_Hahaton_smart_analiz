import { HomeOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { App, Button, Card, Layout, Typography, theme } from 'antd'
import { useNavigate } from 'react-router'

import { useSEO } from '@/hooks/use-seo'

const { Content } = Layout
const { Title, Text } = Typography

export default function NotFoundPage() {
    const { message } = App.useApp()
    const navigate = useNavigate()

    useSEO({
        title: 'Страница не найдена',
        description: 'Запрашиваемая страница не существует.',
        keywords: '404, страница не найдена, ошибка',
        noindex: true,
        url: `${window.location.origin}/404`
    })

    const handleGoHome = () => {
        navigate('/')
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout style={{ background: theme.useToken().token.colorBgLayout }}>
                <Content className="flex-1 flex flex-col items-center justify-center">
                    <Card className="w-full max-w-md shadow-md">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md flex items-center justify-center mx-auto mb-4">
                                <QuestionCircleOutlined className="!text-white !text-2xl" />
                            </div>
                            <Title level={2}>404</Title>
                            <Title level={4} className="!mt-2">Страница не найдена</Title>
                            <Text type="secondary" className="text-sm">
                                Упс! Похоже, что страница, которую ты ищешь, не существует или была перемещена.
                            </Text>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button 
                                type="primary" 
                                icon={<HomeOutlined />} 
                                onClick={handleGoHome}
                                size="large"
                            >
                                На главную
                            </Button>
                            
                            <Button 
                                onClick={handleGoBack}
                                size="large"
                            >
                                Назад
                            </Button>
                        </div>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    )
} 