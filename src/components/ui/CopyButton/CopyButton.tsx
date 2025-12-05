import { Button, ButtonProps, message } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useTimeout } from '@/hooks/useTimeout'

interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  text: string
  onCopy?: (text: string) => void
  successMessage?: string
}

export const CopyButton = ({
  text,
  onCopy,
  successMessage = 'Скопировано в буфер обмена',
  ...buttonProps
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  useTimeout(() => {
    if (copied) {
      setCopied(false)
    }
  }, copied ? 2000 : null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      message.success(successMessage)
      onCopy?.(text)
    } catch (error) {
      console.error('Ошибка при копировании:', error)
      message.error('Не удалось скопировать в буфер обмена')
    }
  }

  return (
    <Button
      {...buttonProps}
      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
      onClick={handleCopy}
    >
      {copied ? 'Скопировано' : buttonProps.children || 'Копировать'}
    </Button>
  )
}

