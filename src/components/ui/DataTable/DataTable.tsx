import type { TableProps } from 'antd'
import { Table, theme } from 'antd'
import { useRef, useMemo } from 'react'
import styles from './DataTable.module.scss'
import { useAutoPageSize } from './useAutoPageSize'

// Кастомный locale для пагинации (убираем дублирование)
const CUSTOM_PAGINATION_LOCALE = {
    jump_to: 'Страница',
    jump_to_confirm: 'OK',
    page: '',
    prev_page: 'Предыдущая страница',
    next_page: 'Следующая страница',
    prev_5: 'Предыдущие 5 страниц',
    next_5: 'Следующие 5 страниц',
    prev_3: 'Предыдущие 3 страницы',
    next_3: 'Следующие 3 страницы',
} as const

// Универсальные пропсы для таблицы
interface DataTableProps<T = any> extends Omit<TableProps<T>, 'dataSource'> {
    data: T[]
    loading?: boolean
    className?: string
    autoPageSize?: boolean
    minPageSize?: number
    maxPageSize?: number
    defaultRowHeight?: number
    onPageSizeChange?: (newPageSize: number) => void
}

// Универсальный компонент таблицы с компактным минималистичным стилем
export function DataTable<T = any>({ 
    data, 
    loading = false, 
    className = '', 
    autoPageSize = true,
    minPageSize = 5,
    maxPageSize = 50,
    defaultRowHeight = 48,
    onPageSizeChange,
    pagination,
    locale,
    style,
    ...tableProps 
}: DataTableProps<T>) {
    const { token } = theme.useToken()
    const containerRef = useRef<HTMLDivElement>(null)
    
    // Настройка автоматического размера страницы
    const autoPage = useAutoPageSize({ 
        minPageSize, 
        maxPageSize,
        defaultRowHeight,
        onPageSizeChange
    })
    
    // Определяем размер страницы
    const pageSize = useMemo(() => {
        if (pagination && typeof pagination === 'object' && typeof pagination.pageSize === 'number') {
            return pagination.pageSize
        }
        return autoPageSize ? autoPage.pageSize : undefined
    }, [pagination, autoPageSize, autoPage.pageSize])
    
    // Конфигурация пагинации
    const paginationConfig = useMemo(() => {
        if (pagination === false) return false
        
        const basePagination = {
            showSizeChanger: false,
            showQuickJumper: true, // Включаем переход на страницу
            showTotal: (total: number, range: [number, number]) => 
                `${range[0]}-${range[1]} из ${total}`,
            size: 'small' as const,
            ...(typeof pagination === 'object' ? pagination : {})
        }
        
        if (pageSize) {
            basePagination.pageSize = pageSize
        }
        
        return basePagination
    }, [pagination, pageSize])
    
    // Объединяем локализацию
    const mergedLocale = useMemo(() => ({
        ...CUSTOM_PAGINATION_LOCALE,
        ...locale
    }), [locale])
    
    // CSS переменные для темизации
    const cssVariables = useMemo(() => ({
        '--table-bg': token.colorBgContainer,
        '--table-header-bg': token.colorBgElevated,
        '--table-header-text': token.colorTextSecondary,
        '--table-row-bg': token.colorBgContainer,
        '--table-row-hover': token.colorBgElevated,
        '--table-border': token.colorBgElevated,
        '--table-footer-bg': token.colorBgElevated,
        '--table-footer-text': token.colorText,
        '--table-pagination-bg': token.colorBgElevated,
        '--table-pagination-text': token.colorText,
        '--table-pagination-active-bg': token.colorPrimaryBg,
        '--table-pagination-active-text': token.colorPrimary,
        '--table-footer-border-width': pagination === false ? '2px' : '4px',
        ...style
    }), [token, pagination, style])
    
    const containerStyle = useMemo(() => ({
        height: '100%',
        minHeight: 400
    }), [])
    
    return (
        <div 
            ref={autoPageSize ? autoPage.containerRef : containerRef} 
            style={containerStyle}
        >
            <Table
                {...tableProps}
                dataSource={data}
                loading={loading}
                pagination={paginationConfig}
                scroll={{ x: 'max-content', y: '100%' }}
                size="small"
                className={`!rounded h-full ${styles.dataTable} ${className}`}
                style={cssVariables as React.CSSProperties}
                locale={mergedLocale}
            />
        </div>
    )
}

export default DataTable