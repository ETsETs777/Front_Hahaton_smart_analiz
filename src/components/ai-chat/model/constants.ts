/**
 * Константы для FloatingAiChat
 */

// Размеры чата для AI виджета
export const MIN_WIDTH = 320
export const MIN_HEIGHT = 400
export const MAX_WIDTH = 1100
export const MAX_HEIGHT = 900

export const INITIAL_SIZE = { width: 420, height: 600 }
export const BOUNDS = { 
  minWidth: MIN_WIDTH, 
  minHeight: MIN_HEIGHT, 
  maxWidth: MAX_WIDTH, 
  maxHeight: MAX_HEIGHT
}
export const BUTTON_SIZE = 72 // Размер FloatButton (72x72px увеличенный размер)
export const BUTTON_MARGIN = 24 // Отступ снизу для кнопки на десктопе
export const CHAT_MARGIN = 16 // Дополнительный отступ между чатом и кнопкой
export const BOTTOM_OFFSET = BUTTON_SIZE + BUTTON_MARGIN + CHAT_MARGIN // 72 + 24 + 16 = 112px

/**
 * Константы для позиционирования кнопки виджета
 */
export const BUTTON_OFFSET_DESKTOP = { right: 24, bottom: 24 }
export const BUTTON_OFFSET_MOBILE = { right: 16, bottom: 16 }

/**
 * Текстовые константы для AI чата
 */
export const MIN_INPUT_LENGTH = 1
export const TEXT_INTRO_PRIMARY = 'Привет!'
export const TEXT_INTRO_SECONDARY = 'Я ваш финансовый AI-ассистент. Задайте свой вопрос о финансах, и я помогу вам разобраться.'
export const TEXT_INTRO_THIRD = 'Чем могу помочь сегодня?'

