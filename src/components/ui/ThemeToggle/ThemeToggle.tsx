import { Space, Switch, Typography } from 'antd'
import { Moon, Sun } from 'lucide-react'
import { useContext } from 'react'
import { ThemeContext } from '@/contexts/theme-context'

const { Text } = Typography

/**
 * Компонент переключения темы через Ant Design
 * Использует ConfigProvider и встроенную систему тем Ant Design
 */
export const ThemeToggle = () => {
    const { isDark, toggleTheme } = useContext(ThemeContext)

    return (
        <div className="flex items-center gap-4 p-4 rounded-lg">
            <Space align="center">
                <Sun size={16} />
                <Switch
                    checked={isDark}
                    onChange={toggleTheme}
                    checkedChildren="Тёмная"
                    unCheckedChildren="Светлая"
                />
                <Moon size={16} />
            </Space>

            <Text type="secondary" className="ml-4">
                Тема: {isDark ? 'Тёмная' : 'Светлая'}
            </Text>
        </div>
    )
} 