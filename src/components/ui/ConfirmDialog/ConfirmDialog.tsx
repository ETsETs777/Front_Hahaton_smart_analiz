import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { ModalProps } from 'antd'

interface ConfirmDialogProps extends Omit<ModalProps, 'onOk'> {
  title?: string
  content: string
  onConfirm: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export const ConfirmDialog = ({
  title = 'Подтверждение',
  content,
  onConfirm,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  danger = false,
  ...modalProps
}: ConfirmDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      modalProps.onCancel?.()
    } catch (error) {
      console.error('Ошибка при подтверждении:', error)
    }
  }

  return (
    <Modal
      {...modalProps}
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: danger ? '#ff4d4f' : '#1890ff', marginRight: 8 }} />
          {title}
        </span>
      }
      onOk={handleConfirm}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{ danger }}
    >
      <p>{content}</p>
    </Modal>
  )
}

