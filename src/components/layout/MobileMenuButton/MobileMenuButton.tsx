import { Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import './MobileMenuButton.scss'

interface MobileMenuButtonProps {
  onClick: () => void
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <Button
      type="text"
      icon={<MenuOutlined />}
      onClick={onClick}
      className="mobile-menu-button"
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 101,
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px'
      }}
    />
  )
}

export default MobileMenuButton

