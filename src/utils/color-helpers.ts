export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export const lighten = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const factor = percent / 100
  const r = Math.round(rgb.r + (255 - rgb.r) * factor)
  const g = Math.round(rgb.g + (255 - rgb.g) * factor)
  const b = Math.round(rgb.b + (255 - rgb.b) * factor)

  return rgbToHex(r, g, b)
}

export const darken = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const factor = percent / 100
  const r = Math.round(rgb.r * (1 - factor))
  const g = Math.round(rgb.g * (1 - factor))
  const b = Math.round(rgb.b * (1 - factor))

  return rgbToHex(r, g, b)
}

export const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export const isValidHex = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

export const opacity = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

