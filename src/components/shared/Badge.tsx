import type { ReactNode } from 'react'
import './Badge.css'

interface BadgeProps {
  variant?: 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'coral' | 'purple'
  size?: 'sm' | 'md'
  children: ReactNode
  className?: string
}

export default function Badge({
  variant = 'gray',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  )
}
