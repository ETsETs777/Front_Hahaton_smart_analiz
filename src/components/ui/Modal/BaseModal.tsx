import { Modal, ModalProps } from 'antd'
import { ReactNode } from 'react'
import './BaseModal.scss'

interface BaseModalProps extends Omit<ModalProps, 'children'> {
  children: ReactNode
  footer?: ReactNode | null
  showFooter?: boolean
}

export const BaseModal = ({
  children,
  footer,
  showFooter = true,
  className = '',
  ...modalProps
}: BaseModalProps) => {
  return (
    <Modal
      {...modalProps}
      className={`base-modal ${className}`}
      footer={showFooter ? (footer !== undefined ? footer : undefined) : null}
    >
      {children}
    </Modal>
  )
}

