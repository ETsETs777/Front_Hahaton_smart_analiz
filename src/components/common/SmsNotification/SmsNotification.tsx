import { Alert, Space, Typography } from 'antd'
import { PhoneOutlined, SafetyCertificateOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

interface SMSNotificationProps {
  type: 'sending' | 'sent' | 'resend' | 'error'
  phone?: string
  countdown?: number
  message?: string
}

export const SMSNotification = ({ type, phone, countdown, message }: SMSNotificationProps) => {
  const getAlertProps = () => {
    switch (type) {
      case 'sending':
        return {
          type: 'info' as const,
          message: 'Отправка SMS...',
          description: 'Пожалуйста, подождите',
          icon: <PhoneOutlined spin />
        }
      
      case 'sent':
        return {
          type: 'success' as const,
          message: 'SMS код отправлен',
          description: (
            <Space direction="vertical" size="small">
              <Text>
                Код подтверждения отправлен на номер{' '}
                <Text strong>{phone}</Text>
              </Text>
              <Text type="secondary">
                <SafetyCertificateOutlined /> Введите 4-значный код из SMS
              </Text>
            </Space>
          ),
          icon: <PhoneOutlined />
        }
      
      case 'resend':
        return {
          type: 'warning' as const,
          message: 'Повторная отправка',
          description: (
            <Space direction="vertical" size="small">
              <Text>
                {countdown && countdown > 0 
                  ? `Повторная отправка через ${countdown} секунд`
                  : 'Вы можете запросить новый код'
                }
              </Text>
              <Text type="secondary">
                <ClockCircleOutlined /> Код действителен в течение 5 минут
              </Text>
            </Space>
          ),
          icon: <ClockCircleOutlined />
        }
      
      case 'error':
        return {
          type: 'error' as const,
          message: 'Ошибка отправки SMS',
          description: message || 'Попробуйте еще раз или обратитесь в поддержку',
          icon: <PhoneOutlined />
        }
      
      default:
        return {
          type: 'info' as const,
          message: 'SMS уведомление',
          description: message
        }
    }
  }

  const alertProps = getAlertProps()

  return (
    <Alert
      {...alertProps}
      showIcon
      className="mb-4"
      style={{
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    />
  )
}

export default SMSNotification 