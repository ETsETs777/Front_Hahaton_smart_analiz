import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Компонент для автоматического сброса позиции скролла при переходах между страницами
 * Использует useLayoutEffect для мгновенного сброса без анимации
 */
const ScrollToTop = () => {
  const location = useLocation()

  useLayoutEffect(() => {
    // Сбрасываем позицию скролла к верху страницы мгновенно
    window.scrollTo({ 
      top: 0, 
      left: 0, 
      behavior: 'instant' 
    })
  }, [location.pathname])

  return null
}

export default ScrollToTop 