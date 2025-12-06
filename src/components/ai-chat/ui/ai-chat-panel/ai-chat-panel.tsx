import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEventHandler } from 'react'
import { Button, Card, Input, Spin, Typography, theme } from 'antd'
import { SendHorizonal } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { ChatMessage, ChatParticipant, FormFieldReference } from '../../types'

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
import { MIN_INPUT_LENGTH, TEXT_INTRO_PRIMARY, TEXT_INTRO_SECONDARY, TEXT_INTRO_THIRD } from '../../model/constants'
import { AiChatMessages } from '../ai-chat-messages'
import styles from './ai-chat-panel.module.scss'

const { Text } = Typography
const { TextArea } = Input

interface AiChatPanelProps {
  messages: ChatMessage[]
  onSend: (message: string) => Promise<void> | void
  onReset?: () => void
  currentUser?: ChatParticipant
  draft?: string
  onDraftChange?: (next: string) => void
  className?: string
  chatHeight?: number
  withCard?: boolean
  allowReset?: boolean
  isProcessing?: boolean
  isStreaming?: boolean
  onSelectField?: (field: FormFieldReference) => void
}

export const AiChatPanel: React.FC<AiChatPanelProps> = ({
  messages,
  onSend,
  onReset,
  currentUser,
  draft = '',
  onDraftChange,
  className,
  chatHeight,
  withCard = false,
  allowReset = true,
  isProcessing = false,
  isStreaming = false,
  onSelectField,
}) => {
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const [localDraft, setLocalDraft] = useState(draft)

  useEffect(() => {
    setLocalDraft(draft)
  }, [draft])

  const currentDraft = onDraftChange ? draft : localDraft

  const handleDraftChange = (value: string) => {
    if (!onDraftChange) {
      setLocalDraft(value)
    }
    onDraftChange?.(value)
  }

  const palette = useMemo<CSSProperties>(
    () =>
      ({
        '--ai-chat-surface': token.colorBgElevated,
        '--ai-chat-surface-alt': token.colorFillSecondary,
        '--ai-chat-border': token.colorBorder,
        '--ai-chat-border-soft': token.colorBorderSecondary,
        '--ai-chat-shadow': token.boxShadowSecondary,
        '--ai-chat-text': token.colorText,
        '--ai-chat-muted': token.colorTextSecondary,
        '--ai-chat-accent': token.colorPrimary,
        '--ai-send-button-icon': token.colorWhite,
      }) as CSSProperties,
    [token]
  )

  const hasMessages = messages.length > 0

  const handleSend = async () => {
    const trimmed = currentDraft.trim()
    if (!trimmed) return
    await onSend(trimmed)
    handleDraftChange('')
  }

  const handleInputKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const containerClassName = cn(styles.container, className)
  const containerStyle: CSSProperties = chatHeight ? { height: chatHeight, ...palette } : palette

  const inner = (
    <section className={containerClassName} style={containerStyle}>
      {/* Переписка */}
      <div className={styles.content}>
        {hasMessages ? (
          <AiChatMessages
            messages={messages}
            currentUserEmail={currentUser?.email}
            loading={isProcessing && messages.length === 0}
            isStreaming={isStreaming}
            onSelectField={onSelectField}
          />
        ) : (
          <div className={styles.intro}>
            <div className={styles.introIcon}>
              <img src="/logo.svg" alt="AI Assistant" className={styles.assistantGif} />
            </div>
            <div className={styles.introContent}>
              <Text className={styles.introPrimary}>{TEXT_INTRO_PRIMARY}</Text>
              <Text className={styles.introSecondary}>{TEXT_INTRO_SECONDARY}</Text>
              <Text className={styles.introSecondary}>{TEXT_INTRO_THIRD}</Text>
                <Button type="primary" onClick={() => navigate('/how-it-works')}>
                  Как это работает?
                </Button>
              </div>
            </div>
        )}
      </div>

      {/* Футер */}
      <footer className={styles.footer}>
        {isStreaming && (
          <div className={styles.statusRow}>
            <Spin size="small" />
            <Text type="secondary">Ассистент печатает ответ…</Text>
          </div>
        )}


        <div className={styles.composer}>
          <TextArea
            value={currentDraft}
            onChange={event => handleDraftChange(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Напишите сообщение…"
            disabled={isProcessing}
            autoSize={{ minRows: 1, maxRows: 4 }}
            variant="filled"
            className={styles.composerInput}
            style={{ resize: 'none' }}
          />
          <Button
            type="primary"
            shape="circle"
            size="large"
            className={styles.sendButton}
            icon={<SendHorizonal size={16} />}
            onClick={handleSend}
            disabled={currentDraft.trim().length < MIN_INPUT_LENGTH || isProcessing}
            loading={isProcessing && !hasMessages}
          />
        </div>

        {allowReset && onReset && hasMessages && (
          <Button type="text" className={styles.resetButton} onClick={onReset}>
            Начать новый диалог
          </Button>
        )}
      </footer>
    </section>
  )

  if (!withCard) {
    return inner
  }

  return (
    <Card
      variant="borderless"
      className={className}
      styles={{
        header: { display: 'none' },
        body: { padding: 0, height: '100%' },
      }}
    >
      {inner}
    </Card>
  )
}




