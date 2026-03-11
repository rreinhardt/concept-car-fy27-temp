import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconSearch,
  IconInbox,
  IconSequence,
  IconHome,
  IconPeople,
  IconMail,
  IconChevronRight,
  IconSparkle,
  IconAssistant,
} from '@/components/shared/Icons'
import MailboxSetupWizard from '@/components/shared/MailboxSetupWizard'
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

// Mock health status data — colours driven by healthStage
const healthItemLabels = [
  { id: 'mailbox', label: 'Mailbox configuration' },
  { id: 'deliverability', label: 'Domain reputation' },
  { id: 'warmup', label: 'Mailbox warm up' },
]

export default function Topbar() {
  const navigate = useNavigate()
  const { assistantOpen, toggleAssistant } = useAssistantPanel()
  const [expanded, setExpanded] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)
  // 0 = not configured, 1 = healthy, 2 = poor health
  const [healthStage, setHealthStage] = useState<0 | 1 | 2>(0)
  const [showMailboxWizard, setShowMailboxWizard] = useState(false)
  const [query, setQuery] = useState('')

  const mailboxConnected = healthStage > 0
  const isPoorHealth = healthStage === 2
  const dotColor = isPoorHealth ? 'red' : 'green'
  const healthItems = healthItemLabels.map(h => ({ ...h, status: dotColor }))
  const inputRef = useRef<HTMLInputElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const creditsRef = useRef<HTMLDivElement>(null)

  const { funnel } = weeklyScorecard

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
      // Cycle health stage: 0 → 1 → 2 → 0
      const tag = (e.target as HTMLElement).tagName
      if (e.key === 's' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        setHealthStage(prev => ((prev + 1) % 3) as 0 | 1 | 2)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (!creditsOpen) return
    const handleClick = (e: MouseEvent) => {
      if (creditsRef.current && !creditsRef.current.contains(e.target as Node)) {
        setCreditsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [creditsOpen])

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
              <IconAssistant size={14} />
              <span>Assistant</span>
            </button>

            <div className="ubar-divider" />

            <div className="ubar-search-trigger" onClick={handleExpand}>
              <IconSearch size={15} />
              <span className="ubar-placeholder">Search</span>
              <kbd className="ubar-kbd">⌘K</kbd>
            </div>

            <div className="ubar-divider" />

            <div className="ubar-credit-wrap" ref={creditsRef}>
              <button className="ubar-credit" onClick={() => setCreditsOpen(v => !v)}>
                <span>{creditUsage.remaining.toLocaleString()} credits</span>
              </button>
              {creditsOpen && <CreditsPopover />}
            </div>

            <div className="ubar-divider" />

            {/* Health cluster */}
            <button className={`ubar-health-cluster${isPoorHealth ? ' ubar-health-cluster-error' : ''}`} onClick={handleExpand}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M11 1L5.5 6.5M11 1L7.5 11L5.5 6.5L1 4.5L11 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {mailboxConnected
                ? <>
                    {healthItems.map((h) => (
                      <span key={h.id} className={`ubar-health-dot ubar-health-dot-${h.status}`} />
                    ))}
                    {isPoorHealth && <span className="ubar-health-warning">Issues</span>}
                  </>
                : <span className="ubar-health-setup">Setup...</span>
              }
            </button>

            <div className="ubar-divider" />

            <div className="ubar-stats" onClick={handleExpand}>
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

              <div className="ubar-credit-wrap" ref={creditsRef}>
                <button className="ubar-credit" onClick={() => setCreditsOpen(v => !v)}>
                  <span>{creditUsage.remaining.toLocaleString()} credits</span>
                </button>
                {creditsOpen && <CreditsPopover />}
              </div>

              <div className="ubar-divider" />

              {/* Health cluster (expanded header) */}
              <button className={`ubar-health-cluster${isPoorHealth ? ' ubar-health-cluster-error' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M11 1L5.5 6.5M11 1L7.5 11L5.5 6.5L1 4.5L11 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {mailboxConnected
                  ? <>
                      {healthItems.map((h) => (
                        <span key={h.id} className={`ubar-health-dot ubar-health-dot-${h.status}`} />
                      ))}
                      {isPoorHealth && <span className="ubar-health-warning">Issues</span>}
                    </>
                  : <span className="ubar-health-setup">Setup...</span>
                }
              </button>

              <div className="ubar-divider" />

              <div className="ubar-stats">
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

                <div className="ubar-section-label ubar-exp-sep">Sending health</div>
                {mailboxConnected ? (
                  <>
                    {isPoorHealth && (
                      <div className="ubar-health-alert">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 5V7M6 8.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        Sending issues detected
                      </div>
                    )}
                    <div className="ubar-health-list">
                      {healthItems.map((h) => (
                        <button key={h.id} className={`ubar-health-row${isPoorHealth ? ' ubar-health-row-error' : ''}`}>
                          <span className={`ubar-health-dot ubar-health-dot-${h.status}`} />
                          <span className="ubar-health-row-label">{h.label}</span>
                          <IconChevronRight size={12} />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="ubar-health-unconfigured">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M18 2L9 11M18 2L12.5 18L9 11L2 7.5L18 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Mailbox not connected</span>
                    <button className="ubar-health-configure" onClick={() => { setExpanded(false); setQuery(''); setShowMailboxWizard(true) }}>Configure →</button>
                  </div>
                )}

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
      {showMailboxWizard && (
        <MailboxSetupWizard
          onComplete={() => { setHealthStage(1); setShowMailboxWizard(false) }}
          onClose={() => setShowMailboxWizard(false)}
        />
      )}
    </header>
  )
}

function CreditsPopover() {
  return (
    <div className="ubar-credits-popover">
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
    </div>
  )
}
