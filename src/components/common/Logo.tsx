import './Logo.scss'

interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export const Logo = ({ size = 24, className = '', showText = false }: LogoProps) => {
  return (
    <div className={`logo-container ${className}`}>
      <img 
        src="/logo.svg" 
        alt="Smart Account" 
        className="logo-icon"
        style={{ width: size, height: size }}
      />
      {showText && <a href="/landing" className="logo-text">Smart Account</a>}
    </div>
  )
}

