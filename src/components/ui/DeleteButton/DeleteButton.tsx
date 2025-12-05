import { Button, Popconfirm, Tooltip, theme } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

interface DeleteButtonProps {
    onDelete: () => void
    title?: string
    description?: string
    tooltipTitle?: string
}

export function DeleteButton({ 
    onDelete, 
    title = "Удалить?", 
    description = "Это действие нельзя отменить",
    tooltipTitle = "Удалить"
}: DeleteButtonProps) {
    const { token } = theme.useToken()
    
    return (
        <Popconfirm
            title={title}
            description={description}
            onConfirm={onDelete}
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
        >
            <Tooltip title={tooltipTitle}>
                <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    size="small"
                    style={{ borderRadius: token.borderRadius }}
                />
            </Tooltip>
        </Popconfirm>
    )
} 