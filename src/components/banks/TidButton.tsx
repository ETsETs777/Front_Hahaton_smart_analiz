import { useEffect, useRef } from 'react'
import { useTidSdk } from '@/hooks/useTidSdk'

interface TidButtonProps {
  containerId: string
  clientId: string
  redirectUri: string
  onSuccess?: (code: string, state?: string) => void
  onError?: (error: Error) => void
  mockMode?: boolean
}

export const TidButton = ({ containerId, clientId, redirectUri, onSuccess, onError, mockMode = false }: TidButtonProps) => {
  const { isLoaded, initSDK, addButton } = useTidSdk()
  const buttonAddedRef = useRef(false)

  useEffect(() => {
    if (!isLoaded || buttonAddedRef.current) return

    const authParams = {
      redirectUri,
      responseType: 'code' as const,
      clientId,
      state: `tid_${Date.now()}`
    }

    const uiParams = {
      container: `#${containerId}`,
      size: 'm' as const,
      color: 'primary' as const,
      text: 'Т-Банк',
      target: '_self' as const
    }

    try {
      const sdk = initSDK(authParams)
      if (sdk) {
        addButton(sdk, uiParams)
        buttonAddedRef.current = true

        if (mockMode) {
          const container = document.getElementById(containerId)
          if (container) {
            const handleClick = (e: Event) => {
              e.preventDefault()
              e.stopPropagation()
              e.stopImmediatePropagation()
              setTimeout(() => {
                onSuccess?.('mock_code', 'mock_state')
              }, 300)
              return false
            }

            const interceptClicks = () => {
              const elements = container.querySelectorAll('button, a, [role="button"]')
              elements.forEach((el) => {
                el.addEventListener('click', handleClick, true)
                el.addEventListener('mousedown', (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }, true)
                if (el instanceof HTMLElement) {
                  el.style.pointerEvents = 'auto'
                }
              })
            }

            const observer = new MutationObserver(() => {
              interceptClicks()
            })

            observer.observe(container, { childList: true, subtree: true })

            setTimeout(() => {
              interceptClicks()
            }, 500)

            setTimeout(() => {
              interceptClicks()
            }, 1000)

            return () => {
              observer.disconnect()
            }
          }
        } else {
          const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://sso-forms-prod.t-static.ru') return

            if (event.data?.type === 'tid-auth-success') {
              const { code, state } = event.data
              onSuccess?.(code, state)
            } else if (event.data?.type === 'tid-auth-error') {
              onError?.(new Error(event.data.error || 'Ошибка авторизации T-ID'))
            }
          }

          window.addEventListener('message', handleMessage)

          return () => {
            window.removeEventListener('message', handleMessage)
          }
        }
      }
    } catch (error) {
      onError?.(error as Error)
    }
  }, [isLoaded, clientId, redirectUri, initSDK, addButton, containerId, onSuccess, onError, mockMode])

  return <div id={containerId} className="tid-button-container" />
}

