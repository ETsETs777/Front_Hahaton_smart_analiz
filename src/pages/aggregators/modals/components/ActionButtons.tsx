import { Button, Space, theme } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

interface ActionButtonsProps {
    onSave: () => void
    onCancel: () => void
    saveDisabled?: boolean
}

export function ActionButtons({ onSave, onCancel, saveDisabled = false }: ActionButtonsProps) {
    const { token } = theme.useToken()
    
    return (
        <Space size="small">
            <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                onClick={onSave}
                disabled={saveDisabled}
                style={{ 
                    color: token.colorSuccess,
                    borderRadius: token.borderRadius
                }}
            />
            <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={onCancel}
                style={{ 
                    color: token.colorError,
                    borderRadius: token.borderRadius
                }}
            />
        </Space>
    )
} 