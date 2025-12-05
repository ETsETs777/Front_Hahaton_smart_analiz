import { Modal, theme } from 'antd'
import type { ReactNode } from 'react'
import { ModalHeader } from './ModalHeader'

interface BaseModalProps {
    visible: boolean
    onClose: () => void
    title: string
    subtitle: string
    icon: ReactNode
    actions?: ReactNode
    children: ReactNode
    compact?: boolean
    modalWidth?: number | string
    footerActions?: ReactNode
}

export function BaseModal({ visible, onClose, title, subtitle, icon, actions, children, compact = false, modalWidth, footerActions }: BaseModalProps) {
    const { token } = theme.useToken()

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={modalWidth ?? (compact ? 560 : '100%')}
            centered={compact}
            className={compact ? '' : '!max-w-5xl !h-full'}
            style={{
                top: compact ? undefined : 0
            }}
            classNames={{
                wrapper: compact ? '' : '!top-2 lg:!top-[6%] '
            }}
            styles={{
                body: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: compact ? undefined : 1,
                    height: compact ? 'auto' : '100%',
                    overflow: compact ? 'visible' : 'hidden'
                },
                content: {
                    padding: 0,
                    borderRadius: token.borderRadiusLG,
                    background: token.colorBgElevated,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: compact ? 'auto' : 'calc(80vh)'
                }
            }}
        >
            <ModalHeader icon={icon} title={title} subtitle={subtitle} actions={actions} />

            <div
                className="flex-1 h-full flex flex-col overflow-auto"
                style={{ padding: token.paddingMD, height: compact ? 'auto' : '100%', background: token.colorBgContainer }}
            >
                {children}
            </div>

            {footerActions && (
                <div
                    className="shrink-0 flex justify-end"
                    style={{
                        borderTop: `1px solid ${token.colorBorder}`,
                        padding: `${token.paddingSM}px ${token.paddingMD}px`,
                        background: token.colorBgElevated
                    }}
                >
                    {footerActions}
                </div>
            )}
        </Modal>
    )
}
