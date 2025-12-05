import { useEffect } from 'react'
import { config } from '@/lib/env'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
}

export const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false
}: SEOProps) => {
  useEffect(() => {
    // Устанавливаем title
    const fullTitle = title ? `${title} | ${config.app.name}` : config.app.name
    document.title = fullTitle

    // Функция для установки мета-тега
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Базовые мета-теги
    if (description) {
      setMetaTag('description', description)
    }

    if (keywords) {
      setMetaTag('keywords', keywords)
    }

    // Open Graph теги
    setMetaTag('og:title', fullTitle, true)
    if (description) {
      setMetaTag('og:description', description, true)
    }
    setMetaTag('og:type', type, true)
    setMetaTag('og:site_name', config.app.name, true)

    if (url) {
      setMetaTag('og:url', url, true)
    }

    if (image) {
      setMetaTag('og:image', image, true)
    }

    // Twitter Card теги
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', fullTitle)
    if (description) {
      setMetaTag('twitter:description', description)
    }
    if (image) {
      setMetaTag('twitter:image', image)
    }

    // Robots мета-тег
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow'
    setMetaTag('robots', robotsContent)

    // Canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', url)
    }

    // JSON-LD структурированные данные
    const setJsonLD = (data: object) => {
      let script = document.querySelector('script[type="application/ld+json"]')
      if (!script) {
        script = document.createElement('script')
        script.setAttribute('type', 'application/ld+json')
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(data)
    }

    // Базовые структурированные данные для сайта
    const jsonLD = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.app.name,
      description: description || 'Приложение для управления агрегаторами бронирования',
      url: url || window.location.origin,
      logo: image || `${window.location.origin}/logo.png`,
      sameAs: [
        // Здесь можно добавить социальные сети
      ]
    }

    setJsonLD(jsonLD)

  }, [title, description, keywords, image, url, type, noindex])
}

// Предустановленные SEO данные для разных типов страниц
export const SEO_DEFAULTS = {
} as const 