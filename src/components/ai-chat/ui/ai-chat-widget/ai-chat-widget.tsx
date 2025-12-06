import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { FloatButton, theme } from 'antd'
import { useLocation } from 'react-router'
import { useAuth } from '@/contexts/auth-context'
import { Logo } from '@/components/common/Logo'
import { BUTTON_OFFSET_DESKTOP, BUTTON_OFFSET_MOBILE } from '../../model/constants'
import { FloatingAiChat } from '../floating-ai-chat'
import styles from './ai-chat-widget.module.scss'

export const AiChatWidget: React.FC = () => {
  const { user } = useAuth()
  const { token } = theme.useToken()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const buttonStyle = useMemo<CSSProperties>(
    () => ({
      ...(isMobile ? BUTTON_OFFSET_MOBILE : BUTTON_OFFSET_DESKTOP),
      background: '#ffffff',
      color: token.colorPrimary,
    }),
    [isMobile, token.colorPrimary]
  )

  const rootStyle = useMemo<CSSProperties>(
    () => ({
      '--ai-chat-backdrop': token.colorBgMask,
      '--ai-chat-trigger-shadow': token.boxShadowSecondary,
      '--ai-chat-accent': token.colorPrimary,
      '--ai-chat-surface': token.colorBgElevated,
      '--ai-chat-surface-alt': token.colorFillSecondary,
      '--ai-chat-border': token.colorBorder,
      '--ai-chat-border-soft': token.colorBorderSecondary,
      '--ai-chat-text': token.colorText,
      '--ai-chat-muted': token.colorTextSecondary,
    } as CSSProperties),
    [token]
  )

  if (!user) {
    return null
  }

  const handleClose = () => setIsOpen(false)

  return (
    <>
      <FloatButton
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`}
        icon={<Logo size={36} />}
        tooltip="AI-ассистент"
        onClick={() => setIsOpen(prev => !prev)}
        style={buttonStyle}
      />

      {isOpen && (
        <div
          className={styles.widgetRoot}
          style={rootStyle}
        >
          <FloatingAiChat onClose={handleClose} />
        </div>
      )}
    </>
  )
}

