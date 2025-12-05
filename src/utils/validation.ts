export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = []
  
  if (!email) {
    errors.push('Email обязателен для заполнения')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('Некорректный формат email')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = []
  
  if (!password) {
    errors.push('Пароль обязателен для заполнения')
  } else {
    if (password.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну заглавную букву')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну строчную букву')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну цифру')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = []
  
  if (!phone) {
    errors.push('Телефон обязателен для заполнения')
  } else {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    const cleanedPhone = phone.replace(/\s|-|\(|\)/g, '')
    if (!phoneRegex.test(cleanedPhone)) {
      errors.push('Некорректный формат телефона')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateRequired = (value: string | number | null | undefined, fieldName: string): ValidationResult => {
  const errors: string[] = []
  
  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} обязателен для заполнения`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationResult => {
  const errors: string[] = []
  
  if (value.length < minLength) {
    errors.push(`${fieldName} должен содержать минимум ${minLength} символов`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): ValidationResult => {
  const errors: string[] = []
  
  if (value.length > maxLength) {
    errors.push(`${fieldName} не должен превышать ${maxLength} символов`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateNumberRange = (value: number, min: number, max: number, fieldName: string): ValidationResult => {
  const errors: string[] = []
  
  if (value < min || value > max) {
    errors.push(`${fieldName} должен быть в диапазоне от ${min} до ${max}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validatePositiveNumber = (value: number, fieldName: string): ValidationResult => {
  const errors: string[] = []
  
  if (value <= 0) {
    errors.push(`${fieldName} должен быть положительным числом`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const combineValidationResults = (...results: ValidationResult[]): ValidationResult => {
  const allErrors = results.flatMap(result => result.errors)
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  }
}

