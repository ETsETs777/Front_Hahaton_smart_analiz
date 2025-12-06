import { useEffect, useRef, useState } from 'react'
import { Empty, Spin } from 'antd'
import type { ChatMessage, FormFieldReference } from '../../types'
import { AiChatMessage } from '../ai-chat-message'
import styles from './ai-chat-messages.module.scss'

interface AiChatMessagesProps {
  messages: ChatMessage[]
  currentUserEmail?: string
  loading?: boolean
  isStreaming?: boolean
  onSelectField?: (field: FormFieldReference) => void
}

export const AiChatMessages: React.FC<AiChatMessagesProps> = ({
  messages,
  currentUserEmail,
  loading = false,
  isStreaming = false,
  onSelectField,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevMessagesLengthRef = useRef(messages.length)
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set())

  // Отслеживаем новые сообщения для анимации только их
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      // Добавляем только последнее новое сообщение
      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        setNewMessageIds(prev => {
          const updated = new Set(prev)
          updated.add(lastMessage.id)
          return updated
        })
        
        // Убираем ID из списка новых через короткое время
        const timeoutId = setTimeout(() => {
          setNewMessageIds(prev => {
            const updated = new Set(prev)
            updated.delete(lastMessage.id)
            return updated
          })
        }, 500)
        
        return () => clearTimeout(timeoutId)
      }
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages])

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages.length, isStreaming])

  // Автоскролл при изменении статусов сообщений (ошибки, pending, streaming, needs_fields_selection)
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      // Скроллим при появлении статусов pending (думает), failed (ошибка), streaming или needs_fields_selection
      if (
        lastMessage?.status === 'pending' || 
        lastMessage?.status === 'failed' || 
        lastMessage?.status === 'streaming' ||
        lastMessage?.status === 'needs_fields_selection'
      ) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }
  }, [messages])

  if (loading && messages.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large">
          <div className={styles.loadingText}>Загрузка сообщений...</div>
        </Spin>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Empty 
          description="Начните диалог с AI-ассистентом"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={styles.messagesContainer}>
      {messages.map((message, index) => {
        const isUser = message.role === 'user'
        const isLastMessage = index === messages.length - 1
        const isStreamingThis = isStreaming && isLastMessage && !isUser
        const shouldAnimate = newMessageIds.has(message.id)

        return (
          <AiChatMessage
            key={message.id}
            message={message}
            isUser={isUser}
            isStreaming={isStreamingThis}
            shouldAnimate={shouldAnimate}
            onSelectField={onSelectField}
          />
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

