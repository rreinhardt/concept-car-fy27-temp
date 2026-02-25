import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconHome,
  IconPeople,
  IconSequence,
  IconInbox,
  IconChart,
  IconSearch,
} from '@/components/shared/Icons'
import './Sidebar.css'

interface NavItem {
  id: string
  label: string
  path: string
  icon: React.ReactNode
  badge?: number
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      { id: 'home', label: 'Home', path: '/home', icon: <IconHome /> },
    ],
  },
  {
    label: 'Prospect & Enrich',
    items: [
      { id: 'search', label: 'People', path: '/search', icon: <IconPeople /> },
    ],
  },
  {
    label: 'Engage',
    items: [
      { id: 'sequences', label: 'Sequences', path: '/sequences', icon: <IconSequence /> },
      { id: 'triage', label: 'Inbox', path: '/triage', icon: <IconInbox />, badge: 3 },
    ],
  },
  {
    label: 'Analyze',
    items: [
      { id: 'diagnostic', label: 'Diagnostics', path: '/diagnostic', icon: <IconChart /> },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate('/home')}>
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="2.5" fill="currentColor" />
          <path d="M16 4V12M16 20V28M4 16H12M20 16H28M7.5 7.5L12.2 12.2M19.8 19.8L24.5 24.5M24.5 7.5L19.8 12.2M12.2 19.8L7.5 24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="sidebar-logo-text">Apollo</span>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <IconSearch size={14} />
        <span>Search</span>
      </div>

      {/* Nav Groups */}
      <nav className="sidebar-nav">
        {navGroups.map((group, gi) => (
          <div key={gi} className="sidebar-group">
            {group.label && (
              <div className="sidebar-group-label">{group.label}</div>
            )}
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="sidebar-item-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <button className="sidebar-item">
          <span className="sidebar-item-icon"><IconChart /></span>
          <span className="sidebar-item-label">Analytics</span>
        </button>
      </div>
    </aside>
  )
}
