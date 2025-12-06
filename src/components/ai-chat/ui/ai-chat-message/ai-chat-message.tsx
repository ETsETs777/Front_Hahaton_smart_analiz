import { memo } from 'react'
import { Typography, Alert } from 'antd'
import ReactMarkdown from 'react-markdown'
import type { ChatMessage, FormFieldReference } from '../../types'
import { FieldSuggests } from '../field-suggests'
import { MessageSources } from '../message-sources'
import styles from './ai-chat-message.module.scss'

const { Text } = Typography

interface AiChatMessageProps {
  message: ChatMessage
  isUser: boolean
  isStreaming?: boolean
  shouldAnimate?: boolean
  onSelectField?: (field: FormFieldReference) => void
}


const TypingIndicator = () => (
  <div className={styles.typingIndicator}>
    <span className={styles.dot} style={{ animationDelay: '0ms' }} />
    <span className={styles.dot} style={{ animationDelay: '160ms' }} />
    <span className={styles.dot} style={{ animationDelay: '320ms' }} />
  </div>
)

export const AiChatMessage = memo<AiChatMessageProps>(({ message, isUser, isStreaming = false, shouldAnimate = false, onSelectField }) => {
  const hasError = message.status === 'failed' && message.error
  const isPending = message.status === 'pending'
  const isProcessing = message.status === 'processing'
  const isStreamingNow = message.status === 'streaming' || isStreaming
  const needsFieldSelection = message.status === 'needs_fields_selection'
  const hasSelectedFields = message.selectedFields && message.selectedFields.length > 0
  const isWelcome = message.type === 'WELCOME'
  const isCompleted = message.status === 'completed'
  
  const showTypingIndicator = !isUser && (isPending || isProcessing || isStreamingNow)
  const showContent = isUser || isCompleted || needsFieldSelection

  return (
    <div
      className={`${styles.messageWrapper} ${isUser ? styles.userMessage : styles.assistantMessage} ${shouldAnimate ? styles.animate : ''}`}
    >
      <div className={styles.messageContainer}>
        {/* Контент сообщения */}
        <div className={styles.messageContent}>
          {hasError ? (
            <Alert
              message="Ошибка"
              description={message.error}
              type="error"
              showIcon
              className={styles.errorAlert}
            />
          ) : (
            <div className={`${styles.messageBubble} ${isUser ? styles.user : styles.assistant}`}>
              {showTypingIndicator ? (
                <TypingIndicator />
              ) : showContent ? (
                <div className={styles.messageText}>
                  {isUser ? (
                    <Text>{message.content}</Text>
                  ) : (
                    <div className={styles.markdownContent}>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
                          code: ({ inline, children, ...props }: any) =>
                            inline ? (
                              <code className={styles.inlineCode} {...props}>{children}</code>
                            ) : (
                              <pre className={styles.codeBlock}>
                                <code {...props}>{children}</code>
                              </pre>
                            ),
                          ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
                          ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
                          li: ({ children }) => <li className={styles.listItem}>{children}</li>,
                          strong: ({ children }) => <strong className={styles.bold}>{children}</strong>,
                          em: ({ children }) => <em className={styles.italic}>{children}</em>,
                          a: ({ children, href }) => (
                            <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          h1: ({ children }) => <h1 className={styles.heading1}>{children}</h1>,
                          h2: ({ children }) => <h2 className={styles.heading2}>{children}</h2>,
                          h3: ({ children }) => <h3 className={styles.heading3}>{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Саджесты полей для выбора */}
          {needsFieldSelection && message.proposedFields && onSelectField && (
            <FieldSuggests 
              proposedFields={message.proposedFields} 
              onSelectField={onSelectField}
            />
          )}

          {/* Метаданные */}
          {!isPending && !isStreamingNow && (
            <div className={styles.messageMetadata}>
              <Text type="secondary" className={styles.timestamp}>
                {new Date(message.createdAt).toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
              {/* Иконка источников информации */}
              {!isUser && hasSelectedFields && !isWelcome && (
                <MessageSources selectedFields={message.selectedFields!} />
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
})

AiChatMessage.displayName = 'AiChatMessage'
