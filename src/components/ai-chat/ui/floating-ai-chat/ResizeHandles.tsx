import { useMemo } from 'react'
import styles from './floating-ai-chat.module.scss'

interface ResizeHandlesProps {
  onResize: (e: React.MouseEvent) => void
  isResizing: boolean
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResize, isResizing }) => {
  return (
    <>
      <div
        className={`${styles.resizeHandle} ${styles.resizeHandleBottomRight}`}
        onMouseDown={onResize}
        style={{ cursor: isResizing ? 'nwse-resize' : 'nwse-resize' }}
      />
    </>
  )
}

