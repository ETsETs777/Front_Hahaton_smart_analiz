import { useCallback, useMemo, useRef } from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button, theme } from 'antd'
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useSimpleAiChat } from '../../hooks/useSimpleAiChat'
import { aiChatSessionVar, updateDraft, resetSession, updateMessages } from '../../model/session'
import { useChatResize } from '../../hooks/useChatResize'
import { INITIAL_SIZE, BOUNDS, BOTTOM_OFFSET } from '../../model/constants'
import { AiChatPanel } from '../ai-chat-panel'
import { ResizeHandles } from './ResizeHandles'
import type { ChatMessage, FormFieldReference } from '../../types'
import styles from './floating-ai-chat.module.scss'

interface FloatingAiChatProps {
  onClose: () => void
}

export const FloatingAiChat: React.FC<FloatingAiChatProps> = ({ onClose }) => {
  const { user } = useAuth()
  const { token } = theme.useToken()
  const headerRef = useRef<HTMLDivElement | null>(null)

  const session = useReactiveVar(aiChatSessionVar)

  const handleConversationChange = useCallback(({ messages: nextMessages }: { messages: ChatMessage[] }) => {
    updateMessages(nextMessages)
  }, [])

  const { messages, isProcessing, isStreaming, sendMessage, refineMessage, reset } = useSimpleAiChat({
    currentUser: user ? { id: user.id, email: user.email || '', displayName: user.email || user.name || '' } : undefined,
    initialMessages: session.messages,
    onConversationChange: handleConversationChange,
  })

  const { position, size, isResizing, startDrag, startResize } = useChatResize({
    initialSize: INITIAL_SIZE,
    bounds: BOUNDS,
    bottomOffset: BOTTOM_OFFSET,
  })

  const palette = useMemo(() => ({
    '--ai-chat-surface': token.colorBgElevated,
    '--ai-chat-surface-alt': token.colorFillSecondary,
    '--ai-chat-border': token.colorBorder,
    '--ai-chat-border-soft': token.colorBorderSecondary,
    '--ai-chat-shadow': token.boxShadowSecondary,
    '--ai-chat-shadow-strong': token.boxShadow,
    '--ai-chat-text': token.colorText,
    '--ai-chat-muted': token.colorTextSecondary,
    '--ai-chat-accent': token.colorPrimary,
    '--ai-chat-header-bg': token.colorBgContainer,
    '--ai-chat-header-border': token.colorBorderSecondary,
    '--ai-chat-body-bg': token.colorBgLayout,
    '--ai-chat-avatar-bg': token.colorPrimaryBg,
    '--ai-chat-avatar-color': token.colorPrimaryText ?? token.colorPrimary ?? token.colorTextLightSolid ?? '#fff',
  }), [token])

  const handleSend = useCallback(async (message: string) => {
    await sendMessage(message)
  }, [sendMessage])

  const handleDraftChange = useCallback((value: string) => {
    updateDraft(value)
  }, [])

  const handleReset = useCallback(() => {
    reset()
    resetSession()
  }, [reset])

  const handleSelectField = useCallback(async (field: FormFieldReference) => {
    // Находим последнее сообщение со статусом needs_fields_selection, чтобы получить taskId
    const lastMessageWithSelection = messages
      .slice()
      .reverse()
      .find(msg => msg.status === 'needs_fields_selection')
    
    if (!lastMessageWithSelection?.sessionId) {
      console.error('No taskId found for field selection')
      return
    }

    // Вызываем метод уточнения с taskId и выбранным полем
    await refineMessage(lastMessageWithSelection.sessionId, [field])
  }, [messages, refineMessage])

  return (
    <div
      className={styles.container}
      style={{
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y,
        ...palette,
      }}
    >
      {/* Шапка */}
      <div ref={headerRef} className={styles.header} onMouseDown={startDrag}>
        <Button type="text" size="small" icon={<X size={16} />} onClick={onClose} />
      </div>

      {/* Интерфейс чата */}
      <AiChatPanel
        messages={messages}
        currentUser={
          user
            ? { id: user.id, email: user.email || '', displayName: user.email || user.name || '' }
            : undefined
        }
        onSend={handleSend}
        onReset={handleReset}
        allowReset={true}
        isProcessing={isProcessing}
        isStreaming={isStreaming}
        draft={session.draft}
        onDraftChange={handleDraftChange}
        chatHeight={size.height - 40}
        withCard={false}
        onSelectField={handleSelectField}
      />

      <ResizeHandles onResize={startResize} isResizing={isResizing} />
    </div>
  )
}

