import { useState, useCallback, useEffect, useRef } from 'react'
import { useSendMessageMutation, useGetMessageStatusLazyQuery } from '@/graphql/generated'
import type { ChatMessage, ChatParticipant } from '../types'

interface UseSimpleAiChatOptions {
  currentUser?: ChatParticipant
  initialMessages?: ChatMessage[]
  onConversationChange?: (data: { messages: ChatMessage[] }) => void
}

export function useSimpleAiChat({
  currentUser,
  initialMessages = [],
  onConversationChange,
}: UseSimpleAiChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sendMessageMutation] = useSendMessageMutation()
  const [getMessageStatus] = useGetMessageStatusLazyQuery()
  const pollingIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      status: 'completed',
      createdAt: new Date().toISOString(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    onConversationChange?.({ messages: newMessages })

    setIsProcessing(true)

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      content: '',
      role: 'assistant',
      status: 'processing',
      createdAt: new Date().toISOString(),
    }

    const messagesWithPending = [...newMessages, assistantMessage]
    setMessages(messagesWithPending)
    onConversationChange?.({ messages: messagesWithPending })

    try {
      const result = await sendMessageMutation({
        variables: {
          input: {
            message: content,
          },
        },
      })

      if (result.data?.sendMessage) {
        const statusMap: Record<string, ChatMessage['status']> = {
          'COMPLETED': 'completed',
          'PROCESSING': 'processing',
          'PENDING': 'pending',
          'FAILED': 'failed',
        }
        
        const messageId = result.data.sendMessage.id
        const serverStatus = result.data.sendMessage.status
        
        const updatedAssistant: ChatMessage = {
          id: messageId,
          content: result.data.sendMessage.aiResponse || '',
          role: 'assistant',
          status: statusMap[serverStatus] || 'failed',
          createdAt: result.data.sendMessage.createdAt,
          error: result.data.sendMessage.error || undefined,
        }

        const finalMessages = [...newMessages, updatedAssistant]
        setMessages(finalMessages)
        onConversationChange?.({ messages: finalMessages })

        if (serverStatus === 'PENDING' || serverStatus === 'PROCESSING') {
          setIsProcessing(true)
          startPolling(messageId)
        } else if (serverStatus === 'COMPLETED' || serverStatus === 'FAILED') {
          setIsProcessing(false)
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        ...assistantMessage,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Произошла ошибка',
      }
      const finalMessages = [...newMessages, errorMessage]
      setMessages(finalMessages)
      onConversationChange?.({ messages: finalMessages })
      setIsProcessing(false)
    }
  }, [messages, sendMessageMutation, onConversationChange])

  const reset = useCallback(() => {
    setMessages([])
    onConversationChange?.({ messages: [] })
  }, [onConversationChange])

  const startPolling = useCallback((messageId: string) => {
    if (pollingIntervalsRef.current.has(messageId)) {
      return
    }

    const stopPolling = () => {
      const interval = pollingIntervalsRef.current.get(messageId)
      if (interval) {
        clearInterval(interval)
        pollingIntervalsRef.current.delete(messageId)
      }
    }

    const poll = async () => {
      try {
        const result = await getMessageStatus({
          variables: { messageId },
          fetchPolicy: 'network-only',
        })

        if (result.data?.getMessageStatus) {
          const statusMap: Record<string, ChatMessage['status']> = {
            'COMPLETED': 'completed',
            'PROCESSING': 'processing',
            'PENDING': 'pending',
            'FAILED': 'failed',
          }

          const serverStatus = result.data.getMessageStatus.status
          const mappedStatus = statusMap[serverStatus] || 'failed'

          setMessages(prev => {
            const updated = prev.map(msg => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  status: mappedStatus,
                  content: result.data.getMessageStatus.aiResponse || msg.content,
                  error: result.data.getMessageStatus.error || undefined,
                }
              }
              return msg
            })
            onConversationChange?.({ messages: updated })
            return updated
          })

          if (serverStatus === 'COMPLETED' || serverStatus === 'FAILED') {
            stopPolling()
            setIsProcessing(false)
          } else {
            setIsProcessing(true)
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке статуса сообщения:', error)
        stopPolling()
        setIsProcessing(false)
      }
    }

    poll()
    const interval = setInterval(poll, 2000)
    pollingIntervalsRef.current.set(messageId, interval)

    setTimeout(() => {
      stopPolling()
      setIsProcessing(false)
    }, 60000)
  }, [getMessageStatus, onConversationChange])

  useEffect(() => {
    return () => {
      pollingIntervalsRef.current.forEach(interval => clearInterval(interval))
      pollingIntervalsRef.current.clear()
    }
  }, [])

  const refineMessage = useCallback(async (sessionId: string, fields: any[]) => {
    console.log('refineMessage', sessionId, fields)
  }, [])

  return {
    messages,
    isProcessing,
    isStreaming: false,
    sendMessage,
    refineMessage,
    reset,
  }
}

