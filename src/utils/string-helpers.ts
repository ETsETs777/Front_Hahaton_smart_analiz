export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) {
    return str
  }
  return str.slice(0, maxLength - suffix.length) + suffix
}

export const capitalize = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const escapeHtml = (str: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return str.replace(/[&<>"']/g, (m) => map[m])
}

export const unescapeHtml = (str: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  }
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (m) => map[m])
}

export const extractEmails = (str: string): string[] => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  return str.match(emailRegex) || []
}

export const extractUrls = (str: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return str.match(urlRegex) || []
}

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return email
  
  const maskedLocal = localPart.length > 2 
    ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
    : '*'.repeat(localPart.length)
  
  return `${maskedLocal}@${domain}`
}

export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 4) return phone
  
  const visible = cleaned.slice(-4)
  const masked = '*'.repeat(cleaned.length - 4)
  return masked + visible
}

