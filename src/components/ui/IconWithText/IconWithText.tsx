import { Typography, theme } from 'antd'

const { Text } = Typography

interface IconWithTextProps {
    icon: React.ReactNode
    title: string
    subtitle?: string
    iconBackground?: string
    iconColor?: string
    titleColor?: string
    subtitleColor?: string
}

export function IconWithText({ 
    icon, 
    title, 
    subtitle,
    iconBackground,
    iconColor,
    titleColor,
    subtitleColor
}: IconWithTextProps) {
    const { token } = theme.useToken()
    
    return (
        <div className="flex items-center space-x-3">
            <div style={{ 
                padding: token.paddingXS,
                borderRadius: token.borderRadiusLG,
                background: iconBackground || token.colorInfoBg,
                color: iconColor || token.colorInfo
            }}>
                {icon}
            </div>
            <div>
                <Text strong style={{ color: titleColor || token.colorText }}>
                    {title}
                </Text>
                {subtitle && (
                    <>
                        <br />
                        <Text style={{ 
                            color: subtitleColor || token.colorTextSecondary, 
                            fontSize: token.fontSizeSM 
                        }}>
                            {subtitle}
                        </Text>
                    </>
                )}
            </div>
        </div>
    )
} 