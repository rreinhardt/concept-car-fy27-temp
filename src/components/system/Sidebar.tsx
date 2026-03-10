import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { useAssistantPanel } from '@/contexts/AssistantPanelContext'
import { useSidebar } from '@/contexts/SidebarContext'
import {
  IconHome,
  IconAssistant,
  IconTasks,
  IconWorkflows,
  IconChart,
  IconPeople,
  IconBuilding,
  IconBookmark,
  IconDataEnrich,
  IconSequence,
  IconMail,
  IconPhone,
  IconCalendar,
  IconChat,
  IconSettings,
  IconChevronDown,
  IconChevronRight,
  IconApolloLogo,
  IconRobot,
  IconSpreadsheet,
} from '@/components/shared/Icons'
import './Sidebar.css'

interface NavItem {
  id: string
  label: string
  path?: string
  icon: React.ReactNode
  badge?: number
  placeholder?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

/* ── Primary nav: only wired / active items shown inline ── */
const primaryGroups: NavGroup[] = [
  {
    label: '',
    items: [
      { id: 'home', label: 'Home', path: '/home', icon: <IconHome /> },
      { id: 'assistant', label: 'Assistant', path: '/assistant', icon: <IconAssistant /> },
      { id: 'tasks', label: 'Tasks', path: '/tasks', icon: <IconTasks /> },
    ],
  },
  {
    label: 'Prospect & Data',
    items: [
      { id: 'find-companies', label: 'Find companies', path: '/companies', icon: <IconBuilding /> },
      { id: 'find-people', label: 'Find people', path: '/search', icon: <IconPeople /> },
      { id: 'saved-lists', label: 'Saved Lists', path: '/lists', icon: <IconBookmark /> },
    ],
  },
  {
    label: 'Engage',
    items: [
      { id: 'sequences', label: 'Sequences', path: '/sequences', icon: <IconSequence /> },
      { id: 'diagnostic', label: 'Diagnostic', path: '/diagnostic', icon: <IconChart /> },
    ],
  },
]

/* ── "More" accordion: all items now have paths ── */
const moreItems: NavItem[] = [
  { id: 'agents', label: 'Agents', path: '/agents', icon: <IconRobot /> },
  { id: 'sheets', label: 'Sheets', path: '/sheets', icon: <IconSpreadsheet /> },
  { id: 'workflows', label: 'Workflows', path: '/workflows', icon: <IconWorkflows /> },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: <IconChart /> },
  { id: 'enrichment', label: 'Data enrichment', path: '/enrichment', icon: <IconDataEnrich /> },
  { id: 'emails', label: 'Emails', path: '/emails', icon: <IconMail /> },
  { id: 'dialer', label: 'Dialer', path: '/dialer', icon: <IconPhone /> },
  { id: 'meetings', label: 'Meetings', path: '/meetings', icon: <IconCalendar /> },
  { id: 'conversations', label: 'Conversations', path: '/conversations', icon: <IconChat /> },
]

/* ── Path mapping for promoted items (animation) ── */
const promotedPaths: Record<string, string> = {
  emails: '/emails',
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useUser()
  const { assistantOpen } = useAssistantPanel()
  const { promotedItems, highlightItem, promotionPhase, animatingItemId, advancePhase, userCollapsed, setUserCollapsed } = useSidebar()
  const [moreOpen, setMoreOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [ghost, setGhost] = useState<{
    top: number
    targetTop: number
    height: number
    animating: boolean
  } | null>(null)

  // Force collapsed when assistant panel is open
  const collapsed = userCollapsed || assistantOpen

  // ── Animation sequence driven by promotionPhase ──
  useEffect(() => {
    if (promotionPhase === 'expand-more') {
      // Phase 1: open the More accordion so the item is visible
      setMoreOpen(true)
      const t = setTimeout(() => advancePhase(), 400)
      return () => clearTimeout(t)
    }

    if (promotionPhase === 'fly') {
      // Phase 2: ghost flies from More position to Engage target
      // Item is NOT in the Engage DOM — we calculate target from existing items
      const setup = requestAnimationFrame(() => {
        const nav = navRef.current
        if (!nav || !animatingItemId) return

        // Source: the item still rendered inside More
        const sourceEl = nav.querySelector(
          `[data-sidebar-more] [data-sidebar-id="${animatingItemId}"]`,
        ) as HTMLElement | null

        // Target: bottom edge of the last item currently in Engage
        const engageGroup = nav.querySelector('[data-sidebar-group="engage"]')
        const lastEngageItem = engageGroup?.querySelector(
          '.sidebar-item:last-child',
        ) as HTMLElement | null

        if (!sourceEl || !lastEngageItem) return

        const navRect = nav.getBoundingClientRect()
        const sourceRect = sourceEl.getBoundingClientRect()
        const targetBottom = lastEngageItem.getBoundingClientRect().bottom

        setGhost({
          top: sourceRect.top - navRect.top,
          targetTop: targetBottom - navRect.top,
          height: sourceRect.height,
          animating: false,
        })

        // Trigger fly on next frame
        requestAnimationFrame(() => {
          setGhost((prev) => (prev ? { ...prev, animating: true } : null))
        })
      })

      // When ghost arrives, clear it and advance to settle
      const finish = setTimeout(() => {
        setGhost(null)
        advancePhase() // → settle: commits promotedItems
      }, 550)

      return () => {
        cancelAnimationFrame(setup)
        clearTimeout(finish)
      }
    }

    if (promotionPhase === 'settle') {
      // Phase 3 (instant): item just committed to Engage DOM — advance immediately
      const frame = requestAnimationFrame(() => advancePhase())
      return () => cancelAnimationFrame(frame)
    }

    if (promotionPhase === 'collapse-more') {
      // Phase 4: collapse More — keep it open during the fade animation, then close
      const t = setTimeout(() => {
        setMoreOpen(false)
        advancePhase()
      }, 350)
      return () => clearTimeout(t)
    }
  }, [promotionPhase, advancePhase, animatingItemId])

  // Build promoted items into "Engage" group, filter from "More"
  const effectiveGroups = useMemo(() => {
    if (promotedItems.length === 0) return primaryGroups
    const promoted = moreItems
      .filter((item) => promotedItems.includes(item.id))
      .map((item) => ({ ...item, path: promotedPaths[item.id] || item.path }))
    return primaryGroups.map((group) => {
      if (group.label !== 'Engage') return group
      return { ...group, items: [...group.items, ...promoted] }
    })
  }, [promotedItems])

  // The active More item (if any) floats above More as a temporary anchor
  const activePinnedItem = useMemo(
    () => moreItems.find(item => item.path === location.pathname && !promotedItems.includes(item.id)) ?? null,
    [location.pathname, promotedItems],
  )

  const filteredMoreItems = useMemo(
    () => moreItems.filter((item) => !promotedItems.includes(item.id) && (moreOpen || item.id !== activePinnedItem?.id)),
    [promotedItems, activePinnedItem, moreOpen],
  )

  // During expand-more and fly phases, keep the animating item in the More list
  // so we can measure its position for the ghost animation
  const visibleMoreItems = useMemo(() => {
    if ((promotionPhase === 'expand-more' || promotionPhase === 'fly') && animatingItemId) {
      return moreItems.filter(
        (item) => (!promotedItems.includes(item.id) && item.id !== activePinnedItem?.id) || item.id === animatingItemId,
      )
    }
    return filteredMoreItems
  }, [promotionPhase, animatingItemId, promotedItems, activePinnedItem, filteredMoreItems])

  const isActive = (path?: string) => (path ? location.pathname === path : false)

  const renderItem = (item: NavItem) => {
    const isHighlighted = highlightItem === item.id
    const cls = [
      'sidebar-item',
      isActive(item.path) ? 'sidebar-item-active' : '',
      isHighlighted ? 'sidebar-item-highlight' : '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        key={item.id}
        className={cls}
        onClick={() => item.path && navigate(item.path)}
        data-tooltip={item.label}
        data-sidebar-id={item.id}
      >
        <span className="sidebar-item-icon">{item.icon}</span>
        <span className="sidebar-item-label">{item.label}</span>
        {item.badge !== undefined && <span className="sidebar-item-badge">{item.badge}</span>}
      </button>
    )
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo + collapse toggle */}
      <div className="sidebar-logo">
        <span
          className="sidebar-logo-icon"
          onClick={() => (collapsed ? setUserCollapsed(false) : navigate('/home'))}
        >
          <IconApolloLogo size={18} />
        </span>
        <button className="sidebar-collapse-btn" onClick={() => setUserCollapsed(!userCollapsed)}>
          {collapsed ? '\u00bb' : '\u00ab'}
        </button>
      </div>

      {/* Nav */}
      <nav
        ref={navRef}
        className={`sidebar-nav ${promotionPhase !== 'idle' ? 'sidebar-nav-animating' : ''}`}
      >
        {/* Primary groups (including promoted items) */}
        {effectiveGroups.map((group, gi) => (
          <div
            key={gi}
            className="sidebar-group"
            {...(group.label === 'Engage' ? { 'data-sidebar-group': 'engage' } : {})}
          >
            {group.label && <div className="sidebar-group-label">{group.label}</div>}
            {group.items.map(renderItem)}
          </div>
        ))}

        {/* Active More item — floats above More only when More is collapsed */}
        {activePinnedItem && !moreOpen && (
          <div className="sidebar-group sidebar-pinned-group">
            {renderItem(activePinnedItem)}
          </div>
        )}

        {/* More accordion */}
        {collapsed ? (
          <div className="sidebar-group sidebar-more-collapsed">
            <button className="sidebar-item sidebar-more-dots">
              <span className="sidebar-item-icon">···</span>
            </button>
            <div className="sidebar-more-popover">
              {filteredMoreItems.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-item${isActive(item.path) ? ' sidebar-item-active' : ''}`}
                  onClick={() => item.path && navigate(item.path)}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span className="sidebar-item-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="sidebar-group" data-sidebar-more>
            <button className="sidebar-more-toggle" onClick={() => setMoreOpen(!moreOpen)}>
              <span className="sidebar-more-label">More</span>
              <span className="sidebar-item-chevron">
                {moreOpen ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
              </span>
            </button>
            {moreOpen && (
              <div
                className={`sidebar-more-items ${promotionPhase === 'collapse-more' ? 'sidebar-more-collapsing' : ''}`}
              >
                {visibleMoreItems.map((item) => {
                  const isFlyCollapsing =
                    promotionPhase === 'fly' && item.id === animatingItemId
                  return (
                    <button
                      key={item.id}
                      className={['sidebar-item', isActive(item.path) ? 'sidebar-item-active' : '', isFlyCollapsing ? 'sidebar-item-fly-collapse' : ''].filter(Boolean).join(' ')}
                      onClick={() => item.path && navigate(item.path)}
                      data-tooltip={item.label}
                      data-sidebar-id={item.id}
                    >
                      <span className="sidebar-item-icon">{item.icon}</span>
                      <span className="sidebar-item-label">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Flying ghost for smooth promotion animation */}
        {ghost &&
          animatingItemId &&
          (() => {
            const item = moreItems.find((i) => i.id === animatingItemId)
            if (!item) return null
            return (
              <div
                className="sidebar-ghost"
                style={{
                  top: ghost.animating ? ghost.targetTop : ghost.top,
                  height: ghost.height,
                }}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </div>
            )
          })()}
      </nav>

      {/* Bottom — CRM Sync + Settings + User */}
      <div className="sidebar-bottom">
        <CrmSyncStatus collapsed={collapsed} />
        <button className="sidebar-item" data-tooltip="Settings">
          <span className="sidebar-item-icon">
            <IconSettings />
          </span>
          <span className="sidebar-item-label">Settings</span>
        </button>
        <button
          className="sidebar-user"
          data-tooltip={`${user.firstName} ${user.lastName}`}
        >
          <span className="sidebar-user-avatar">{user.initials}</span>
          <span className="sidebar-user-name text-body-sm">
            {user.firstName} {user.lastName}
          </span>
          <IconChevronRight size={12} />
        </button>
      </div>
    </aside>
  )
}

// ── CRM Sync Status ──────────────────────────────────────────
function CrmSyncStatus({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [popStyle, setPopStyle] = useState<React.CSSProperties>({})

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPopStyle({
        position: 'fixed',
        bottom: window.innerHeight - r.bottom,
        left: r.right + 8,
        width: 300,
      })
    }
    setOpen((v) => !v)
  }

  return (
    <div className="crm-sync-wrapper">
      <button
        ref={btnRef}
        className={`sidebar-item${open ? ' sidebar-item-active' : ''}`}
        onClick={handleToggle}
        data-tooltip="CRM Sync"
      >
        <span className="sidebar-item-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 8C2.5 4.96 4.96 2.5 8 2.5C10.09 2.5 11.91 3.68 12.84 5.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M13.5 8C13.5 11.04 11.04 13.5 8 13.5C5.91 13.5 4.09 12.32 3.16 10.58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10.5 5.5H13.5V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 10.5H2.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="sidebar-item-label">CRM Sync</span>
        <span className={`crm-status-dot${collapsed ? ' crm-status-dot-collapsed' : ''}`} />
      </button>

      {open && (
        <>
          <div className="crm-sync-backdrop" onClick={() => setOpen(false)} />
          <div className="crm-sync-popover" style={popStyle}>
            <div className="crm-sync-popover-header">
              <div className="crm-sync-popover-title">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C5.24 2 3 4.24 3 7C3 7.14 3.01 7.28 3.02 7.41C2.04 7.52 1.33 8.36 1.33 9.34C1.33 10.41 2.2 11.27 3.27 11.27H11.6C12.72 11.27 13.6 10.39 13.6 9.27C13.6 8.22 12.82 7.35 11.81 7.21C11.6 5.56 10.17 4.27 8.42 4.27C7.64 4.27 6.92 4.54 6.35 5C6.18 4 6 4 8 2Z" fill="#00A1E0"/>
                </svg>
                <span>Salesforce Sync Status</span>
              </div>
              <button className="crm-sync-close" onClick={() => setOpen(false)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="crm-sync-health-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" fill="#22C55E"/><path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>All systems healthy</span>
            </div>

            <div className="crm-sync-stats">
              {[
                { label: 'Records Synced Today', value: '2,847', pct: 100 },
                { label: 'Contacts Pushed', value: '1,234', pct: 85 },
                { label: 'Contacts Pulled', value: '1,613', pct: 92 },
              ].map((s) => (
                <div key={s.label} className="crm-sync-stat">
                  <div className="crm-sync-stat-row">
                    <span className="crm-sync-stat-label">{s.label}</span>
                    <span className="crm-sync-stat-value">{s.value}</span>
                  </div>
                  <div className="crm-sync-bar"><div className="crm-sync-bar-fill" style={{ width: `${s.pct}%` }} /></div>
                </div>
              ))}
            </div>

            <div className="crm-sync-section">
              <div className="crm-sync-section-title">Recent Activity</div>
              {[
                { text: '156 contacts synced to Salesforce', time: '2 min ago', ok: true },
                { text: '89 account updates pulled', time: '5 min ago', ok: true },
                { text: '3 records skipped (duplicate)', time: '12 min ago', ok: false },
              ].map((a) => (
                <div key={a.text} className="crm-sync-activity">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    {a.ok
                      ? <><circle cx="6" cy="6" r="5" fill="#22C55E"/><path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>
                      : <><circle cx="6" cy="6" r="5" fill="#F59E0B"/><path d="M6 3.5V6.5M6 7.5V8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>
                    }
                  </svg>
                  <div>
                    <span className="crm-sync-activity-text">{a.text}</span>
                    <span className="crm-sync-activity-time">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="crm-sync-section">
              <div className="crm-sync-section-title">Diagnostics</div>
              {[
                { label: 'Last Full Sync', value: 'Today, 9:00 AM', ok: false },
                { label: 'Sync Frequency', value: 'Every 15 min', ok: false },
                { label: 'API Calls Used', value: '12,450 / 100,000', ok: false },
                { label: 'Field Mappings', value: '42 active', ok: true },
              ].map((d) => (
                <div key={d.label} className="crm-sync-diag">
                  <span className="crm-sync-diag-label">{d.label}</span>
                  <span className={`crm-sync-diag-value${d.ok ? ' ok' : ''}`}>{d.value}</span>
                </div>
              ))}
            </div>

            <button className="crm-sync-settings-btn">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 8.5C7.60457 8.5 8.5 7.60457 8.5 6.5C8.5 5.39543 7.60457 4.5 6.5 4.5C5.39543 4.5 4.5 5.39543 4.5 6.5C4.5 7.60457 5.39543 8.5 6.5 8.5Z" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 6.5C2.5 6.24 2.53 5.99 2.59 5.74L1.5 5.07L2.5 3.34L3.59 4.01C4 3.62 4.5 3.33 5.07 3.17V2H7.07V3.17C7.64 3.33 8.14 3.62 8.55 4.01L9.64 3.34L10.64 5.07L9.55 5.74C9.61 5.99 9.64 6.24 9.64 6.5C9.64 6.76 9.61 7.01 9.55 7.26L10.64 7.93L9.64 9.66L8.55 8.99C8.14 9.38 7.64 9.67 7.07 9.83V11H5.07V9.83C4.5 9.67 4 9.38 3.59 8.99L2.5 9.66L1.5 7.93L2.59 7.26C2.53 7.01 2.5 6.76 2.5 6.5Z" stroke="currentColor" strokeWidth="1.2"/></svg>
              Sync Settings
            </button>
          </div>
        </>
      )}
    </div>
  )
}
