import { theme, Typography } from 'antd'

const { Title, Text } = Typography

// Компонент для заголовка модального окна
export const ModalHeader = ({
    icon,
    title,
    subtitle,
    actions
}: {
    icon: React.ReactNode
    title: string
    subtitle?: string
    actions?: React.ReactNode
}) => {
    const { token } = theme.useToken()
    return (
        <div
            className="shrink-0"
            style={{
                padding: `${token.paddingSM}px ${token.paddingLG}px`,
                borderBottom: `1px solid ${token.colorBorder}`,
                background: token.colorBgElevated,
                borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                            padding: token.paddingXS,
                            borderRadius: token.borderRadiusLG,
                            background: token.colorPrimaryBg,
                            color: token.colorPrimary
                        }}
                    >
                        {icon}
                    </div>
                    <div>
                        <Title level={5} style={{ margin: 0, color: token.colorText }}>
                            {title}
                        </Title>
                        {subtitle && (
                            <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}>
                                {subtitle}
                            </Text>
                        )}
                    </div>
                </div>
                {actions && (
                    <div
                        className="flex items-center space-x-2"
                        style={{ minWidth: 0, paddingRight: token.paddingLG * 2 }}
                    >
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
