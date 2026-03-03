import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { useAssistantPanel } from '@/contexts/AssistantPanelContext'
import { useSidebar } from '@/contexts/SidebarContext'
import {
  IconHome,
  IconSparkle,
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
      { id: 'assistant', label: 'Assistant', path: '/assistant', icon: <IconSparkle /> },
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

/* ── "More" accordion: placeholder / not-yet-wired items ── */
const moreItems: NavItem[] = [
  { id: 'agents', label: 'Agents', icon: <IconRobot /> },
  { id: 'sheets', label: 'Sheets', icon: <IconSpreadsheet /> },
  { id: 'workflows', label: 'Workflows', icon: <IconWorkflows /> },
  { id: 'analytics', label: 'Analytics', icon: <IconChart /> },
  { id: 'enrichment', label: 'Data enrichment', icon: <IconDataEnrich /> },
  { id: 'emails', label: 'Emails', icon: <IconMail /> },
  { id: 'dialer', label: 'Dialer', icon: <IconPhone /> },
  { id: 'meetings', label: 'Meetings', icon: <IconCalendar /> },
  { id: 'conversations', label: 'Conversations', icon: <IconChat /> },
]

/* ── Path mapping for promoted items ── */
const promotedPaths: Record<string, string> = {
  emails: '/emails',
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useUser()
  const { assistantOpen } = useAssistantPanel()
  const { promotedItems, highlightItem, promotionPhase, animatingItemId, advancePhase } = useSidebar()
  const [moreOpen, setMoreOpen] = useState(false)
  const [userCollapsed, setUserCollapsed] = useState(false)
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

  const filteredMoreItems = useMemo(
    () => moreItems.filter((item) => !promotedItems.includes(item.id)),
    [promotedItems],
  )

  // During expand-more and fly phases, keep the animating item in the More list
  // so we can measure its position for the ghost animation
  const visibleMoreItems = useMemo(() => {
    if ((promotionPhase === 'expand-more' || promotionPhase === 'fly') && animatingItemId) {
      return moreItems.filter(
        (item) => !promotedItems.includes(item.id) || item.id === animatingItemId,
      )
    }
    return filteredMoreItems
  }, [promotionPhase, animatingItemId, promotedItems, filteredMoreItems])

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
                  className="sidebar-item"
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
                      className={`sidebar-item ${isFlyCollapsing ? 'sidebar-item-fly-collapse' : ''}`}
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

      {/* Bottom — Settings + User */}
      <div className="sidebar-bottom">
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
