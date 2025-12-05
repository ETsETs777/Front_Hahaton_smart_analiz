import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    TidSDK: any
  }
}

interface TidSDKParams {
  redirectUri: string
  responseType: 'code'
  clientId: string
  state?: string
}

interface TidButtonParams {
  container: string
  size?: 's' | 'm' | 'l'
  color?: 'primary' | 'secondary'
  text?: string
  target?: '_self' | '_blank'
}

export const useTidSdk = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const sdkRef = useRef<any>(null)

  useEffect(() => {
    const checkSDK = () => {
      if (window.TidSDK) {
        setIsLoaded(true)
      } else {
        setTimeout(checkSDK, 100)
      }
    }

    checkSDK()
  }, [])

  const initSDK = (authParams: TidSDKParams) => {
    if (!window.TidSDK) {
      console.error('T-ID SDK не загружен')
      return null
    }

    try {
      sdkRef.current = new window.TidSDK(authParams)
      return sdkRef.current
    } catch (error) {
      console.error('Ошибка инициализации T-ID SDK:', error)
      return null
    }
  }

  const addButton = (sdk: any, uiParams: TidButtonParams) => {
    if (!sdk) {
      console.error('SDK не инициализирован')
      return
    }

    try {
      sdk.addButton(uiParams)
    } catch (error) {
      console.error('Ошибка добавления кнопки T-ID:', error)
    }
  }

  return {
    isLoaded,
    initSDK,
    addButton,
    sdk: sdkRef.current
  }
}

