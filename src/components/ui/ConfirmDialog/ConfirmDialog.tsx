import { Modal, Button, ButtonProps } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ReactNode, useState } from 'react'

interface ConfirmDialogProps {
  title?: string
  content: ReactNode
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  confirmText?: string
  cancelText?: string
  confirmButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  danger?: boolean
  width?: number | string
}

export const ConfirmDialog = ({
  title = 'Подтвердите действие',
  content,
  onConfirm,
  onCancel,
  open: controlledOpen,
  onOpenChange,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  confirmButtonProps,
  cancelButtonProps,
  danger = false,
  width = 520,
}: ConfirmDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()
      handleOpenChange(false)
    } catch (error) {
      console.error('Ошибка при подтверждении:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    handleOpenChange(false)
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {danger && <ExclamationCircleOutlined style={{ color: 'red' }} />}
          <span>{title}</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      width={width}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button {...cancelButtonProps} onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            {...confirmButtonProps}
            type="primary"
            danger={danger}
            loading={loading}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      {content}
    </Modal>
  )
}

