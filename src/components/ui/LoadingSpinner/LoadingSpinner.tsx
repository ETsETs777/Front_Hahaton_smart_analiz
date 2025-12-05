import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'default' | 'large'
}

export const LoadingSpinner = ({ 
  message = 'Загрузка...', 
  size = 'large' 
}: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        size={size}
      />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  )
} 