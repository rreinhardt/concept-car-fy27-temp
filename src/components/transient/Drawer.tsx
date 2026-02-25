import type { ReactNode } from 'react'
import { IconClose } from '@/components/shared/Icons'
import './Drawer.css'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
}: DrawerProps) {
  return (
    <div className={`drawer ${open ? 'drawer-open' : ''}`}>
      {title && (
        <div className="drawer-header">
          <h3 className="drawer-title text-title-sm">{title}</h3>
          <button className="drawer-close" onClick={onClose}>
            <IconClose size={18} />
          </button>
        </div>
      )}
      <div className="drawer-body">{children}</div>
    </div>
  )
}
