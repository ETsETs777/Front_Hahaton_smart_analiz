import { Button, Popconfirm, ButtonProps } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ReactNode, useState } from 'react'

interface ConfirmButtonProps extends ButtonProps {
  onConfirm: () => void | Promise<void>
  confirmTitle?: string
  confirmDescription?: string
  children: ReactNode
  danger?: boolean
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
}

export const ConfirmButton = ({
  onConfirm,
  confirmTitle = 'Подтвердите действие',
  confirmDescription,
  children,
  danger = false,
  okButtonProps,
  cancelButtonProps,
  ...buttonProps
}: ConfirmButtonProps) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()
    } catch (error) {
      console.error('Ошибка при подтверждении действия:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popconfirm
      title={confirmTitle}
      description={confirmDescription}
      icon={<ExclamationCircleOutlined style={{ color: danger ? 'red' : undefined }} />}
      onConfirm={handleConfirm}
      okText="Да"
      cancelText="Нет"
      okButtonProps={{ loading, danger, ...okButtonProps }}
      cancelButtonProps={cancelButtonProps}
    >
      <Button {...buttonProps} danger={danger} loading={loading}>
        {children}
      </Button>
    </Popconfirm>
  )
}

