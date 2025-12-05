import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router'
import 'gsap/ScrollTrigger'
import { Button } from 'antd'
import { ArrowRight, CheckCircle2, ArrowLeft, ChevronDown } from 'lucide-react'
import { AiChatWidget } from '@/components/ai-chat'
import { Logo } from '@/components/common/Logo'
import './how-it-works.scss'

gsap.registerPlugin(ScrollTrigger)

const HowItWorksPage = () => {
  const navigate = useNavigate()
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.step-item').forEach((step: any, i) => {
        gsap.from(step, {
          opacity: 0,
          x: -50,
          duration: 0.8,
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          delay: i * 0.2
        })
      })
    })

    return () => ctx.revert()
  }, [])

  const steps = [
    {
      number: '01',
      title: 'Регистрация и подключение',
      description: 'Создайте аккаунт и подключите свои банковские счета. Поддерживаются Т-Банк, Сбербанк, Альфа-Банк и другие.',
      features: ['Быстрая регистрация', 'Подтверждение email', 'Безопасное подключение']
    },
    {
      number: '02',
      title: 'Автоматическая синхронизация',
      description: 'Система автоматически синхронизирует транзакции каждый час. Все ваши операции в одном месте.',
      features: ['Синхронизация каждый час', 'Ручная синхронизация', 'История транзакций']
    },
    {
      number: '03',
      title: 'Категоризация и анализ',
      description: 'Транзакции автоматически категоризируются. Устанавливайте бюджет и отслеживайте расходы.',
      features: ['Автоматическая категоризация', 'Установка бюджета', 'Отслеживание лимитов']
    },
    {
      number: '04',
      title: 'AI-аналитика и рекомендации',
      description: 'GigaChat анализирует ваши финансы и предоставляет персональные рекомендации и прогнозы.',
      features: ['Анализ паттернов', 'Прогнозирование', 'Персональные рекомендации']
    }
  ]

  return (
    <div className="how-it-works-page">
      <nav className="page-nav">
        <div className="nav-container">
          <Button
            type="text"
            icon={<ArrowLeft />}
            onClick={() => navigate('/')}
            className="back-button"
          >
            Назад
          </Button>
          <div className="logo">
            <Logo size={28} showText={true} />
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Как это работает</h1>
          <p className="hero-subtitle">
            Простой и понятный процесс управления финансами с помощью AI
          </p>
        </div>
        <div className="scroll-hint">
          <div className="scroll-hint-content" onClick={() => stepsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="scroll-hint-text">Прокрутите вниз</span>
            <ChevronDown className="scroll-hint-arrow" />
          </div>
        </div>
      </section>

      <section ref={stepsRef} className="steps-section">
        <div className="section-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h2 className="step-title">{step.title}</h2>
                <p className="step-description">{step.description}</p>
                <ul className="step-features">
                  {step.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle2 className="feature-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Готовы начать?</h2>
          <p className="cta-subtitle">Присоединяйтесь к Smart Account</p>
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
        </div>
      </section>
      <AiChatWidget />
    </div>
  )
}

export default HowItWorksPage

