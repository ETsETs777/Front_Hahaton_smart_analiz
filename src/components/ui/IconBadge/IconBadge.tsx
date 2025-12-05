import { theme } from 'antd'

interface IconBadgeProps {
    icon: React.ReactNode
    color: string
    size?: 'small' | 'medium' | 'large'
    className?: string
}

export function IconBadge({ icon, color, size = 'medium', className = '' }: IconBadgeProps) {
    const { token } = theme.useToken()
    
    const sizeMap = {
        small: token.paddingXS,
        medium: token.paddingSM,
        large: token.paddingMD
    }
    
    return (
        <div 
            className={`shrink-0 flex items-center justify-center ${className}`}
            style={{ 
                padding: sizeMap[size],
                borderRadius: token.borderRadiusLG,
                background: `${color}15`,
                color: color
            }}
        >
            {icon}
        </div>
    )
} 