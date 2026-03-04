import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockContacts } from '@/data/mockContacts'
import { useSidebar } from '@/contexts/SidebarContext'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import PageLayout from '@/components/shared/PageLayout'
import Badge from '@/components/shared/Badge'
import ActionsPanel, { type ActionGroup } from '@/components/shared/ActionsPanel'
import EmailComposeDrawer from '@/components/shared/EmailComposeDrawer'
import SendingOverlay from '@/components/shared/SendingOverlay'
import {
  IconSearch,
  IconFilter,
  IconLock,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconTrending,
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
} from '@/components/shared/Icons'
import './SearchPage.css'

const filterSections: { label: string; count?: number; locked?: boolean }[] = [
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

export default function SearchPage() {
  const navigate = useNavigate()
  const { promoteItem, setUserCollapsed } = useSidebar()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [actionsPanelOpen, setActionsPanelOpen] = useState(false)
  const [panelView, setPanelView] = useState<'actions' | 'email'>('actions')
  const [hiddenColCount, setHiddenColCount] = useState(0)
  const [showSendingOverlay, setShowSendingOverlay] = useState(false)
  const [sendingContact, setSendingContact] = useState('')
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
    if (selectedRows.length === mockContacts.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(mockContacts.map((c) => c.id))
    }
  }

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
        {filterSections.map((section) => (
          <button key={section.label} className={`search-filter-item${section.locked ? ' search-filter-item-locked' : ''}`}>
            <span className="text-body-sm">{section.label}</span>
            <span className="search-filter-item-right">
              {section.count && <Badge variant="blue" size="sm">{section.count}</Badge>}
              {section.locked ? <IconLock size={13} className="search-filter-lock" /> : <IconChevronRight size={14} />}
            </span>
          </button>
        ))}
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
        panelView === 'email' ? (
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
              if (id === 'email') {
                setPanelView('email')
              } else if (id === 'add-to-sequence') {
                navigate('/sequences')
              } else if (id === 'add-to-list') {
                navigate('/save-to-list')
              } else if (id === 'enrich') {
                navigate('/review')
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
      actionsPanelOpen={actionsPanelOpen}
      actionsPanelWidth={panelView === 'email' ? 680 : undefined}
      actionsBtnVariant={panelView === 'email' ? 'secondary' : 'primary'}
      collapseSidebar={panelView === 'email'}
      onActionsPanelToggle={(open) => {
        setActionsPanelOpen(open)
        if (!open) setPanelView('actions')
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
                      checked={selectedRows.length === mockContacts.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Job Title</th>
                  <th>Emails</th>
                  <th>Phone Numbers</th>
                  <th>Signals</th>
                  <th>
                    <button className="search-add-col text-caption" style={{ color: 'var(--color-text-link)' }}>
                      + Add columns
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockContacts.map((contact) => (
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
                          {contact.trending && (
                            <span className="search-trending-badge">
                              <IconTrending size={10} />
                              Trending
                            </span>
                          )}
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
                      <button className="search-access-btn">
                        <IconLock size={12} />
                        <span>Access email</span>
                      </button>
                    </td>
                    <td>
                      <button className="search-access-btn">
                        <IconLock size={12} />
                        <span>Access mobile</span>
                      </button>
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
