import { useState, useRef, useEffect, useCallback } from 'react'
import { IconPanelLeft, IconChevronDown } from './Icons'
import Button from './Button'
import './PageLayout.css'

interface ActionItem {
  label: string
  onClick: () => void
}

interface PageLayoutProps {
  title: string
  titleExtra?: React.ReactNode
  sidebar: React.ReactNode
  sidebarLabel?: string
  children: React.ReactNode
  mainClassName?: string
  actions?: ActionItem[]
  actionsPanel?: React.ReactNode
  actionsPanelOpen?: boolean
  actionsPanelWidth?: number
  actionsBtnVariant?: 'primary' | 'secondary'
  onActionsPanelToggle?: (open: boolean) => void
  collapseSidebar?: boolean
}

export default function PageLayout({
  title,
  titleExtra,
  sidebar,
  sidebarLabel = 'Filters',
  children,
  mainClassName,
  actions,
  actionsPanel,
  actionsPanelOpen,
  actionsPanelWidth,
  actionsBtnVariant = 'primary',
  onActionsPanelToggle,
  collapseSidebar,
}: PageLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)
  const [dragWidth, setDragWidth] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const hasPanel = !!actionsPanel
  const panelOpen = hasPanel ? !!actionsPanelOpen : actionsOpen
  const effectivePanelWidth = dragWidth ?? actionsPanelWidth

  // Reset drag width when panel prop changes (e.g. switching actions → email)
  useEffect(() => {
    setDragWidth(null)
  }, [actionsPanelWidth, actionsPanelOpen])

  // Collapse inner sidebar when requested (e.g. email compose opens)
  useEffect(() => {
    if (collapseSidebar) {
      setSidebarExpanded(false)
    }
  }, [collapseSidebar])

  // Close dropdowns on outside click
  useEffect(() => {
    if (!dropdownOpen && !actionsOpen) return
    const handle = (e: MouseEvent) => {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (!hasPanel && actionsOpen && actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setActionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [dropdownOpen, actionsOpen, hasPanel])

  const toggle = () => {
    setSidebarExpanded((v) => !v)
    setDropdownOpen(false)
  }

  const handleActionsClick = () => {
    if (hasPanel) {
      onActionsPanelToggle?.(!actionsPanelOpen)
    } else {
      setActionsOpen(!actionsOpen)
    }
  }

  const handleGrabberMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const body = bodyRef.current
    if (!body) return

    const onMouseMove = (ev: MouseEvent) => {
      const rect = body.getBoundingClientRect()
      const newWidth = rect.right - ev.clientX
      setDragWidth(Math.max(280, Math.min(newWidth, rect.width * 0.8)))
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <div className="search-page">
      {/* Header row */}
      <div className="search-page-header">
        <h2 className="text-title-md">{title}</h2>

        {/* Sidebar toggle + dropdown — left group */}
        <div className="page-header-left">
          <button
            className={`page-sidebar-toggle ${!sidebarExpanded ? 'page-sidebar-toggle-collapsed' : ''}`}
            onClick={toggle}
            title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <IconPanelLeft size={16} />
          </button>

          {/* Always rendered, animated in/out */}
          <div
            className={`page-dropdown-wrap ${sidebarExpanded ? 'page-dropdown-hidden' : ''}`}
            ref={dropdownRef}
          >
            <button
              className={`page-dropdown-trigger ${dropdownOpen ? 'page-dropdown-trigger-open' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              tabIndex={sidebarExpanded ? -1 : 0}
            >
              <span>{sidebarLabel}</span>
              <IconChevronDown size={12} />
            </button>
            {dropdownOpen && !sidebarExpanded && (
              <div className="page-dropdown">
                {sidebar}
              </div>
            )}
          </div>
        </div>

        {/* Right side — status text + Actions button */}
        <div className="page-header-right">
          {titleExtra}
          <div className="page-actions-wrap" ref={actionsRef}>
            <Button variant={actionsBtnVariant} size="sm" onClick={handleActionsClick}>
              Actions
            </Button>
            {!hasPanel && actionsOpen && actions && actions.length > 0 && (
              <div className="page-actions-menu">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    className="page-actions-item"
                    onClick={() => {
                      action.onClick()
                      setActionsOpen(false)
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body: sidebar + main + optional resize grabber + actions panel */}
      <div className="search-body" ref={bodyRef}>
        {/* Always rendered, collapsed via CSS transition */}
        <aside className={`search-filters ${!sidebarExpanded ? 'page-sidebar-collapsed' : ''}`}>
          <div className="page-sidebar-inner">
            {sidebar}
          </div>
        </aside>
        <div className={`search-main ${mainClassName || ''}`}>
          {children}
        </div>

        {/* Resize grabber — animates in with the panel */}
        {hasPanel && (
          <div
            className={`page-panel-grabber ${panelOpen ? 'page-panel-grabber-visible' : ''}`}
            onMouseDown={panelOpen ? handleGrabberMouseDown : undefined}
          >
            <div className="page-panel-grabber-line" />
          </div>
        )}

        {/* Actions panel — slides in from right */}
        {hasPanel && (
          <aside
            className={`page-actions-panel ${panelOpen ? 'page-actions-panel-open' : ''}`}
            style={effectivePanelWidth ? { '--panel-width': `${effectivePanelWidth}px` } as React.CSSProperties : undefined}
          >
            <div className="page-actions-panel-inner">
              {actionsPanel}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
