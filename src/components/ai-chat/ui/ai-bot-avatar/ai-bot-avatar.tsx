import { memo } from 'react'
import styles from './ai-bot-avatar.module.scss'

export type BotAvatarState = 'idle' | 'thinking' | 'typing' | 'error' | 'greeting'

interface AiBotAvatarProps {
  state?: BotAvatarState
  size?: number
  className?: string
}

export const AiBotAvatar = memo<AiBotAvatarProps>(({ 
  state = 'idle', 
  size = 32, 
  className = '' 
}) => {
  // Для обычного режима используем GIF, для других состояний - CSS анимации
  const useGif = state === 'idle' || state === 'greeting'

  return (
    <div 
      className={`${styles.avatar} ${styles[state]} ${className}`}
      style={{ width: size, height: size }}
    >
      {useGif ? (
        <img 
          src="/logo.svg" 
          alt="AI Assistant"
          className={styles.gifAvatar}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : (
        // CSS аватарка для специальных состояний
        <>
          <div className={styles.robotHead}>
            {/* Оранжевый шлем */}
            <div className={styles.helmet}>
              {/* Белая полоса на шлеме */}
              <div className={styles.helmetStripe} />
            </div>
            
            {/* Темно-серое лицо */}
            <div className={styles.face}>
              {/* Синие глаза */}
              <div className={styles.eyes}>
                <div className={styles.eye} />
                <div className={styles.eye} />
              </div>
              
              {/* Улыбка */}
              <div className={styles.smile} />
            </div>
            
            {/* Боковые панели */}
            <div className={styles.sidePanel} />
            <div className={styles.sidePanel} />
          </div>
          
          {/* Анимационные элементы для разных состояний */}
          {state === 'thinking' && (
            <>
              <div className={styles.thinkingDots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
              <div className={styles.thinkingGlow} />
            </>
          )}
          
          {state === 'typing' && (
            <div className={styles.typingIndicator}>
              <div className={styles.typeDot} />
              <div className={styles.typeDot} />
              <div className={styles.typeDot} />
            </div>
          )}
          
          {state === 'error' && (
            <div className={styles.errorIndicator}>
              <div className={styles.errorIcon}>!</div>
            </div>
          )}
        </>
      )}
      
      {/* Общие анимационные элементы */}
      {state === 'greeting' && !useGif && (
        <div className={styles.greetingPulse} />
      )}
    </div>
  )
})

AiBotAvatar.displayName = 'AiBotAvatar'
