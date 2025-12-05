export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) {
    return str
  }
  return str.slice(0, length) + suffix
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

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const camelCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
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

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return email
  
  const maskedLocal = localPart.length > 2
    ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
    : localPart[0] + '*'
  
  return `${maskedLocal}@${domain}`
}

export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 7) return phone
  
  const start = cleaned.slice(0, 2)
  const end = cleaned.slice(-2)
  const middle = '*'.repeat(cleaned.length - 4)
  
  return `${start}${middle}${end}`
}

