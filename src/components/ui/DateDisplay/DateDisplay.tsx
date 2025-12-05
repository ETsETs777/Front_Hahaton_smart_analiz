import { Typography, theme } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

const { Text } = Typography

interface DateDisplayProps {
    date: string | null
    showTime?: boolean
    fallbackText?: string
    iconColor?: string
}

export function DateDisplay({ date, showTime = false, fallbackText = 'Неизвестно', iconColor }: DateDisplayProps) {
    const { token } = theme.useToken()

    const formatDate = (dateString: string) => {
        if (showTime) {
            return new Date(dateString).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
        return new Date(dateString).toLocaleDateString('ru-RU')
    }

    return (
        <div className="flex items-center space-x-2">
            <CalendarOutlined style={{ color: iconColor || token.colorPrimary }} />
            <Text style={{ color: token.colorTextSecondary }}>{date ? formatDate(date) : fallbackText}</Text>
        </div>
    )
}
