import { ErrorBoundary } from '@/components/common'
import { AppContent } from '@/components/AppContent'
import { ScrollToTop } from '@/components/ui'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { GraphQLProvider } from '@/graphql'
import { App as AntdApp, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'

const App = () => {
    return (
        <ConfigProvider locale={ruRU}>
            <ThemeProvider>
                <ErrorBoundary>
                    <AntdApp message={{ maxCount: 1 }} notification={{ maxCount: 1 }}>
                        <GraphQLProvider>
                            <AuthProvider>
                                <ScrollToTop />
                                <AppContent />
                            </AuthProvider>
                        </GraphQLProvider>
                    </AntdApp>
                </ErrorBoundary>
            </ThemeProvider>
        </ConfigProvider>
    )
}

export default App
