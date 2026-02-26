import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconSearch,
  IconApolloLogo,
  IconInbox,
  IconSequence,
  IconChart,
  IconHome,
  IconPeople,
  IconMail,
  IconChevronRight,
} from '@/components/shared/Icons'
import { weeklyScorecard, triageItems } from '@/data/mockMetrics'
import './Topbar.css'

interface QuickAction {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  path: string
  keywords: string[]
}

const quickActions: QuickAction[] = [
  { id: 'search', label: 'Search people', description: 'Find contacts matching your ICP', icon: <IconPeople size={16} />, path: '/search', keywords: ['search', 'people', 'contacts', 'find', 'prospects'] },
  { id: 'triage', label: 'Triage inbox', description: `${triageItems.length} items need attention`, icon: <IconInbox size={16} />, path: '/triage', keywords: ['triage', 'inbox', 'replies', 'attention'] },
  { id: 'sequences', label: 'Sequences', description: 'View and manage active sequences', icon: <IconSequence size={16} />, path: '/sequences', keywords: ['sequences', 'enroll', 'outreach', 'campaigns'] },
  { id: 'diagnostic', label: 'Diagnostic', description: 'Check account health and deliverability', icon: <IconChart size={16} />, path: '/diagnostic', keywords: ['diagnostic', 'health', 'deliverability'] },
  { id: 'scorecard', label: 'Weekly scorecard', description: 'Review your weekly performance', icon: <IconHome size={16} />, path: '/home', keywords: ['scorecard', 'home', 'weekly', 'performance', 'stats'] },
  { id: 'review', label: 'Review contacts', description: 'Review saved contacts before enrolling', icon: <IconPeople size={16} />, path: '/review', keywords: ['review', 'contacts', 'saved'] },
  { id: 'enroll', label: 'Enroll in sequence', description: 'Add contacts to a sequence', icon: <IconMail size={16} />, path: '/enroll', keywords: ['enroll', 'sequence', 'add'] },
]

export default function Topbar() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const { funnel } = weeklyScorecard
  const inboxCount = triageItems.length

  // Filter quick actions based on query
  const filtered = useMemo(() => {
    if (!query.trim()) return quickActions
    const q = query.toLowerCase()
    return quickActions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.keywords.some((k) => k.includes(q))
    )
  }, [query])

  // Close on outside click
  useEffect(() => {
    if (!expanded) return
    const handleClick = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setExpanded(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [expanded])

  // Close on Escape
  useEffect(() => {
    if (!expanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpanded(false)
        setQuery('')
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [expanded])

  // Cmd+K to open
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setExpanded(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleExpand = () => {
    setExpanded(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleAction = (path: string) => {
    setExpanded(false)
    setQuery('')
    navigate(path)
  }

  const isSearching = query.trim().length > 0

  return (
    <header className="topbar">
      {expanded && <div className="ubar-backdrop" />}
      <div className={`ubar ${expanded ? 'ubar-expanded' : ''}`} ref={barRef}>
        {/* Collapsed state */}
        {!expanded && (
          <div className="ubar-collapsed" onClick={handleExpand}>
            <div className="ubar-search-trigger">
              <IconSearch size={15} />
              <span className="ubar-placeholder">Search</span>
              <kbd className="ubar-kbd">⌘K</kbd>
            </div>

            <div className="ubar-divider" />

            <div className="ubar-stats">
              <span className="ubar-stat">
                <IconInbox size={13} />
                <span>{inboxCount} inbox</span>
              </span>
              <span className="ubar-stat">
                <IconMail size={13} />
                <span>{funnel.sent} sent</span>
              </span>
              <span className="ubar-stat">
                <IconSequence size={13} />
                <span>{funnel.meetings} meeting</span>
              </span>
            </div>

            <div className="ubar-divider" />

            <button
              className="ubar-assistant"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <IconApolloLogo size={14} />
              <span>Assistant</span>
            </button>
          </div>
        )}

        {/* Expanded state */}
        {expanded && (
          <>
            <div className="ubar-search-row">
              <IconSearch size={15} />
              <input
                ref={inputRef}
                className="ubar-input"
                placeholder="Search people, companies, actions…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="ubar-assistant"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <IconApolloLogo size={14} />
                <span>Assistant</span>
              </button>
            </div>

            <div className="ubar-dropdown">
              {!isSearching && (
                <div className="ubar-section">
                  <div className="ubar-section-label">This week</div>
                  <div className="ubar-stats-grid">
                    <div className="ubar-stat-card">
                      <span className="ubar-stat-value">{funnel.sent}</span>
                      <span className="ubar-stat-label">Sent</span>
                    </div>
                    <div className="ubar-stat-card">
                      <span className="ubar-stat-value">{funnel.opened}</span>
                      <span className="ubar-stat-label">Opened</span>
                    </div>
                    <div className="ubar-stat-card">
                      <span className="ubar-stat-value">{funnel.replied}</span>
                      <span className="ubar-stat-label">Replied</span>
                    </div>
                    <div className="ubar-stat-card ubar-stat-highlight">
                      <span className="ubar-stat-value">{funnel.meetings}</span>
                      <span className="ubar-stat-label">Meeting</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="ubar-section">
                <div className="ubar-section-label">
                  {isSearching ? 'Results' : 'Quick actions'}
                </div>
                <div className="ubar-actions-list">
                  {filtered.length === 0 && (
                    <div className="ubar-empty">No results for "{query}"</div>
                  )}
                  {filtered.map((action) => (
                    <button
                      key={action.id}
                      className="ubar-action"
                      onClick={() => handleAction(action.path)}
                    >
                      <span className="ubar-action-icon">{action.icon}</span>
                      <span className="ubar-action-text">
                        <span className="ubar-action-label">{action.label}</span>
                        <span className="ubar-action-desc">{action.description}</span>
                      </span>
                      <IconChevronRight size={14} />
                    </button>
                  ))}
                </div>
              </div>

              {!isSearching && (
                <div className="ubar-section">
                  <div className="ubar-section-label">Recommended</div>
                  <button
                    className="ubar-action"
                    onClick={() => handleAction('/search')}
                  >
                    <span className="ubar-action-icon"><IconSearch size={16} /></span>
                    <span className="ubar-action-text">
                      <span className="ubar-action-label">{weeklyScorecard.coaching.doThisNext}</span>
                      <span className="ubar-action-desc">{weeklyScorecard.coaching.savedSearch}</span>
                    </span>
                    <IconChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
