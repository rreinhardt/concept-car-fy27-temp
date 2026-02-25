import type { InputHTMLAttributes, ReactNode } from 'react'
import './Input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  sizeVariant?: 'sm' | 'md'
}

export default function Input({
  label,
  iconLeft,
  iconRight,
  sizeVariant = 'md',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className={`input-field input-field-${sizeVariant}`}>
        {iconLeft && <span className="input-icon input-icon-left">{iconLeft}</span>}
        <input id={inputId} className="input-element" {...props} />
        {iconRight && <span className="input-icon input-icon-right">{iconRight}</span>}
      </div>
    </div>
  )
}
