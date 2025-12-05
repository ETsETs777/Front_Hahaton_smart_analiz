import { useEffect, useRef, useState, useCallback } from 'react'

interface UseAutoPageSizeOptions {
  minPageSize?: number
  maxPageSize?: number
  defaultRowHeight?: number
  tableBodySelector?: string
  tableRowSelector?: string
  debounceMs?: number
  onPageSizeChange?: (newPageSize: number) => void
}

/**
 * Хук для автоматического расчёта pageSize таблицы по реальной высоте области строк
 * @param options опции конфигурации
 * @returns {containerRef, pageSize, recalculate}
 */
export function useAutoPageSize(options: UseAutoPageSizeOptions = {}) {
  const {
    minPageSize = 5,
    maxPageSize = 50,
    defaultRowHeight = 48,
    tableBodySelector = '.ant-table-body',
    tableRowSelector = '.ant-table-row',
    debounceMs = 100,
    onPageSizeChange
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const [pageSize, setPageSize] = useState(minPageSize)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)

  // Функция для расчёта размера страницы
  const calculatePageSize = useCallback(() => {
    if (!containerRef.current) return minPageSize

    const tableBody = containerRef.current.querySelector(tableBodySelector) as HTMLElement | null
    if (!tableBody) return minPageSize

    // Получаем высоту области для строк
    const bodyHeight = tableBody.offsetHeight
    if (bodyHeight <= 0) return minPageSize

    // Ищем первую видимую строку для получения реальной высоты
    const firstRow = tableBody.querySelector(tableRowSelector) as HTMLElement | null
    let rowHeight = defaultRowHeight

    if (firstRow) {
      const rect = firstRow.getBoundingClientRect()
      rowHeight = rect.height > 0 ? rect.height : defaultRowHeight
    }

    // Рассчитываем количество строк с учётом ограничений
    const calculatedRows = Math.floor(bodyHeight / rowHeight)
    const clampedRows = Math.max(minPageSize, Math.min(maxPageSize, calculatedRows))

    return clampedRows
  }, [minPageSize, maxPageSize, defaultRowHeight, tableBodySelector, tableRowSelector])

  // Дебаунсированная функция обновления
  const updatePageSize = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const newPageSize = calculatePageSize()
      
      setPageSize(current => {
        if (current !== newPageSize) {
          onPageSizeChange?.(newPageSize)
          return newPageSize
        }
        return current
      })
    }, debounceMs)
  }, [calculatePageSize, debounceMs, onPageSizeChange])

  // Функция для принудительного пересчёта (может быть полезна для внешнего вызова)
  const recalculate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    const newPageSize = calculatePageSize()
    setPageSize(current => {
      if (current !== newPageSize) {
        onPageSizeChange?.(newPageSize)
        return newPageSize
      }
      return current
    })
  }, [calculatePageSize, onPageSizeChange])

  useEffect(() => {
    // Начальный расчёт с небольшой задержкой для рендеринга DOM
    const initialTimeout = setTimeout(updatePageSize, 50)

    // Слушатель изменения размера окна
    window.addEventListener('resize', updatePageSize)

    // ResizeObserver для контейнера
    if (containerRef.current && 'ResizeObserver' in window) {
      observerRef.current = new ResizeObserver(updatePageSize)
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      clearTimeout(initialTimeout)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      window.removeEventListener('resize', updatePageSize)
      
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [updatePageSize])

  // Обновление при изменении параметров
  useEffect(() => {
    updatePageSize()
  }, [minPageSize, maxPageSize, defaultRowHeight, tableBodySelector, tableRowSelector, updatePageSize])

  return { 
    containerRef, 
    pageSize, 
    recalculate 
  }
}