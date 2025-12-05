import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AiChatWidget } from '@/components/ai-chat'
import { useNavigate } from 'react-router'
import 'gsap/ScrollTrigger'
import { Button } from 'antd'
import { ArrowRight, TrendingUp, Shield, BarChart3, Brain, Wallet, CreditCard, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Logo } from '@/components/common/Logo'
import './landing.scss'

gsap.registerPlugin(ScrollTrigger)

const LandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      })

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      })

      gsap.from('.hero-buttons', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
      })

      gsap.from('.hero-visual', {
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        delay: 0.4,
        ease: 'power3.out'
      })

      gsap.utils.toArray('.feature-card').forEach((card: any, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          },
          delay: i * 0.1
        })
      })

      gsap.from('.stat-item', {
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        stagger: 0.1
      })

      gsap.from('.cta-content', {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <Logo size={32} showText={true} />
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <Button 
                type="primary" 
                icon={<LayoutDashboard size={18} />}
                onClick={() => navigate('/dashboard')}
              >
                Панель управления
              </Button>
            ) : (
              <>
                <Button type="text" onClick={() => navigate('/login')}>
                  Войти
                </Button>
                <Button type="primary" onClick={() => navigate('/register')}>
                  Начать
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Управляйте финансами с
              <span className="gradient-text"> помощью AI</span>
            </h1>
            <p className="hero-subtitle">
              Современная платформа для управления личными финансами, интеграция с банками и AI-аналитика
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<LayoutDashboard size={20} />}
                  iconPosition="end"
                  onClick={() => navigate('/dashboard')}
                  className="cta-button"
                >
                  Перейти в панель управления
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRight />}
                    iconPosition="end"
                    onClick={() => navigate('/register')}
                    className="cta-button"
                  >
                    Начать бесплатно
                  </Button>
                  <Button size="large" onClick={() => navigate('/how-it-works')}>
                    Узнать больше
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <CreditCard className="card-icon" />
              <div className="card-content">
                <span className="card-label">Баланс</span>
                <span className="card-value">₽125,430</span>
              </div>
            </div>
            <div className="floating-card card-2">
              <TrendingUp className="card-icon" />
              <div className="card-content">
                <span className="card-label">Доход</span>
                <span className="card-value">+₽45,200</span>
              </div>
            </div>
            <div className="floating-card card-3">
              <BarChart3 className="card-icon" />
              <div className="card-content">
                <span className="card-label">Аналитика</span>
                <span className="card-value">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} id="features" className="features-section">
        <div className="section-container">
          <h2 className="section-title">Мощные возможности</h2>
          <p className="section-subtitle">Все инструменты для управления финансами в одном месте</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Wallet />
              </div>
              <h3 className="feature-title">Управление счетами</h3>
              <p className="feature-description">
                Создавайте и управляйте несколькими счетами, отслеживайте баланс в реальном времени
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CreditCard />
              </div>
              <h3 className="feature-title">Интеграция с банками</h3>
              <p className="feature-description">
                Поддержка Т-Банка, Сбербанка, Альфа-Банка и других. Автоматическая синхронизация транзакций
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 />
              </div>
              <h3 className="feature-title">Управление транзакциями</h3>
              <p className="feature-description">
                Категоризация расходов и доходов, отслеживание повторяющихся транзакций, привязка чеков
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp />
              </div>
              <h3 className="feature-title">Бюджет и планирование</h3>
              <p className="feature-description">
                Установка лимитов бюджета, отслеживание соблюдения, уведомления о превышении
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Brain />
              </div>
              <h3 className="feature-title">AI-аналитика</h3>
              <p className="feature-description">
                Глубокий анализ финансовых данных с помощью GigaChat. Выявление паттернов и трендов
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3 className="feature-title">Безопасность</h3>
              <p className="feature-description">
                JWT-аутентификация, подтверждение email, защищенные API-эндпоинты
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} id="stats" className="stats-section">
        <div className="section-container">
          <div className="stat-item">
            <div className="stat-value">100%</div>
            <div className="stat-label">Автоматизация</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">5+</div>
            <div className="stat-label">Банков</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Синхронизация</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">AI</div>
            <div className="stat-label">Аналитика</div>
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Готовы начать?</h2>
            <p className="cta-subtitle">Присоединяйтесь к тысячам пользователей, которые уже управляют финансами с Smart Account</p>
            {isAuthenticated ? (
              <Button
                type="primary"
                size="large"
                icon={<LayoutDashboard size={20} />}
                iconPosition="end"
                onClick={() => navigate('/dashboard')}
                className="cta-button-large"
              >
                Перейти в панель управления
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<ArrowRight />}
                iconPosition="end"
                onClick={() => navigate('/register')}
                className="cta-button-large"
              >
                Начать бесплатно
              </Button>
            )}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <Logo size={28} showText={true} />
          </div>
          <div className="footer-links">
            <a href="#features">Возможности</a>
            <a href="/how-it-works">Как это работает</a>
            {isAuthenticated ? (
              <a href="/dashboard">Панель управления</a>
            ) : (
              <a href="/login">Войти</a>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Smart Account. Все права защищены.</p>
        </div>
      </footer>
      <AiChatWidget />
    </div>
  )
}

export default LandingPage

