import { useState, useCallback, useRef, useEffect } from 'react'

interface UseChatResizeOptions {
  initialSize: { width: number; height: number }
  bounds: {
    minWidth: number
    minHeight: number
    maxWidth: number
    maxHeight: number
  }
  bottomOffset: number
}

export function useChatResize({ initialSize, bounds, bottomOffset }: UseChatResizeOptions) {
  const [position, setPosition] = useState({ x: window.innerWidth - initialSize.width - 24, y: window.innerHeight - initialSize.height - bottomOffset })
  const [size, setSize] = useState(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const resizeStartSize = useRef({ width: 0, height: 0 })
  const resizeStartPos = useRef({ x: 0, y: 0 })

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (isResizing) return
    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
  }, [position, isResizing])

  const startResize = useCallback((e: React.MouseEvent, direction: string) => {
    if (isDragging) return
    e.stopPropagation()
    setIsResizing(true)
    resizeStartSize.current = { ...size }
    resizeStartPos.current = { ...position }
  }, [size, position, isDragging])

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragStartPos.current.x, window.innerWidth - size.width))
        const newY = Math.max(0, Math.min(e.clientY - dragStartPos.current.y, window.innerHeight - size.height - bottomOffset))
        setPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, size, bottomOffset])

  return {
    position,
    size,
    isResizing,
    startDrag,
    startResize: (e: React.MouseEvent) => startResize(e, ''),
  }
}

