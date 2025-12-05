import { AppSider, MobileMenuButton } from '@/components/layout'
import { LoadingSpinner } from '@/components/ui'
import { useAuth } from '@/contexts/auth-context'
import { AiChatWidget } from '@/components/ai-chat'
import { Layout, theme } from 'antd'
import { Outlet, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import './AppContent.scss'

const { Content } = Layout

const publicRoutes = ['/landing', '/login', '/register', '/how-it-works']

export const AppContent = () => {
    const { user, loading } = useAuth()
    const location = useLocation()
    const isPublicRoute = publicRoutes.includes(location.pathname)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (loading) {
        return <LoadingSpinner size="large" />
    }

    if (isPublicRoute) {
        return <Outlet />
    }

    if (!user) {
        return <Outlet />
    }

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <AppSider mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
            <Layout 
                className="main-layout"
                style={{ 
                    marginLeft: 'var(--sider-width, 280px)', 
                    background: 'transparent', 
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    paddingTop: 'var(--sider-mobile-height, 0px)'
                }}
            >
                {isMobile && !mobileMenuOpen && (
                    <MobileMenuButton onClick={handleMobileMenuToggle} />
                )}
                <Content
                    style={{ 
                        padding: '2rem',
                        minHeight: '100vh',
                        background: 'transparent'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
            <AiChatWidget />
        </Layout>
    )
}
