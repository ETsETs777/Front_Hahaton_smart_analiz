import { Form, FormItemProps } from 'antd'
import { ReactNode } from 'react'
import './FormField.scss'

const { Item } = Form

interface FormFieldProps extends Omit<FormItemProps, 'children'> {
  children: ReactNode
  required?: boolean
  helpText?: string
  errorText?: string
}

export const FormField = ({
  children,
  required = false,
  helpText,
  errorText,
  label,
  ...formItemProps
}: FormFieldProps) => {
  return (
    <Item
      {...formItemProps}
      label={label ? (
        <span>
          {label}
          {required && <span className="form-field-required"> *</span>}
        </span>
      ) : undefined}
      help={errorText || helpText}
      validateStatus={errorText ? 'error' : undefined}
      className="form-field"
    >
      {children}
    </Item>
  )
}

