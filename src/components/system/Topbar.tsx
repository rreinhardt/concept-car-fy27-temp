import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconSearch,
  IconApolloLogo,
  IconInbox,
  IconSequence,
  IconHome,
  IconPeople,
  IconMail,
  IconChevronRight,
  IconSparkle,
} from '@/components/shared/Icons'
import { useAssistantPanel } from '@/contexts/AssistantPanelContext'
import { weeklyScorecard, triageItems, creditUsage } from '@/data/mockMetrics'
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
  { id: 'scorecard', label: 'Weekly scorecard', description: 'Review your weekly performance', icon: <IconHome size={16} />, path: '/home', keywords: ['scorecard', 'home', 'weekly', 'performance', 'stats'] },
  { id: 'review', label: 'Review contacts', description: 'Review saved contacts before enrolling', icon: <IconPeople size={16} />, path: '/review', keywords: ['review', 'contacts', 'saved'] },
  { id: 'enroll', label: 'Enroll in sequence', description: 'Add contacts to a sequence', icon: <IconMail size={16} />, path: '/enroll', keywords: ['enroll', 'sequence', 'add'] },
]

export default function Topbar() {
  const navigate = useNavigate()
  const { assistantOpen, toggleAssistant } = useAssistantPanel()
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const { funnel } = weeklyScorecard
  const inboxCount = triageItems.length

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
    <header className={`topbar ${assistantOpen ? 'topbar-assistant-open' : ''}`}>
      {expanded && <div className="ubar-backdrop" />}

      <div className={`ubar ${expanded ? 'ubar-expanded' : ''}`} ref={barRef}>
        {/* Collapsed state */}
        {!expanded && (
          <div className="ubar-collapsed">
            {/* Assistant button — left side of the pill */}
            <button
              className={`ubar-assistant-btn ${assistantOpen ? 'ubar-assistant-btn-active' : ''}`}
              onClick={toggleAssistant}
            >
              <IconSparkle size={14} />
              <span>Assistant</span>
            </button>

            <div className="ubar-divider" />

            <div className="ubar-search-trigger" onClick={handleExpand}>
              <IconSearch size={15} />
              <span className="ubar-placeholder">Search</span>
              <kbd className="ubar-kbd">⌘K</kbd>
            </div>

            <div className="ubar-divider" />

            <span className="ubar-credit">
              <span>{creditUsage.remaining.toLocaleString()} credits</span>
            </span>

            <div className="ubar-divider" />

            <div className="ubar-stats" onClick={handleExpand}>
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
          </div>
        )}

        {/* Expanded state */}
        {expanded && (
          <>
            {/* Header bar — same layout as collapsed, but with search input */}
            <div className="ubar-collapsed ubar-collapsed-expanded">
              <button
                className={`ubar-assistant-btn ${assistantOpen ? 'ubar-assistant-btn-active' : ''}`}
                onClick={toggleAssistant}
              >
                <IconSparkle size={14} />
                <span>Assistant</span>
              </button>

              <div className="ubar-divider" />

              <div className="ubar-search-trigger ubar-search-input-wrap">
                <IconSearch size={15} />
                <input
                  ref={inputRef}
                  className="ubar-input"
                  placeholder="Search people, companies, actions…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="ubar-divider" />

              <span className="ubar-credit">
                <span>{creditUsage.remaining.toLocaleString()} credits</span>
              </span>

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
            </div>

            {/* Dropdown — 3 columns below */}
            <div className="ubar-dropdown ubar-dropdown-cols">
              <div className="ubar-drop-col">
                <div className="ubar-section-label">Try asking</div>
                <div className="ubar-prompt-list">
                  <button className="ubar-prompt" onClick={() => { toggleAssistant(); setExpanded(false); setQuery(''); }}>
                    <IconSparkle size={12} />
                    <span>Find VPs at radiation oncology companies</span>
                  </button>
                  <button className="ubar-prompt" onClick={() => { toggleAssistant(); setExpanded(false); setQuery(''); }}>
                    <IconSparkle size={12} />
                    <span>Optimize my outreach sequence</span>
                  </button>
                  <button className="ubar-prompt" onClick={() => { toggleAssistant(); setExpanded(false); setQuery(''); }}>
                    <IconSparkle size={12} />
                    <span>Draft a follow-up for Jane Smith</span>
                  </button>
                  <button className="ubar-prompt" onClick={() => { toggleAssistant(); setExpanded(false); setQuery(''); }}>
                    <IconSparkle size={12} />
                    <span>Research Acme Corp before my call</span>
                  </button>
                  <button className="ubar-prompt" onClick={() => { toggleAssistant(); setExpanded(false); setQuery(''); }}>
                    <IconSparkle size={12} />
                    <span>Enrich my saved list with phone numbers</span>
                  </button>
                </div>
              </div>

              <div className="ubar-drop-col ubar-drop-col-mid">
                <div className="ubar-section-label">
                  {isSearching ? 'Results' : 'Quick actions'}
                </div>
                <div className="ubar-actions-list">
                  {filtered.length === 0 && (
                    <div className="ubar-empty">No results for &ldquo;{query}&rdquo;</div>
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
                {!isSearching && (
                  <>
                    <div className="ubar-section-label ubar-exp-sep">Recommended</div>
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
                  </>
                )}
              </div>

              <div className="ubar-drop-col">
                <div className="ubar-section-label">Credits</div>
                <div className="ubar-credit-summary">
                  <div className="ubar-credit-header">
                    <span className="ubar-credit-remaining">{creditUsage.remaining.toLocaleString()}</span>
                    <span className="ubar-credit-total">/ {creditUsage.total.toLocaleString()}</span>
                  </div>
                  <div className="ubar-credit-bar">
                    <div className="ubar-credit-bar-fill" style={{ width: `${creditUsage.percentUsed}%` }} />
                  </div>
                  <div className="ubar-credit-meta">
                    <span>Used today: {creditUsage.usedToday}</span>
                    <span>{creditUsage.percentUsed}% used</span>
                  </div>
                </div>
                <div className="ubar-credit-breakdown">
                  {creditUsage.breakdown.map((item) => (
                    <div key={item.label} className="ubar-credit-row">
                      <span className="ubar-credit-row-label">{item.label}</span>
                      <span className="ubar-credit-row-count">{item.count}</span>
                    </div>
                  ))}
                </div>

                <div className="ubar-section-label ubar-exp-sep">This week</div>
                <div className="ubar-mini-stats">
                  <div className="ubar-mini-stat">
                    <span className="ubar-mini-value">{funnel.sent}</span>
                    <span className="ubar-mini-label">Sent</span>
                  </div>
                  <div className="ubar-mini-stat">
                    <span className="ubar-mini-value">{funnel.opened}</span>
                    <span className="ubar-mini-label">Opened</span>
                  </div>
                  <div className="ubar-mini-stat">
                    <span className="ubar-mini-value">{funnel.replied}</span>
                    <span className="ubar-mini-label">Replied</span>
                  </div>
                  <div className="ubar-mini-stat ubar-mini-stat-highlight">
                    <span className="ubar-mini-value">{funnel.meetings}</span>
                    <span className="ubar-mini-label">Meeting</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
