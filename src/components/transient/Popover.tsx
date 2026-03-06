import type { ReactNode } from 'react'
import './Popover.css'

interface PopoverProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export default function Popover({
  open,
  onClose,
  children,
  className = '',
}: PopoverProps) {
  if (!open) return null

  return (
    <>
      <div className="popover-backdrop" onClick={onClose} />
      <div className={`popover ${className}`}>
        {children}
      </div>
    </>
  )
}
