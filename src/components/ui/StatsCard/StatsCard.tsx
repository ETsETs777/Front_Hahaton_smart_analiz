import { Card, Typography, theme } from 'antd'
import { IconBadge } from '../IconBadge'

const { Text } = Typography

interface StatsCardProps {
    title: string
    value: number
    icon: React.ReactNode
    color: string
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
    const { token } = theme.useToken()
    
    return (
        <Card size="small" style={{ 
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorBorder}`,
            background: token.colorBgElevated
        }}>
            <div className="flex items-center justify-between">
                <div>
                    <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}>
                        {title}
                    </Text>
                    <div style={{ 
                        fontSize: token.fontSizeXL, 
                        fontWeight: token.fontWeightStrong,
                        color: token.colorText
                    }}>
                        {value}
                    </div>
                </div>
                <IconBadge icon={icon} color={color} />
            </div>
        </Card>
    )
} 