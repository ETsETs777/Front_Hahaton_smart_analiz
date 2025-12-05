import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ConfigProvider, theme } from 'antd'
import type { ThemeConfig } from 'antd'
import ruRU from 'antd/locale/ru_RU'

interface ThemeContextType {
    isDark: boolean
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => {}
})

interface ThemeProviderProps {
    children: ReactNode
}

const getInitialTheme = (): boolean => {
    if (typeof window === 'undefined') return false
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
        return true
    } else if (savedTheme === 'light') {
        return false
    } else {
        return window.matchMedia('(prefers-color-scheme: light)').matches
    }
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [isDark, setIsDark] = useState(() => getInitialTheme())

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    // Токены темы, приближённые к референсу (адаптация для светлой и тёмной темы)
    const antdTheme: ThemeConfig = {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            // Seed Tokens - основные настройки
            colorPrimary: '#10b981',
            borderRadius: 8,
            
            // Map Tokens - производные от Seed
            colorPrimaryBg: isDark ? '#064e3b' : '#ecfdf5',
            colorPrimaryBgHover: isDark ? '#065f46' : '#d1fae5',
            colorPrimaryBorder: isDark ? '#047857' : '#a7f3d0',
            colorPrimaryHover: '#059669',
            colorPrimaryActive: '#047857',

            // Основные цвета
            colorSuccess: '#10b981',
            colorInfo: '#10b981',
            colorWarning: '#f59e0b',
            colorError: '#ef4444',

            // Фоновые цвета
            colorBgBase: isDark ? '#181A1B' : '#fafafa', // основной фон
            colorBgContainer: isDark ? '#23272F' : '#fff', // карточки, таблицы
            colorBgElevated: isDark ? '#2F333C' : '#f2f3f7',
            colorBgLayout: isDark ? '#181A1B' : '#fafafa',

            // Границы
            colorBorder: isDark ? '#4B5563' : '#D1D5DB',
            colorBorderSecondary: isDark ? '#374151' : '#E5E7EB',

            // Текст
            colorText: isDark ? '#F3F4F6' : '#1A1A1A',
            colorTextSecondary: isDark ? '#A1A1AA' : '#2f323c',
            colorTextTertiary: isDark ? '#71717A' : '#A1A1AA',
            colorTextQuaternary: isDark ? '#52525B' : '#D1D5DB',

            // Размеры и отступы
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            borderRadiusXS: 4,

            controlHeight: 40,      // высота инпутов, кнопок и т.д.
            controlHeightLG: 48,
            controlHeightSM: 32,

            fontSize: 15,           // базовый размер шрифта
            fontSizeLG: 17,
            fontSizeXL: 20,
            fontSizeHeading1: 28,
            fontSizeHeading2: 22,
            fontSizeHeading3: 18,
            fontSizeHeading4: 16,
            fontSizeHeading5: 14,

            padding: 16,            // базовый внутренний отступ
            paddingLG: 24,
            paddingSM: 12,
            margin: 16,             // базовый внешний отступ
            marginLG: 24,
            marginSM: 12,

            // Типографика
            fontWeightStrong: 500,

            // Тени
            boxShadow: isDark
                ? '0 1px 4px rgba(16,30,54,0.18)'
                : '0 1px 4px rgba(16,30,54,0.06)',
            boxShadowSecondary: isDark
                ? '0 2px 8px rgba(16,30,54,0.18)'
                : '0 2px 8px rgba(16,30,54,0.08)',
            boxShadowTertiary: isDark
                ? '0 4px 16px rgba(16,30,54,0.18)'
                : '0 4px 16px rgba(16,30,54,0.08)',

            // Анимации
            motionDurationFast: '0.1s',
            motionDurationMid: '0.18s',
            motionDurationSlow: '0.28s',
            motionEaseInOut: 'cubic-bezier(0.4,0,0.2,1)',
            motionEaseOut: 'cubic-bezier(0.4,0,0.2,1)',
            motionEaseInBack: 'cubic-bezier(0.4,0,0.2,1)',

            // Градиенты
            colorBgMask: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.04)'
        },
        components: {
            Button: {
                borderRadius: 8,
                controlHeight: 40,
                paddingInline: 20,
                fontWeight: 500,
            },
            Card: {
                borderRadius: 12,
                paddingLG: 32,
                boxShadowTertiary: isDark
                    ? '0 1px 4px rgba(16,30,54,0.18)'
                    : '0 1px 4px rgba(16,30,54,0.06)'
            },
            Modal: {
                borderRadius: 16,
                paddingLG: 32
            },
            Input: {
                borderRadius: 8,
                controlHeight: 40,
                paddingInline: 16,
            },
            Select: {
                borderRadius: 6,
                controlHeight: 36,
                controlHeightLG: 44,
                controlHeightSM: 28
            },
            DatePicker: {
                borderRadius: 6,
                controlHeight: 36,
                controlHeightLG: 44,
                controlHeightSM: 28
            },
            Menu: {
                borderRadius: 8,
                itemBorderRadius: 8,
                itemHeight: 44,
                itemPaddingInline: 18
            },
            Notification: {
                borderRadius: 8,
                paddingLG: 16
            },
            Message: {
                borderRadius: 8,
                paddingLG: 12
            },
            Tag: {
                borderRadius: 16,
                paddingContentHorizontal: 16,
                fontWeightStrong: 500
            },
            Switch: {
                borderRadius: 16,
                trackHeight: 22,
                trackMinWidth: 40,
                handleSize: 18
            },
            Slider: {
                borderRadius: 4,
                trackBg: isDark ? '#4B5563' : '#D1D5DB',
                trackHoverBg: isDark ? '#6B7280' : '#9CA3AF',
                handleColor: '#2563eb',
                handleActiveColor: '#1d4ed8'
            },
            Progress: {
                borderRadius: 6,
                lineBorderRadius: 6
            },
            Dropdown: {
                borderRadius: 8,
                paddingContentVertical: 8
            },
            Tooltip: {
                borderRadius: 6,
                paddingContentHorizontal: 10,
                paddingContentVertical: 6
            },
            Popover: {
                borderRadius: 8,
                paddingLG: 12
            },
            Table: {
                borderRadius: 12,
                headerBg: isDark ? '#23272F' : '#F7F8FA',
                headerColor: isDark ? '#F3F4F6' : '#1A1A1A',
                rowHoverBg: isDark ? '#23272F' : '#F1F3F6',
                headerSplitColor: isDark ? '#4B5563' : '#D1D5DB',
                borderColor: isDark ? '#4B5563' : '#D1D5DB',
                headerBorderRadius: 12,
                cellPaddingBlock: 12,
                cellPaddingInline: 16
            },
            Tabs: {
                borderRadius: 8,
                itemSelectedColor: '#10b981',
                itemHoverColor: isDark ? '#A1A1AA' : '#10b981',
                itemActiveColor: '#10b981',
                inkBarColor: '#10b981'
            },
            Descriptions: {
                labelBg: 'transparent',
                itemPaddingBottom: 10
            },
            Divider: {
                marginLG: 18,
                marginMD: 14,
                marginSM: 10
            },
            Space: {
                sizeUnit: 4,
                sizeStep: 4
            }
        }
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <ConfigProvider theme={antdTheme} locale={ruRU}>{children}</ConfigProvider>
        </ThemeContext.Provider>
    )
}
