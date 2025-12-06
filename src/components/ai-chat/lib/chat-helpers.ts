import { type CSSProperties } from 'react'

/**
 * Создает палитру CSS переменных для темы чата
 */
export const createChatPalette = (token: {
  colorBgElevated: string
  colorFillSecondary: string
  colorBorder: string
  colorBorderSecondary: string
  boxShadowSecondary: string
  boxShadow: string
  colorText: string
  colorTextSecondary: string
  colorPrimary: string
  colorBgContainer: string
  colorBgLayout: string
  colorPrimaryBg: string
  colorPrimaryText?: string
  colorTextLightSolid?: string
  colorBgMask: string
  colorWhite: string
}): CSSProperties => {
  return {
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
    '--ai-chat-backdrop': token.colorBgMask,
    '--ai-send-button-icon': token.colorWhite,
  } as CSSProperties
}

/**
 * Форматирует время сообщения
 */
export const formatMessageTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Проверяет, является ли сообщение от пользователя
 */
export const isUserMessage = (messageRole: string, userEmail?: string, authorEmail?: string): boolean => {
  return messageRole === 'user' || (!!userEmail && !!authorEmail && authorEmail === userEmail)
}

