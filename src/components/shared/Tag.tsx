import type { ReactNode } from 'react'
import './Tag.css'

interface TagProps {
  variant?: 'default' | 'blue' | 'green'
  removable?: boolean
  onRemove?: () => void
  children: ReactNode
  className?: string
}

export default function Tag({
  variant = 'default',
  removable = false,
  onRemove,
  children,
  className = '',
}: TagProps) {
  return (
    <span className={`tag tag-${variant} ${className}`}>
      {children}
      {removable && (
        <button className="tag-remove" onClick={onRemove} aria-label="Remove">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  )
}
