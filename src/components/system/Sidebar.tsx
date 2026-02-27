import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { useAssistantPanel } from '@/contexts/AssistantPanelContext'
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

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useUser()
  const { assistantOpen } = useAssistantPanel()
  const [moreOpen, setMoreOpen] = useState(false)
  const [userCollapsed, setUserCollapsed] = useState(false)

  // Force collapsed when assistant panel is open
  const collapsed = userCollapsed || assistantOpen

  const isActive = (path?: string) => path ? location.pathname === path : false

  const renderItem = (item: NavItem) => (
    <button
      key={item.id}
      className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
      onClick={() => item.path && navigate(item.path)}
      data-tooltip={item.label}
    >
      <span className="sidebar-item-icon">{item.icon}</span>
      <span className="sidebar-item-label">{item.label}</span>
      {item.badge !== undefined && (
        <span className="sidebar-item-badge">{item.badge}</span>
      )}
    </button>
  )

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo + collapse toggle */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon" onClick={() => collapsed ? setUserCollapsed(false) : navigate('/home')}>
          <IconApolloLogo size={18} />
        </span>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setUserCollapsed(!userCollapsed)}
        >
          {collapsed ? '\u00bb' : '\u00ab'}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {/* Primary groups */}
        {primaryGroups.map((group, gi) => (
          <div key={gi} className="sidebar-group">
            {group.label && (
              <div className="sidebar-group-label">{group.label}</div>
            )}
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
              {moreItems.map((item) => (
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
          <div className="sidebar-group">
            <button
              className="sidebar-more-toggle"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              <span className="sidebar-more-label">More</span>
              <span className="sidebar-item-chevron">
                {moreOpen ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
              </span>
            </button>
            {moreOpen && (
              <div className="sidebar-more-items">
                {moreItems.map((item) => (
                  <button
                    key={item.id}
                    className="sidebar-item"
                    onClick={() => item.path && navigate(item.path)}
                    data-tooltip={item.label}
                  >
                    <span className="sidebar-item-icon">{item.icon}</span>
                    <span className="sidebar-item-label">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Bottom — Settings + User */}
      <div className="sidebar-bottom">
        <button className="sidebar-item" data-tooltip="Settings">
          <span className="sidebar-item-icon"><IconSettings /></span>
          <span className="sidebar-item-label">Settings</span>
        </button>
        <button className="sidebar-user" data-tooltip={`${user.firstName} ${user.lastName}`}>
          <span className="sidebar-user-avatar">{user.initials}</span>
          <span className="sidebar-user-name text-body-sm">{user.firstName} {user.lastName}</span>
          <IconChevronRight size={12} />
        </button>
      </div>
    </aside>
  )
}
