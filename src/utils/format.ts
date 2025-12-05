/**
 * Форматирует число в денежный формат
 */
export const formatCurrency = (value: number, currency: string = '₽'): string => {
  return `${value.toLocaleString('ru-RU')} ${currency}`
}

/**
 * Форматирует число с разделителями тысяч
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ru-RU')
}

/**
 * Форматирует процент
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Форматирует дату в короткий формат (DD.MM.YYYY)
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Форматирует дату и время
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Форматирует относительное время (например, "2 дня назад")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} дня назад`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} недели назад`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} месяца назад`
  return `${Math.floor(diffDays / 365)} года назад`
}

