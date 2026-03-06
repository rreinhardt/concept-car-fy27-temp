import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockContacts } from '@/data/mockContacts'
import { type EnrichmentResult, mockEnrichmentResults } from '@/data/mockEnrichment'
import { useSidebar } from '@/contexts/SidebarContext'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import PageLayout from '@/components/shared/PageLayout'
import Badge from '@/components/shared/Badge'
import ActionsPanel, { type ActionGroup } from '@/components/shared/ActionsPanel'
import EmailComposeDrawer from '@/components/shared/EmailComposeDrawer'
import SendingOverlay from '@/components/shared/SendingOverlay'
import EnrichmentConfigPanel from '@/components/shared/EnrichmentConfigPanel'
import SaveCartPanel from '@/components/shared/SaveCartPanel'
import ListCartPanel from '@/components/shared/ListCartPanel'
import SequenceCartPanel from '@/components/shared/SequenceCartPanel'
import {
  IconSearch,
  IconFilter,
  IconLock,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconClock,
  IconSequence,
  IconMail,
  IconPhone,
  IconBookmark,
  IconStar,
  IconTag,
  IconDataEnrich,
  IconSparkle,
  IconBuilding,
  IconPeople,
  IconSpreadsheet,
  IconChart,
  IconWorkflows,
  IconRobot,
  IconGlobe,
  IconCheck,
  IconPlay,
  IconSettings,
} from '@/components/shared/Icons'
import './SearchPage.css'

const filterSections: { label: string; count?: number; locked?: boolean; expandable?: boolean }[] = [
  { label: 'Email status', expandable: true },
  { label: 'Job title', count: 4 },
  { label: 'Industry', count: 5 },
  { label: 'Number of employees', count: 5 },
  { label: 'Buying intent', count: 5 },
  { label: 'Keywords', count: 5 },
  { label: 'Scores' },
  { label: 'Technologies' },
  { label: 'People Lookalikes', locked: true },
  { label: 'Company Lookalikes', locked: true },
]

const searchSuggestedGroups: ActionGroup[] = [
  {
    items: [
      { icon: <IconBookmark size={15} />, label: 'Save', desc: 'Access email and track changes', id: 'save' },
    ],
  },
  {
    label: 'Outreach',
    items: [
      { icon: <IconSequence size={15} />, label: 'Add to sequence', desc: 'Enroll selected contacts', id: 'add-to-sequence' },
      { icon: <IconMail size={15} />, label: 'Email', desc: 'Send a one-off email', id: 'email' },
      { icon: <IconPhone size={15} />, label: 'Call', desc: 'Start a call task', id: 'call' },
    ],
  },
  {
    label: 'Organize',
    items: [
      { icon: <IconBookmark size={15} />, label: 'Add to list', desc: 'Save to an existing or new list', id: 'add-to-list' },
      { icon: <IconStar size={15} />, label: 'Save search', desc: 'Re-run this search later', id: 'save-search' },
      { icon: <IconTag size={15} />, label: 'Tag contacts', desc: 'Apply tags to selection', id: 'tag' },
    ],
  },
  {
    label: 'Enrich & Research',
    items: [
      { icon: <IconDataEnrich size={15} />, label: 'Enrich with Apollo', desc: 'Fill missing data fields', id: 'enrich' },
      { icon: <IconSparkle size={15} />, label: 'Research with AI', desc: 'Deep research on contacts', id: 'research-ai' },
    ],
  },
]

const searchAdvancedGroups: ActionGroup[] = [
  {
    label: 'Data sources',
    items: [
      { icon: <IconBuilding size={15} />, label: 'Search for companies', id: 'search-companies' },
      { icon: <IconPeople size={15} />, label: 'Find people at these companies', id: 'find-people-companies' },
      { icon: <IconSpreadsheet size={15} />, label: 'Import from CSV', id: 'import-csv' },
    ],
  },
  {
    label: 'Enrichments',
    items: [
      { icon: <IconMail size={15} />, label: 'Enrich email', desc: 'Email by identifier', id: 'enrich-email' },
      { icon: <IconSparkle size={15} />, label: 'Research agent', desc: 'Full-scale AI research', id: 'research-agent' },
      { icon: <IconSparkle size={15} />, label: 'Qualification agent', desc: 'Qualify against ICP', id: 'qualification-agent' },
      { icon: <IconChart size={15} />, label: 'Job change tracking', desc: 'Monitor role changes', id: 'job-change' },
    ],
  },
  {
    label: 'Automation',
    items: [
      { icon: <IconWorkflows size={15} />, label: 'Create Workflow', desc: 'Build automation rules', id: 'create-workflow' },
      { icon: <IconRobot size={15} />, label: 'Run AI agent', desc: 'Execute an agent task', id: 'run-agent' },
    ],
  },
  {
    label: 'Export',
    items: [
      { icon: <IconSpreadsheet size={15} />, label: 'Download as CSV', id: 'download-csv' },
      { icon: <IconSequence size={15} />, label: 'Push to Sequences', id: 'push-sequences' },
      { icon: <IconGlobe size={15} />, label: 'Push to CRM', id: 'push-crm' },
    ],
  },
]

/** Position a fixed tooltip above its trigger on hover */
function posFixedAbove(e: React.MouseEvent, sel: string, gap = 8, center = true) {
  const r = e.currentTarget.getBoundingClientRect()
  const el = e.currentTarget.querySelector(sel) as HTMLElement | null
  if (el) {
    el.style.left = center ? `${r.left + r.width / 2}px` : `${r.left}px`
    el.style.top = `${r.top - gap}px`
  }
}

export default function SearchPage() {
  const navigate = useNavigate()
  const { promoteItem, setUserCollapsed } = useSidebar()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [actionsPanelOpen, setActionsPanelOpen] = useState(false)
  const [panelView, setPanelView] = useState<'actions' | 'email' | 'enrich-config-email' | 'enrich-config-phone' | 'save-cart' | 'list-cart' | 'sequence-cart'>('actions')
  const [emailApproach, setEmailApproach] = useState<'verified' | 'any'>('verified')
  const [emailValidation, setEmailValidation] = useState(true)
  const [emailInclusionFilter, setEmailInclusionFilter] = useState<Set<string>>(new Set())
  const [emailStatusExpanded, setEmailStatusExpanded] = useState(false)
  const [includeCatchAll, setIncludeCatchAll] = useState(true)
  const [hiddenColCount, setHiddenColCount] = useState(0)
  const [showSendingOverlay, setShowSendingOverlay] = useState(false)
  const [sendingContact, setSendingContact] = useState('')
  const [enrichmentState, setEnrichmentState] = useState<Record<number, { email?: 'loading' | EnrichmentResult; phone?: 'loading' | EnrichmentResult }>>({})
  const [saveAllConfirm, setSaveAllConfirm] = useState<string | null>(null)
  const tableWrapperRef = useRef<HTMLDivElement>(null)

  // Collapse main nav when email compose opens
  useEffect(() => {
    if (panelView === 'email') {
      setUserCollapsed(true)
    }
  }, [panelView, setUserCollapsed])

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  // Show/hide actions panel based on row selection
  useEffect(() => {
    if (selectedRows.length > 0 && !actionsPanelOpen) {
      setActionsPanelOpen(true)
    } else if (selectedRows.length === 0 && actionsPanelOpen) {
      setActionsPanelOpen(false)
      setPanelView('actions')
    }
  }, [selectedRows.length])

  const updateHiddenCols = useCallback(() => {
    const wrapper = tableWrapperRef.current
    if (!wrapper) return
    const table = wrapper.querySelector('table')
    if (!table) return
    const ths = table.querySelectorAll('thead th')
    const wrapperRight = wrapper.getBoundingClientRect().right
    let hidden = 0
    ths.forEach((th) => {
      const rect = th.getBoundingClientRect()
      // Column is hidden if its right edge is past the wrapper's right edge
      if (rect.right > wrapperRight + 1) hidden++
    })
    setHiddenColCount(hidden)
    // Toggle divider class when scrolled horizontally
    wrapper.classList.toggle('is-scrolled-x', wrapper.scrollLeft > 0)
  }, [])

  useEffect(() => {
    const wrapper = tableWrapperRef.current
    if (!wrapper) return
    wrapper.addEventListener('scroll', updateHiddenCols)
    // Also check on resize
    const ro = new ResizeObserver(updateHiddenCols)
    ro.observe(wrapper)
    updateHiddenCols()
    return () => {
      wrapper.removeEventListener('scroll', updateHiddenCols)
      ro.disconnect()
    }
  }, [updateHiddenCols])

  const toggleAll = () => {
    if (selectedRows.length === filteredContacts.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredContacts.map((c) => c.id))
    }
  }

  const handleEnrich = (contactId: number, type: 'email' | 'phone') => {
    setEnrichmentState((prev) => ({
      ...prev,
      [contactId]: { ...prev[contactId], [type]: 'loading' },
    }))
    setTimeout(() => {
      const result = mockEnrichmentResults[contactId]?.[type]
      if (result) {
        setEnrichmentState((prev) => ({
          ...prev,
          [contactId]: { ...prev[contactId], [type]: result },
        }))
      }
    }, 2000)
  }

  const isContactSaved = (id: number) => {
    const s = enrichmentState[id]?.email
    return s != null && s !== 'loading'
  }

  const handleSaveAll = () => {
    mockContacts.forEach((c, i) => {
      if (!enrichmentState[c.id]?.email) {
        // Stagger the enrichments slightly for visual effect
        setTimeout(() => handleEnrich(c.id, 'email'), i * 150)
      }
    })
  }

  // Maps availability values to their tier
  const ITEM_TIER: Record<string, 'safe' | 'caution' | 'risk'> = {
    'found-verified': 'safe',
    'found-unverified': 'caution',
    'stale': 'caution',
    'user-managed': 'caution',
    'not-found': 'risk',
    'unavailable': 'risk',
  }

  const AVAILABILITY_LABEL: Record<string, string> = {
    'found-verified': 'Verified',
    'found-unverified': 'Found, not verified',
    'stale': 'Needs re-verification',
    'user-managed': 'User managed',
    'not-found': 'Email not found',
    'unavailable': 'Unavailable',
  }

  const TIER_ITEMS: Record<'safe' | 'caution' | 'risk', string[]> = {
    safe: ['found-verified'],
    caution: ['found-unverified', 'stale', 'user-managed'],
    risk: ['not-found', 'unavailable'],
  }

  const toggleInclusionItem = (avail: string) => {
    setEmailInclusionFilter((prev) => {
      const next = new Set(prev)
      if (next.has(avail)) next.delete(avail)
      else next.add(avail)
      return next
    })
  }

  const toggleTier = (tier: 'safe' | 'caution' | 'risk') => {
    const items = TIER_ITEMS[tier]
    const allSelected = items.every((v) => emailInclusionFilter.has(v))
    setEmailInclusionFilter((prev) => {
      const next = new Set(prev)
      if (allSelected) items.forEach((v) => next.delete(v))
      else items.forEach((v) => next.add(v))
      return next
    })
  }

  const isTierActive = (tier: 'safe' | 'caution' | 'risk') =>
    TIER_ITEMS[tier].every((v) => emailInclusionFilter.has(v))

  const emailStatusCount = emailInclusionFilter.size

  const filteredContacts = mockContacts.filter((contact) => {
    if (emailInclusionFilter.size > 0 && !emailInclusionFilter.has(contact.emailAvailability ?? '')) return false
    return true
  })

  const emailHelperText = emailApproach === 'verified'
    ? emailValidation
      ? 'Apollo searches up to 5 sources in order, stopping only when a verified email is found and confirmed by ZeroBounce.'
      : 'Apollo searches up to 5 sources in order, stopping only when a verified email is found.'
    : emailValidation
      ? 'Apollo searches up to 5 sources in order, stopping as soon as any email is found. Emails are then validated by ZeroBounce.'
      : 'Apollo searches up to 5 sources in order, stopping as soon as any email is found.'

  const sidebar = (
    <>
      <div className="search-filters-controls">
        <div className="search-view-selector">
          <span className="text-body-sm">Default view</span>
          <IconChevronDown size={14} />
        </div>
        <Button variant="ghost" size="sm" icon={<IconFilter />}>Filters</Button>
      </div>

      <Input
        placeholder="Search people"
        sizeVariant="sm"
        iconLeft={<IconSearch size={14} />}
      />

      <div className="search-stats">
        <div className="search-stat">
          <span className="text-caption text-secondary">Total</span>
          <span className="text-body-sm font-medium">5,284</span>
        </div>
        <div className="search-stat">
          <span className="text-caption text-secondary">Net New</span>
          <span className="text-body-sm font-medium">5,284</span>
        </div>
        <div className="search-stat">
          <span className="text-caption text-secondary">Saved</span>
          <span className="text-body-sm font-medium">0</span>
        </div>
      </div>

      <div className="search-filter-list">
        {filterSections.map((section) => {
          if (section.expandable && section.label === 'Email status') {
            return (
              <div key={section.label} className="search-filter-email-status">
                <button
                  className="search-filter-item search-filter-email-status-header"
                  onClick={() => setEmailStatusExpanded((v) => !v)}
                >
                  <span className="text-body-sm">{section.label}</span>
                  <span className="search-filter-item-right">
                    {emailStatusCount > 0 && <Badge variant="blue" size="sm">{emailStatusCount}</Badge>}
                    <IconChevronRight size={14} className={`search-filter-email-chevron${emailStatusExpanded ? ' search-filter-email-chevron-open' : ''}`} />
                  </span>
                </button>
                {emailStatusExpanded && (
                  <div className="search-filter-email-status-body">
                    <p className="search-filter-email-helper text-caption text-secondary">
                      {emailHelperText}{' '}
                      <button
                        className="search-filter-email-cog"
                        onClick={() => { setPanelView('enrich-config-email'); setActionsPanelOpen(true) }}
                      >
                        <IconSettings size={11} />
                      </button>
                    </p>
                    <div className="search-filter-traffic">
                      {(['safe', 'caution', 'risk'] as const).map((tier) => (
                        <button
                          key={tier}
                          className={`search-filter-traffic-btn search-filter-traffic-btn-${tier}${isTierActive(tier) ? ' active' : ''}`}
                          onClick={() => toggleTier(tier)}
                        >
                          <span className="search-filter-traffic-dot" />
                          <span className="text-caption">{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                        </button>
                      ))}
                    </div>
                    <div className="search-filter-exclude-list">
                      {[
                        { value: 'found-verified', label: 'Verified' },
                        { value: 'found-unverified', label: 'Found, not verified' },
                        { value: 'stale', label: 'Needs re-verification' },
                        { value: 'user-managed', label: 'User managed' },
                        { value: 'not-found', label: 'Email not found' },
                        { value: 'unavailable', label: 'Unavailable' },
                      ].map(({ value, label }) => (
                        <label key={value} className="search-filter-exclude-label text-caption">
                          <input
                            type="checkbox"
                            checked={emailInclusionFilter.has(value)}
                            onChange={() => toggleInclusionItem(value)}
                          />
                          <span className={`search-filter-traffic-dot search-filter-traffic-dot-${ITEM_TIER[value]}`} />
                          {label}
                        </label>
                      ))}
                    </div>
                    <div className="search-filter-catchall">
                      <label className="search-filter-catchall-label text-caption">
                        <input
                          type="checkbox"
                          checked={includeCatchAll}
                          onChange={(e) => setIncludeCatchAll(e.target.checked)}
                        />
                        <div className="search-filter-catchall-body">
                          <span className="font-medium">Include catch-all emails</span>
                          <span className="text-secondary">Domains that accept all email addresses from that server, whether it exists or not.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )
          }
          return (
            <button key={section.label} className={`search-filter-item${section.locked ? ' search-filter-item-locked' : ''}`}>
              <span className="text-body-sm">{section.label}</span>
              <span className="search-filter-item-right">
                {section.count && <Badge variant="blue" size="sm">{section.count}</Badge>}
                {section.locked ? <IconLock size={13} className="search-filter-lock" /> : <IconChevronRight size={14} />}
              </span>
            </button>
          )
        })}
      </div>

      <div className="search-filter-actions">
        <div className="search-filter-actions-main">
          <button className="text-body-sm" style={{ color: 'var(--color-text-link)' }}>
            <IconPlus size={14} /> Add filter
          </button>
          <button className="text-caption text-secondary">Reset all</button>
        </div>
        <button className="search-filter-ai-btn">
          <IconSparkle size={12} />
          <span className="text-caption">Create your own with AI</span>
        </button>
      </div>
    </>
  )

  return (
    <PageLayout
      title="People"
      titleExtra={
        <div className="search-liveness">
          <span className="search-liveness-dot" />
          <span className="text-caption text-secondary">
            <strong>12</strong> new contacts match &middot; <strong>8</strong> signals detected &middot; Updated 3m ago
          </span>
        </div>
      }
      sidebar={sidebar}
      actionsPanel={
        panelView === 'enrich-config-email' || panelView === 'enrich-config-phone' ? (
          <EnrichmentConfigPanel
            type={panelView === 'enrich-config-phone' ? 'phone' : 'email'}
            onClose={() => {
              setPanelView('actions')
              if (selectedRows.length === 0) setActionsPanelOpen(false)
            }}
            onApproachChange={panelView === 'enrich-config-email' ? setEmailApproach : undefined}
            onValidationChange={panelView === 'enrich-config-email' ? setEmailValidation : undefined}
          />
        ) : panelView === 'save-cart' ? (
          <SaveCartPanel
            selectedCount={selectedRows.length}
            selectedContacts={selectedRows.map(id => {
              const c = mockContacts.find(mc => mc.id === id)!
              return { id: c.id, emailAvailability: c.emailAvailability }
            })}
            enrichmentState={enrichmentState}
            emailApproach={emailApproach}
            emailValidation={emailValidation}
            onBack={() => setPanelView('actions')}
            onClose={() => { setPanelView('actions'); setActionsPanelOpen(false) }}
            onConfigEmail={() => setPanelView('enrich-config-email')}
            onConfirm={() => {
              selectedRows.forEach((cid) => {
                if (!enrichmentState[cid]?.email) handleEnrich(cid, 'email')
                if (!enrichmentState[cid]?.phone) handleEnrich(cid, 'phone')
              })
              setPanelView('actions')
              setActionsPanelOpen(false)
            }}
          />
        ) : panelView === 'list-cart' ? (
          <ListCartPanel
            selectedCount={selectedRows.length}
            selectedContacts={selectedRows.map(id => mockContacts.find(c => c.id === id)).filter(Boolean) as any}
            enrichmentState={enrichmentState}
            emailApproach={emailApproach}
            emailValidation={emailValidation}
            onBack={() => setPanelView('actions')}
            onClose={() => { setPanelView('actions'); setActionsPanelOpen(false) }}
            onConfigEmail={() => setPanelView('enrich-config-email')}
            onConfirm={() => { setPanelView('actions'); setActionsPanelOpen(false) }}
          />
        ) : panelView === 'sequence-cart' ? (
          <SequenceCartPanel
            selectedCount={selectedRows.length}
            selectedContacts={selectedRows.map(id => mockContacts.find(c => c.id === id)).filter(Boolean) as any}
            enrichmentState={enrichmentState}
            emailApproach={emailApproach}
            emailValidation={emailValidation}
            onBack={() => setPanelView('actions')}
            onClose={() => { setPanelView('actions'); setActionsPanelOpen(false) }}
            onConfigEmail={() => setPanelView('enrich-config-email')}
            onConfirm={() => { setPanelView('actions'); setActionsPanelOpen(false) }}
          />
        ) : panelView === 'email' ? (
          <EmailComposeDrawer
            onClose={() => {
              setPanelView('actions')
              setActionsPanelOpen(false)
            }}
            onBack={() => setPanelView('actions')}
            onSend={() => {
              // Get the first selected contact's name for the overlay
              const firstId = selectedRows[0]
              const c = firstId != null ? mockContacts.find(mc => mc.id === firstId) : undefined
              setSendingContact(c?.name ?? 'your contact')
              // Show overlay first, then close drawer after it's visible
              setShowSendingOverlay(true)
              setTimeout(() => {
                setPanelView('actions')
                setActionsPanelOpen(false)
              }, 400)
            }}
            contacts={selectedRows.map(id => {
              const c = mockContacts.find(mc => mc.id === id)!
              return {
                name: c.name,
                email: `${c.name.toLowerCase().replace(/\s+/g, '.')}@${c.company.toLowerCase().replace(/\s+/g, '')}.com`,
                title: c.title,
                company: c.company,
                signals: c.signals,
              }
            })}
          />
        ) : (
          <ActionsPanel
            onClose={() => setActionsPanelOpen(false)}
            onAction={(id) => {
              if (id === 'save') {
                setPanelView('save-cart')
              } else if (id === 'add-to-list') {
                setPanelView('list-cart')
              } else if (id === 'add-to-sequence') {
                setPanelView('sequence-cart')
              } else if (id === 'email') {
                setPanelView('email')
              } else if (id === 'enrich') {
                // Enrich selected contacts inline — no longer navigates to /review
                selectedRows.forEach((cid) => {
                  if (!enrichmentState[cid]?.email) handleEnrich(cid, 'email')
                })
              } else {
                setActionsPanelOpen(false)
              }
            }}
            selectedCount={selectedRows.length}
            onDeselect={() => setSelectedRows([])}
            suggestedGroups={searchSuggestedGroups}
            advancedGroups={searchAdvancedGroups}
          />
        )
      }
      actionsPanelOpen={actionsPanelOpen || panelView === 'enrich-config-email' || panelView === 'enrich-config-phone'}
      actionsPanelWidth={panelView.endsWith('-cart') ? 400 : panelView === 'email' ? 680 : panelView.startsWith('enrich-config') ? 400 : undefined}
      actionsBtnVariant={panelView === 'email' ? 'secondary' : 'primary'}
      collapseSidebar={panelView === 'email'}
      onActionsPanelToggle={(open) => {
        setActionsPanelOpen(open)
        if (!open) {
          setPanelView('actions')
        }
      }}
    >
      <div className="search-table-area">
        <div className="search-table-frame">
          <div className="search-table-wrapper" ref={tableWrapperRef}>
            <table className="search-table">
              <thead>
                <tr>
                  <th className="search-th-check">
                    <input
                      type="checkbox"
                      checked={filteredContacts.length > 0 && selectedRows.length === filteredContacts.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Job Title</th>
                  <th>
                    <span className="search-th-enrichable">
                      Emails
                      <button className="search-th-waterfall" onClick={() => { setPanelView('enrich-config-email'); setActionsPanelOpen(true) }}>
                        Up to 5 sources
                      </button>
                      <span className="search-th-save-all-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-th-save-all-tooltip', 6)}>
                        <button className="search-th-save-all" onClick={() => setSaveAllConfirm(saveAllConfirm === 'email' ? null : 'email')}>
                          <IconPlay size={10} />
                        </button>
                        <span className="search-th-save-all-tooltip">Save all in view</span>
                        {saveAllConfirm === 'email' && (
                          <span className="search-th-save-all-confirm">
                            <span className="text-caption">Save all 13 contacts?</span>
                            <button className="search-th-confirm-btn" onClick={() => { handleSaveAll(); setSaveAllConfirm(null) }}>Run</button>
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <th>
                    <span className="search-th-enrichable">
                      Phone Numbers
                      <button className="search-th-waterfall" onClick={() => { setPanelView('enrich-config-phone'); setActionsPanelOpen(true) }}>
                        Up to 12 sources
                      </button>
                      <span className="search-th-save-all-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-th-save-all-tooltip', 6)}>
                        <button className="search-th-save-all" onClick={() => setSaveAllConfirm(saveAllConfirm === 'phone' ? null : 'phone')}>
                          <IconPlay size={10} />
                        </button>
                        <span className="search-th-save-all-tooltip">Save all in view</span>
                        {saveAllConfirm === 'phone' && (
                          <span className="search-th-save-all-confirm">
                            <span className="text-caption">Save all 13 contacts?</span>
                            <button className="search-th-confirm-btn" onClick={() => { mockContacts.forEach((c, i) => { if (!enrichmentState[c.id]?.phone) setTimeout(() => handleEnrich(c.id, 'phone'), i * 150) }); setSaveAllConfirm(null) }}>Run</button>
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <th>Signals</th>
                  <th>
                    <span className="search-th-enrichable">
                      Freshness
                      <span className="search-th-save-all-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-th-save-all-tooltip', 6)}>
                        <button className="search-th-save-all" onClick={() => setSaveAllConfirm(saveAllConfirm === 'freshness' ? null : 'freshness')}>
                          <IconPlay size={10} />
                        </button>
                        <span className="search-th-save-all-tooltip">Save all in view</span>
                        {saveAllConfirm === 'freshness' && (
                          <span className="search-th-save-all-confirm">
                            <span className="text-caption">Save all 13 contacts?</span>
                            <button className="search-th-confirm-btn" onClick={() => { handleSaveAll(); setSaveAllConfirm(null) }}>Run</button>
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <th>
                    <span className="search-th-enrichable">
                      Verified
                      <span className="search-th-save-all-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-th-save-all-tooltip', 6)}>
                        <button className="search-th-save-all" onClick={() => setSaveAllConfirm(saveAllConfirm === 'verified' ? null : 'verified')}>
                          <IconPlay size={10} />
                        </button>
                        <span className="search-th-save-all-tooltip">Save all in view</span>
                        {saveAllConfirm === 'verified' && (
                          <span className="search-th-save-all-confirm">
                            <span className="text-caption">Save all 13 contacts?</span>
                            <button className="search-th-confirm-btn" onClick={() => { handleSaveAll(); setSaveAllConfirm(null) }}>Run</button>
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <th>
                    <span className="search-th-enrichable">
                      Reachability
                      <span className="search-th-save-all-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-th-save-all-tooltip', 6)}>
                        <button className="search-th-save-all" onClick={() => setSaveAllConfirm(saveAllConfirm === 'reachability' ? null : 'reachability')}>
                          <IconPlay size={10} />
                        </button>
                        <span className="search-th-save-all-tooltip">Save all in view</span>
                        {saveAllConfirm === 'reachability' && (
                          <span className="search-th-save-all-confirm">
                            <span className="text-caption">Save all 13 contacts?</span>
                            <button className="search-th-confirm-btn" onClick={() => { handleSaveAll(); setSaveAllConfirm(null) }}>Run</button>
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <th>
                    <button className="search-add-col text-caption" style={{ color: 'var(--color-text-link)' }}>
                      + Add columns
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className={selectedRows.includes(contact.id) ? 'search-row-selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(contact.id)}
                        onChange={() => toggleRow(contact.id)}
                      />
                    </td>
                    <td>
                      <div className="search-cell-name">
                        <div className="search-cell-name-row">
                          <span className="text-body-sm font-medium">{contact.name}</span>
                        </div>
                        <div className="search-cell-meta">
                          <span className="text-caption text-secondary">{contact.company}</span>
                          {contact.updatedAgo && (
                            <span className="search-updated">
                              <IconClock size={10} />
                              {contact.updatedAgo}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-body-sm text-secondary">{contact.title}</td>
                    <td>
                      {enrichmentState[contact.id]?.email === 'loading' ? (
                        <span className="search-enriching">
                          <span className="search-enriching-spinner" />
                          <span className="text-caption text-secondary">Verifying…</span>
                        </span>
                      ) : enrichmentState[contact.id]?.email && enrichmentState[contact.id]?.email !== 'loading' ? (
                        <span className="search-email-revealed-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-enrich-popover', 8, false)}>
                          <span className={`search-email-revealed ${(enrichmentState[contact.id]!.email as EnrichmentResult).finalStatus === 'verified' ? 'search-email-verified' : 'search-email-unverified'}`}>
                            <IconCheck size={12} className={`search-email-status-icon ${(enrichmentState[contact.id]!.email as EnrichmentResult).finalStatus === 'verified' ? 'search-email-verified-icon' : 'search-email-unverified-icon'}`} />
                            <span className="text-body-sm">{(enrichmentState[contact.id]!.email as EnrichmentResult).finalResult}</span>
                          </span>
                          <div className="search-enrich-popover">
                            <div className="search-enrich-popover-title text-caption font-medium">Enrichment log</div>
                            <div className="search-enrich-popover-waterfall">
                              {(enrichmentState[contact.id]!.email as EnrichmentResult).sources.filter(s => s.status !== 'skipped').map((s, i) => (
                                <span key={s.name} className="search-enrich-popover-wf-step">
                                  {i > 0 && <span className="search-enrich-popover-wf-arrow">&rarr;</span>}
                                  <span className={`search-enrich-popover-wf-node search-enrich-popover-wf-${s.status}`}>{s.name} {s.status === 'found' ? '✓' : '✗'}</span>
                                </span>
                              ))}
                            </div>
                            <div className="search-enrich-popover-details">
                              <span className="text-caption text-secondary">Found by: <strong className="text-primary">{(enrichmentState[contact.id]!.email as EnrichmentResult).sources.find(s => s.status === 'found')?.name}</strong></span>
                              {(enrichmentState[contact.id]!.email as EnrichmentResult).validation && (
                                <span className="text-caption text-secondary">
                                  {(enrichmentState[contact.id]!.email as EnrichmentResult).finalStatus === 'verified' ? 'Validated by: ' : 'Checked by: '}
                                  <strong className="text-primary">{(enrichmentState[contact.id]!.email as EnrichmentResult).validation!.provider}</strong>
                                  {(enrichmentState[contact.id]!.email as EnrichmentResult).finalStatus !== 'verified' && ' (Validation did not pass)'}
                                </span>
                              )}
                            </div>
                            <div className="search-enrich-popover-footer text-caption">
                              <span className={`search-enrich-popover-badge search-enrich-popover-badge-${(enrichmentState[contact.id]!.email as EnrichmentResult).finalStatus}`}>
                                {(enrichmentState[contact.id]!.email as EnrichmentResult).finalStatus === 'verified' ? 'Verified' : 'Unverified'}
                              </span>
                              <span className="text-tertiary">{(enrichmentState[contact.id]!.email as EnrichmentResult).totalCredits} credits used</span>
                            </div>
                          </div>
                        </span>
                      ) : (
                        <span className="search-access-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-access-tooltip', 0)}>
                          <button className="search-access-btn" onClick={() => handleEnrich(contact.id, 'email')}>
                            {contact.emailSendability && <span className={`search-access-traffic-dot search-access-traffic-dot-${contact.emailSendability}`} />}
                            <IconLock size={12} />
                            <span>Access email</span>
                          </button>
                          <span className="search-access-tooltip search-access-tooltip-email">
                            {contact.emailAvailability && ITEM_TIER[contact.emailAvailability] && (
                              <span className={`search-access-traffic-dot search-access-traffic-dot-${ITEM_TIER[contact.emailAvailability]}`} />
                            )}
                            <span>{contact.emailAvailability ? AVAILABILITY_LABEL[contact.emailAvailability] + ' · ' : ''}1–6 credits per record</span>
                            <button className="search-access-tooltip-gear" onClick={(e) => { e.stopPropagation(); setPanelView('enrich-config-email'); setActionsPanelOpen(true) }}>
                              <IconSettings size={11} />
                            </button>
                          </span>
                        </span>
                      )}
                    </td>
                    <td>
                      {enrichmentState[contact.id]?.phone === 'loading' ? (
                        <span className="search-enriching">
                          <span className="search-enriching-spinner" />
                          <span className="text-caption text-secondary">Verifying…</span>
                        </span>
                      ) : enrichmentState[contact.id]?.phone && enrichmentState[contact.id]?.phone !== 'loading' ? (
                        <span className="search-email-revealed-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-enrich-popover', 8, false)}>
                          <span className={`search-email-revealed ${(enrichmentState[contact.id]!.phone as EnrichmentResult).finalStatus === 'verified' ? 'search-email-verified' : 'search-email-unverified'}`}>
                            <IconCheck size={12} className={`search-email-status-icon ${(enrichmentState[contact.id]!.phone as EnrichmentResult).finalStatus === 'verified' ? 'search-email-verified-icon' : 'search-email-unverified-icon'}`} />
                            <span className="text-body-sm">{(enrichmentState[contact.id]!.phone as EnrichmentResult).finalResult}</span>
                          </span>
                          <div className="search-enrich-popover">
                            <div className="search-enrich-popover-title text-caption font-medium">Enrichment log</div>
                            <div className="search-enrich-popover-waterfall">
                              {(enrichmentState[contact.id]!.phone as EnrichmentResult).sources.filter(s => s.status !== 'skipped').map((s, i) => (
                                <span key={s.name} className="search-enrich-popover-wf-step">
                                  {i > 0 && <span className="search-enrich-popover-wf-arrow">&rarr;</span>}
                                  <span className={`search-enrich-popover-wf-node search-enrich-popover-wf-${s.status}`}>{s.name} {s.status === 'found' ? '✓' : '✗'}</span>
                                </span>
                              ))}
                            </div>
                            <div className="search-enrich-popover-details">
                              <span className="text-caption text-secondary">Found by: <strong className="text-primary">{(enrichmentState[contact.id]!.phone as EnrichmentResult).sources.find(s => s.status === 'found')?.name}</strong></span>
                              {(enrichmentState[contact.id]!.phone as EnrichmentResult).validation && (
                                <span className="text-caption text-secondary">Validated by: <strong className="text-primary">{(enrichmentState[contact.id]!.phone as EnrichmentResult).validation!.provider}</strong></span>
                              )}
                            </div>
                            <div className="search-enrich-popover-footer text-caption">
                              <span className={`search-enrich-popover-badge search-enrich-popover-badge-${(enrichmentState[contact.id]!.phone as EnrichmentResult).finalStatus}`}>
                                {(enrichmentState[contact.id]!.phone as EnrichmentResult).finalStatus === 'verified' ? 'Verified' : 'Unverified'}
                              </span>
                              <span className="text-tertiary">{(enrichmentState[contact.id]!.phone as EnrichmentResult).totalCredits} credits used</span>
                            </div>
                          </div>
                        </span>
                      ) : (
                        <span className="search-access-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-access-tooltip')}>
                          <button className="search-access-btn" onClick={() => handleEnrich(contact.id, 'phone')}>
                            <IconLock size={12} />
                            <span>Access mobile</span>
                          </button>
                          <span className="search-access-tooltip">
                            <span>8–18 credits per record</span>
                            <button className="search-access-tooltip-link" onClick={(e) => { e.stopPropagation(); { setPanelView('enrich-config-phone'); setActionsPanelOpen(true) } }}>Configure</button>
                          </span>
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="search-signals">
                        {contact.signals.map((signal) => (
                          <span key={signal} className={`search-signal search-signal-${signal === 'High ICP fit' ? 'icp' : signal === 'Hiring' ? 'hiring' : signal === 'Funding' ? 'funding' : signal === 'Tech change' ? 'tech' : 'activity'}`}>
                            {signal}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {isContactSaved(contact.id) ? (
                        <Badge variant={contact.freshness.includes('1 day') || contact.freshness.includes('2 day') ? 'green' : 'gray'} size="sm">
                          {contact.freshness}
                        </Badge>
                      ) : (
                        <span className="search-save-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-access-tooltip', 0)}>
                          <button className="search-save-btn" onClick={() => handleEnrich(contact.id, 'email')}>
                            Save &amp; run
                          </button>
                          <span className="search-access-tooltip search-access-tooltip-email">
                            <span>1–6 credits per record</span>
                            <button className="search-access-tooltip-gear" onClick={(e) => { e.stopPropagation(); setPanelView('enrich-config-email'); setActionsPanelOpen(true) }}>
                              <IconSettings size={11} />
                            </button>
                          </span>
                        </span>
                      )}
                    </td>
                    <td>
                      {isContactSaved(contact.id) ? (
                        contact.verified ? (
                          <span className="search-verified"><IconCheck size={12} /> Verified</span>
                        ) : (
                          <span className="text-caption text-tertiary">Unverified</span>
                        )
                      ) : (
                        <span className="search-save-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-access-tooltip', 0)}>
                          <button className="search-save-btn" onClick={() => handleEnrich(contact.id, 'email')}>
                            Save &amp; run
                          </button>
                          <span className="search-access-tooltip search-access-tooltip-email">
                            <span>1–6 credits per record</span>
                            <button className="search-access-tooltip-gear" onClick={(e) => { e.stopPropagation(); setPanelView('enrich-config-email'); setActionsPanelOpen(true) }}>
                              <IconSettings size={11} />
                            </button>
                          </span>
                        </span>
                      )}
                    </td>
                    <td>
                      {isContactSaved(contact.id) ? (
                        <div className="search-reach">
                          <div className="search-reach-bar">
                            <div className="search-reach-fill" style={{ width: `${contact.reachability}%` }} />
                          </div>
                          <span className="text-caption">{contact.reachability}%</span>
                        </div>
                      ) : (
                        <span className="search-save-wrap" onMouseEnter={(e) => posFixedAbove(e, '.search-access-tooltip', 0)}>
                          <button className="search-save-btn" onClick={() => handleEnrich(contact.id, 'email')}>
                            Save &amp; run
                          </button>
                          <span className="search-access-tooltip search-access-tooltip-email">
                            <span>1–6 credits per record</span>
                            <button className="search-access-tooltip-gear" onClick={(e) => { e.stopPropagation(); setPanelView('enrich-config-email'); setActionsPanelOpen(true) }}>
                              <IconSettings size={11} />
                            </button>
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="text-caption text-tertiary">Click to run...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination inside the frame */}
          <div className="search-pagination">
            <button className="search-page-btn"><IconChevronLeft size={14} /></button>
            <span className="text-body-sm font-medium">1</span>
            <button className="search-page-btn"><IconChevronRight size={14} /></button>
            <span className="text-caption text-secondary" style={{ marginLeft: 'var(--space-2)' }}>
              1 - 25 of 126,222
            </span>
            {hiddenColCount > 0 && (
              <span className="search-overflow-counter">
                <IconChevronRight size={12} />
                {hiddenColCount} column{hiddenColCount !== 1 ? 's' : ''} out of view
              </span>
            )}
          </div>
        </div>
      </div>

      {showSendingOverlay && (
        <SendingOverlay
          contactName={sendingContact}
          onBackToSearch={() => setShowSendingOverlay(false)}
          onViewInbox={() => {
            setShowSendingOverlay(false)
            promoteItem('emails')
            navigate('/emails')
          }}
        />
      )}

    </PageLayout>
  )
}
