import { useAuth } from '@/contexts/auth-context'
import { Card, Avatar, Typography, Space, Tag } from 'antd'
import { User, Mail, Calendar, Shield } from 'lucide-react'
import dayjs from 'dayjs'

const { Title, Text } = Typography

export default function ProfilePage() {
    const { user } = useAuth()

    if (!user) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center">
                <Text type="secondary">Загрузка профиля...</Text>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 p-6">
            <Title level={2} style={{ marginBottom: '2rem' }}>
                Профиль
            </Title>

            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={64}
                            src={user.imageUrl}
                            icon={<User />}
                            style={{ backgroundColor: '#3b82f6' }}
                        />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>
                                {user.name || 'Пользователь'}
                            </Title>
                            <Text type="secondary">{user.email}</Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <Text strong>Email:</Text>
                            <Text>{user.email}</Text>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <Text strong>Дата регистрации:</Text>
                            <Text>{dayjs(user.createdAt).format('DD.MM.YYYY')}</Text>
                        </div>

                        <div className="flex items-center gap-2">
                            <Shield size={16} />
                            <Text strong>Статус:</Text>
                            <Tag color={user.isActive ? 'green' : 'red'}>
                                {user.isActive ? 'Активен' : 'Неактивен'}
                            </Tag>
                        </div>

                        <div className="flex items-center gap-2">
                            <Shield size={16} />
                            <Text strong>Email подтвержден:</Text>
                            <Tag color={user.isEmailConfirmed ? 'green' : 'orange'}>
                                {user.isEmailConfirmed ? 'Да' : 'Нет'}
                            </Tag>
                        </div>
                    </div>
                </Space>
            </Card>
        </div>
    )
}
