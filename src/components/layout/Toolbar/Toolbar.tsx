import React from 'react'
import { theme, Typography } from 'antd'

interface ToolbarProps {
  /** Заголовок тулбара */
  title: React.ReactNode
  /** Описание под заголовком */
  description?: React.ReactNode
  /** Элементы справа (кнопки, фильтры и т.д.) */
  actions?: React.ReactNode
  /** Префикс (например, стрелка назад) */
  prefix?: React.ReactNode
  /** Дополнительные элементы (например, фильтры, поиск) */
  children?: React.ReactNode
  /** Класс для дополнительной стилизации */
  className?: string
}

/**
 * Компактный тулбар для страниц с минималистичным дизайном
 */
export const Toolbar: React.FC<ToolbarProps> = ({ title, description, actions, children, className, prefix }) => {
  const { token } = theme.useToken()
  
  return (
    <div
      className={`w-full flex flex-col gap-1 px-6 py-3 justify-center ${className || ''}`}
      style={{ 
        minHeight: 65,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
          {prefix && <div className="text-lg">{prefix}</div>}
          <Typography.Title 
            level={3}
            className="!mb-0 font-semibold tracking-tight" 
            style={{ color: token.colorText }}
          >
            {title}
          </Typography.Title>
          </div>
          {description && (
            <div 
              className="text-sm mt-0.5" 
              style={{ color: token.colorTextSecondary }}
            >
              {description}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      {children && <div className="flex items-center gap-2 mt-1">{children}</div>}
    </div>
  )
}

export default Toolbar 