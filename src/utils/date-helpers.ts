export const getStartOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export const getEndOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export const getStartOfMonth = (date: Date = new Date()): Date => {
  const d = new Date(date)
  d.setDate(1)
  return getStartOfDay(d)
}

export const getEndOfMonth = (date: Date = new Date()): Date => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1, 0)
  return getEndOfDay(d)
}

export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}

