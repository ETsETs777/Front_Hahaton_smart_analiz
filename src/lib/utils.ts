import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Утилита для объединения Tailwind CSS классов
 * Используется для комбинирования условных классов и разрешения конфликтов
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Theme = 'light' | 'dark' 