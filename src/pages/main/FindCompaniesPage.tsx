import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockCompanies } from '@/data/mockCompanies'
import { useSidebar } from '@/contexts/SidebarContext'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import PageLayout from '@/components/shared/PageLayout'
import ActionsPanel, { type ActionGroup } from '@/components/shared/ActionsPanel'
import EmailComposeDrawer from '@/components/shared/EmailComposeDrawer'
import SendingOverlay from '@/components/shared/SendingOverlay'
import {
  IconSearch,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconTrending,
  IconClock,
  IconPeople,
  IconBookmark,
  IconStar,
  IconDataEnrich,
  IconSparkle,
  IconSequence,
  IconMail,
  IconChart,
  IconGlobe,
  IconSpreadsheet,
  IconWorkflows,
  IconRobot,
} from '@/components/shared/Icons'
import '../main/SearchPage.css'

const filterSections = [
  'Industry',
  'Number of employees',
  'Revenue',
  'Location',
  'Buying intent',
  'Technologies',
  'Funding stage',
]

const companySuggestedGroups: ActionGroup[] = [
  {
    label: 'Prospect',
    items: [
      { icon: <IconPeople size={15} />, label: 'Find people at these companies', desc: 'Discover contacts at selected accounts', id: 'find-people-companies' },
      { icon: <IconBookmark size={15} />, label: 'Add to list', desc: 'Save to an existing or new list', id: 'add-to-list' },
      { icon: <IconStar size={15} />, label: 'Save search', desc: 'Re-run this search later', id: 'save-search' },
    ],
  },
  {
    label: 'Enrich & Research',
    items: [
      { icon: <IconDataEnrich size={15} />, label: 'Enrich with Apollo', desc: 'Fill missing data fields', id: 'enrich' },
      { icon: <IconSparkle size={15} />, label: 'Research with AI', desc: 'Deep research on companies', id: 'research-ai' },
      { icon: <IconChart size={15} />, label: 'Recent funding', desc: 'Track funding events', id: 'recent-funding' },
    ],
  },
  {
    label: 'Outreach',
    items: [
      { icon: <IconSequence size={15} />, label: 'Add to sequence', desc: 'Enroll contacts at these companies', id: 'add-to-sequence' },
      { icon: <IconMail size={15} />, label: 'Email', desc: 'Send a one-off email', id: 'email' },
    ],
  },
]

const companyAdvancedGroups: ActionGroup[] = [
  {
    label: 'Data sources',
    items: [
      { icon: <IconPeople size={15} />, label: 'Search for people', id: 'search-people' },
      { icon: <IconGlobe size={15} />, label: 'Search via external URL', id: 'search-url' },
      { icon: <IconSpreadsheet size={15} />, label: 'Import from CSV', id: 'import-csv' },
    ],
  },
  {
    label: 'Enrichments',
    items: [
      { icon: <IconDataEnrich size={15} />, label: 'Enrich person', desc: 'Company identity match', id: 'enrich-person' },
      { icon: <IconChart size={15} />, label: 'Job change tracking', desc: 'Monitor role changes', id: 'job-change' },
      { icon: <IconSparkle size={15} />, label: 'Qualification agent', desc: 'Qualify against ICP', id: 'qualification-agent' },
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
      { icon: <IconGlobe size={15} />, label: 'Push to CRM', id: 'push-crm' },
    ],
  },
]

export default function FindCompaniesPage() {
  const navigate = useNavigate()
  const { promoteItem, setUserCollapsed } = useSidebar()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [actionsPanelOpen, setActionsPanelOpen] = useState(false)
  const [panelView, setPanelView] = useState<'actions' | 'email'>('actions')
  const [showSendingOverlay, setShowSendingOverlay] = useState(false)
  const [sendingContact, setSendingContact] = useState('')

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

  const toggleAll = () => {
    if (selectedRows.length === mockCompanies.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(mockCompanies.map((c) => c.id))
    }
  }

  // Auto-open actions panel when rows are selected
  useEffect(() => {
    if (selectedRows.length > 0 && !actionsPanelOpen) {
      setActionsPanelOpen(true)
    }
  }, [selectedRows.length])

  const sidebar = (
    <>
      <div className="search-filters-controls">
        <div className="search-view-selector">
          <span className="text-body-sm">Default view</span>
          <IconChevronDown size={14} />
        </div>
      </div>

      <Input
        placeholder="Search companies"
        sizeVariant="sm"
        iconLeft={<IconSearch size={14} />}
      />

      <div className="search-stats">
        <div className="search-stat">
          <span className="text-caption text-secondary">Total</span>
          <span className="text-body-sm font-medium">73.2M</span>
        </div>
        <div className="search-stat">
          <span className="text-caption text-secondary">Net New</span>
          <span className="text-body-sm font-medium">73.2M</span>
        </div>
        <div className="search-stat">
          <span className="text-caption text-secondary">Saved</span>
          <span className="text-body-sm font-medium">0</span>
        </div>
      </div>

      <div className="search-filter-list">
        {filterSections.map((section) => (
          <button key={section} className="search-filter-item">
            <span className="text-body-sm">{section}</span>
            <IconChevronRight size={14} />
          </button>
        ))}
      </div>

      <div className="search-filter-actions">
        <button className="text-body-sm" style={{ color: 'var(--color-text-link)' }}>
          <IconPlus size={14} /> Add filter
        </button>
        <button className="text-caption text-secondary">Reset all</button>
      </div>
    </>
  )

  return (
    <PageLayout
      title="Companies"
      titleExtra={
        <div className="search-liveness">
          <span className="search-liveness-dot" />
          <span className="text-caption text-secondary">
            <strong>6</strong> new companies match &middot; <strong>14</strong> signals detected &middot; Updated 8m ago
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
              const firstId = selectedRows[0]
              const c = firstId != null ? mockCompanies.find(mc => mc.id === firstId) : undefined
              setSendingContact(c?.name ?? 'your contact')
              setShowSendingOverlay(true)
              setTimeout(() => {
                setPanelView('actions')
                setActionsPanelOpen(false)
              }, 400)
            }}
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
              } else if (id === 'search-people' || id === 'find-people-companies') {
                navigate('/search')
              } else {
                setActionsPanelOpen(false)
              }
            }}
            selectedCount={selectedRows.length}
            onDeselect={() => setSelectedRows([])}
            suggestedGroups={companySuggestedGroups}
            advancedGroups={companyAdvancedGroups}
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
          <div className="search-table-wrapper">
            <table className="search-table">
              <thead>
                <tr>
                  <th className="search-th-check">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === mockCompanies.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Employees</th>
                  <th>Revenue</th>
                  <th>Signals</th>
                  <th>
                    <button className="search-add-col text-caption" style={{ color: 'var(--color-text-link)' }}>
                      + Add columns
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockCompanies.map((company) => (
                  <tr key={company.id} className={selectedRows.includes(company.id) ? 'search-row-selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(company.id)}
                        onChange={() => toggleRow(company.id)}
                      />
                    </td>
                    <td>
                      <div className="search-cell-name">
                        <div className="search-cell-name-row">
                          <span className="text-body-sm font-medium">{company.name}</span>
                          {company.trending && (
                            <span className="search-trending-badge">
                              <IconTrending size={10} />
                              Trending
                            </span>
                          )}
                        </div>
                        <div className="search-cell-meta">
                          <span className="text-caption text-secondary">{company.location}</span>
                          {company.updatedAgo && (
                            <span className="search-updated">
                              <IconClock size={10} />
                              {company.updatedAgo}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-body-sm text-secondary">{company.industry}</td>
                    <td className="text-body-sm text-secondary">{company.employees}</td>
                    <td className="text-body-sm text-secondary">{company.revenue}</td>
                    <td>
                      <div className="search-signals">
                        {company.signals.map((signal) => (
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

          <div className="search-pagination">
            <button className="search-page-btn"><IconChevronLeft size={14} /></button>
            <span className="text-body-sm font-medium">1</span>
            <button className="search-page-btn"><IconChevronRight size={14} /></button>
            <span className="text-caption text-secondary" style={{ marginLeft: 'var(--space-2)' }}>
              1 - 25 of 73,201
            </span>
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
