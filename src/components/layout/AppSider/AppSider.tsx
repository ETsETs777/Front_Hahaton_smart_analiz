import { useState, useEffect } from 'react'
import { Menu, Button, Avatar, Divider } from 'antd'
import {
  DashboardOutlined,
  WalletOutlined,
  TransactionOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/contexts/auth-context'
import { Logo } from '@/components/common/Logo'
import styles from './AppSider.module.scss'

interface AppSiderProps {
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
}

export default function AppSider({ mobileOpen: externalMobileOpen, setMobileOpen: externalSetMobileOpen }: AppSiderProps = {}) {
  const [collapsed, setCollapsed] = useState(false)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768)
  
  const mobileOpen = isMobile ? (externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen) : true
  const setMobileOpen = externalSetMobileOpen || setInternalMobileOpen

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      if (width <= 768) {
        document.documentElement.style.setProperty('--sider-width', '0px')
        document.documentElement.style.setProperty('--sider-mobile-height', '0px')
      } else {
        document.documentElement.style.setProperty('--sider-width', collapsed ? '80px' : '280px')
        document.documentElement.style.setProperty('--sider-mobile-height', '0px')
      }
    }
    
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [collapsed, mobileOpen])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile && externalSetMobileOpen) {
        externalSetMobileOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [externalSetMobileOpen])
  
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Умный счет'
    },
    {
      key: '/accounts',
      icon: <WalletOutlined />,
      label: 'Счета'
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: 'Транзакции'
    },
    {
      key: '/budget',
      icon: <DollarOutlined />,
      label: 'Бюджет'
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Аналитика'
    }
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    if (isMobile && setMobileOpen) {
      setMobileOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      {isMobile && (
        <div 
          className={`${styles.mobileOverlay} ${mobileOpen ? styles.active : ''}`}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className={`${styles.sider} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.siderContent}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            {!collapsed ? (
              <Logo size={32} showText={true} />
            ) : (
              <Logo size={32} showText={false} />
            )}
          </div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              if (isMobile) {
                setMobileOpen(false)
              } else {
                setCollapsed(!collapsed)
              }
            }}
            className={styles.collapseButton}
          />
        </div>

        <Divider className={styles.divider} />

        {/* Menu Section */}
        <div className={styles.menuSection}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className={styles.menu}
          />
        </div>

        {/* Footer Section */}
        <div className={styles.footerSection}>
          <Divider className={styles.divider} />
          
          <div className={styles.userSection}>
            <Avatar 
              icon={<UserOutlined />} 
              src={user?.imageUrl}
              className={styles.avatar}
              size={collapsed ? 40 : 48}
            />
            {!collapsed && (
              <div className={styles.userInfo}>
                {user?.name && user.name.trim() ? (
                  <>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </>
                ) : (
                  <div className={styles.userName}>{user?.email}</div>
                )}
              </div>
            )}
          </div>

          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className={styles.logoutButton}
            block
          >
            {!collapsed && 'Выйти'}
          </Button>
        </div>
      </div>
    </div>
    </>
  )
}
