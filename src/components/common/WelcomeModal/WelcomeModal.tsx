import { useState, useEffect, useRef } from 'react'
import { Modal, Button } from 'antd'
import { X, Gift, Sparkles } from 'lucide-react'
import './WelcomeModal.scss'

interface WelcomeModalProps {
  visible: boolean
  onClose: () => void
}

export const WelcomeModal = ({ visible, onClose }: WelcomeModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }, [visible])

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    onClose()
  }

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      closable={false}
      width={700}
      centered
      className="welcome-modal"
          maskClosable={false}
      maskStyle={{
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="welcome-modal-content">
        <button className="welcome-modal-close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="welcome-modal-header">
          <div className="welcome-icon-wrapper">
            <Gift className="welcome-icon" />
            <Sparkles className="welcome-sparkle sparkle-1" />
            <Sparkles className="welcome-sparkle sparkle-2" />
            <Sparkles className="welcome-sparkle sparkle-3" />
          </div>
          <h2 className="welcome-title">Добро пожаловать в Smart Account!</h2>
          <p className="welcome-subtitle">
            Зарегистрировавшись на нашей платформе, вы получили шанс выиграть эксклюзивный мерч!
          </p>
        </div>

        <div className="welcome-video-wrapper">
          <video
            ref={videoRef}
            src="/merch.mp4"
            className="welcome-video"
            muted
            autoPlay
            loop={false}
            playsInline
          />
        </div>

        <div className="welcome-modal-footer">
          <Button
            type="primary"
            size="large"
            onClick={handleClose}
            className="welcome-button"
          >
            Понятно, спасибо!
          </Button>
        </div>
      </div>
    </Modal>
  )
}

