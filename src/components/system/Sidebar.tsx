import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconHome,
  IconPeople,
  IconSequence,
  IconInbox,
  IconChart,
  IconApolloLogo,
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
        <IconApolloLogo size={18} />
        <span className="sidebar-logo-text">Apollo</span>
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
