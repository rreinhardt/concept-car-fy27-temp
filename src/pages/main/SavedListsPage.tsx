import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/shared/PageLayout'
import ActionsPanel, { type ActionGroup } from '@/components/shared/ActionsPanel'
import {
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconPeople,
  IconBuilding,
  IconSequence,
  IconMail,
  IconBookmark,
  IconTag,
  IconDataEnrich,
  IconSparkle,
  IconWorkflows,
  IconRobot,
  IconFilter,
  IconSpreadsheet,
  IconGlobe,
} from '@/components/shared/Icons'
import Input from '@/components/shared/Input'
import '../main/SearchPage.css'
import './SavedListsPage.css'

type ListType = 'all' | 'people' | 'companies' | 'deals'

interface SavedList {
  id: number
  name: string
  type: 'people' | 'companies' | 'deals'
  count: number
  updatedAgo: string
}

interface ListContact {
  id: number
  name: string
  company: string
  title: string
  email: string
}

interface ListCompany {
  id: number
  name: string
  industry: string
  employees: string
  location: string
}

const savedLists: SavedList[] = [
  { id: 1, name: 'ICP Decision Makers — Oncology', type: 'people', count: 342, updatedAgo: '2h ago' },
  { id: 2, name: 'Radiation Oncology Clinics', type: 'companies', count: 89, updatedAgo: '1d ago' },
  { id: 3, name: 'VP+ Engineering — Series B+', type: 'people', count: 156, updatedAgo: '3h ago' },
  { id: 4, name: 'Healthcare IT Vendors', type: 'companies', count: 214, updatedAgo: '5h ago' },
  { id: 5, name: 'Event Leads — ASTRO 2025', type: 'people', count: 78, updatedAgo: '2d ago' },
  { id: 6, name: 'Enterprise Pipeline Q1', type: 'deals', count: 23, updatedAgo: '12h ago' },
  { id: 7, name: 'Competitive Displacement Targets', type: 'people', count: 445, updatedAgo: '6h ago' },
  { id: 8, name: 'Mid-Market Hospitals', type: 'companies', count: 167, updatedAgo: '1d ago' },
  { id: 9, name: 'Warm Nurture — Re-engage', type: 'people', count: 231, updatedAgo: '4h ago' },
  { id: 10, name: 'Open Deals — Closing This Month', type: 'deals', count: 12, updatedAgo: '1h ago' },
]

const mockListContacts: ListContact[] = [
  { id: 1, name: 'Dr. Sarah Chen', company: 'Memorial Sloan Kettering', title: 'Chief of Radiation Oncology', email: 's.chen@msk.org' },
  { id: 2, name: 'James Rodriguez', company: 'MD Anderson', title: 'VP Clinical Operations', email: 'j.rodriguez@mdanderson.org' },
  { id: 3, name: 'Dr. Emily Walsh', company: 'Mayo Clinic', title: 'Director, Radiation Therapy', email: 'e.walsh@mayo.edu' },
  { id: 4, name: 'Michael Thompson', company: 'Cleveland Clinic', title: 'Head of Oncology IT', email: 'm.thompson@ccf.org' },
  { id: 5, name: 'Dr. Priya Patel', company: 'Johns Hopkins', title: 'Radiation Oncologist', email: 'p.patel@jhmi.edu' },
  { id: 6, name: 'Robert Kim', company: 'UCSF Medical', title: 'VP Medical Technology', email: 'r.kim@ucsf.edu' },
  { id: 7, name: 'Lisa Nakamura', company: 'Stanford Health', title: 'Director of Operations', email: 'l.nakamura@stanford.edu' },
  { id: 8, name: 'Dr. David Okafor', company: 'Dana-Farber', title: 'Senior Radiation Oncologist', email: 'd.okafor@dfci.harvard.edu' },
]

const mockListCompanies: ListCompany[] = [
  { id: 1, name: 'Memorial Sloan Kettering', industry: 'Healthcare', employees: '21,000+', location: 'New York, NY' },
  { id: 2, name: 'MD Anderson Cancer Center', industry: 'Healthcare', employees: '22,000+', location: 'Houston, TX' },
  { id: 3, name: 'Mayo Clinic', industry: 'Healthcare', employees: '76,000+', location: 'Rochester, MN' },
  { id: 4, name: 'Varian Medical Systems', industry: 'Medical Devices', employees: '10,000+', location: 'Palo Alto, CA' },
  { id: 5, name: 'Elekta', industry: 'Medical Devices', employees: '4,700+', location: 'Stockholm, SE' },
  { id: 6, name: 'ViewRay', industry: 'Medical Devices', employees: '800+', location: 'Denver, CO' },
]

const typeLabels: Record<ListType, string> = {
  all: 'All',
  people: 'People',
  companies: 'Companies',
  deals: 'Deals',
}

const typeIcons: Record<string, React.ReactNode> = {
  people: <IconPeople size={12} />,
  companies: <IconBuilding size={12} />,
  deals: <span style={{ fontSize: 12 }}>$</span>,
}

const listSuggestedGroups: ActionGroup[] = [
  {
    label: 'Outreach',
    items: [
      { icon: <IconSequence size={15} />, label: 'Add to sequence', desc: 'Enroll selected contacts', id: 'add-to-sequence' },
      { icon: <IconMail size={15} />, label: 'Email', desc: 'Send a one-off email', id: 'email' },
    ],
  },
  {
    label: 'Organize',
    items: [
      { icon: <IconBookmark size={15} />, label: 'Add to another list', desc: 'Copy to a different list', id: 'add-to-list' },
      { icon: <IconPeople size={15} />, label: 'Remove from list', desc: 'Remove selected records', id: 'remove-from-list' },
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

const listAdvancedGroups: ActionGroup[] = [
  {
    label: 'Automation',
    items: [
      { icon: <IconWorkflows size={15} />, label: 'Create Workflow', desc: 'Build automation rules', id: 'create-workflow' },
      { icon: <IconRobot size={15} />, label: 'Run AI agent', desc: 'Execute an agent task', id: 'run-agent' },
      { icon: <IconFilter size={15} />, label: 'Create criteria', desc: 'Dynamic filter rules', id: 'create-criteria' },
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
  {
    label: 'Integrations',
    items: [
      { icon: <IconGlobe size={15} />, label: 'Salesforce', id: 'salesforce' },
      { icon: <IconGlobe size={15} />, label: 'HubSpot', id: 'hubspot' },
    ],
  },
]

export default function SavedListsPage() {
  const navigate = useNavigate()
  const [filterType, setFilterType] = useState<ListType>('all')
  const [selectedId, setSelectedId] = useState(savedLists[0].id)
  const [actionsPanelOpen, setActionsPanelOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // Auto-open actions when rows selected
  useEffect(() => {
    if (selectedRows.length > 0 && !actionsPanelOpen) {
      setActionsPanelOpen(true)
    }
  }, [selectedRows.length])

  const filteredLists = filterType === 'all'
    ? savedLists
    : savedLists.filter((l) => l.type === filterType)

  const selected = savedLists.find((l) => l.id === selectedId)!

  const sidebar = (
    <>
      <div className="lists-type-tabs">
        {(Object.keys(typeLabels) as ListType[]).map((type) => (
          <button
            key={type}
            className={`lists-type-tab text-caption ${filterType === type ? 'lists-type-tab-active' : ''}`}
            onClick={() => setFilterType(type)}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      <Input
        placeholder="Search lists"
        sizeVariant="sm"
        iconLeft={<IconSearch size={14} />}
      />

      <div className="lists-sidebar-items">
        {filteredLists.map((list) => (
          <button
            key={list.id}
            className={`lists-sidebar-item ${selectedId === list.id ? 'lists-sidebar-item-active' : ''}`}
            onClick={() => setSelectedId(list.id)}
          >
            <span className="lists-sidebar-item-icon">
              {typeIcons[list.type]}
            </span>
            <div className="lists-sidebar-item-content">
              <span className="text-body-sm">{list.name}</span>
              <span className="text-caption text-tertiary">{list.count} records &middot; {list.updatedAgo}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  )

  return (
    <PageLayout
      title="Saved Lists"
      titleExtra={
        <div className="search-liveness">
          <span className="text-caption text-secondary">
            <strong>{savedLists.length}</strong> lists &middot; <strong>{savedLists.reduce((sum, l) => sum + l.count, 0).toLocaleString()}</strong> total records
          </span>
        </div>
      }
      sidebar={sidebar}
      sidebarLabel="Lists"
      actionsPanel={
        <ActionsPanel
          onClose={() => setActionsPanelOpen(false)}
          onAction={(id) => {
            if (id === 'add-to-sequence') navigate('/sequences')
            else if (id === 'add-to-list') navigate('/save-to-list')
            else if (id === 'enrich') navigate('/review')
            else setActionsPanelOpen(false)
          }}
          selectedCount={selectedRows.length}
          onDeselect={() => setSelectedRows([])}
          suggestedGroups={listSuggestedGroups}
          advancedGroups={listAdvancedGroups}
        />
      }
      actionsPanelOpen={actionsPanelOpen}
      onActionsPanelToggle={setActionsPanelOpen}
    >
      <div className="search-table-frame">
        <div className="lists-table-header">
          <div className="lists-table-header-left">
            <h3 className="text-title-sm">{selected.name}</h3>
            <span className="text-caption text-tertiary">{selected.count} records &middot; Updated {selected.updatedAgo}</span>
          </div>
          <span className="lists-type-badge text-caption">
            {typeIcons[selected.type]}
            {selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}
          </span>
        </div>

        <div className="search-table-wrapper">
          {selected.type === 'companies' ? (
            <table className="search-table">
              <thead>
                <tr>
                  <th className="search-th-check"><input type="checkbox" onChange={() => {
                    const items = selected.type === 'companies' ? mockListCompanies : mockListContacts
                    setSelectedRows(prev => prev.length === items.length ? [] : items.map(i => i.id))
                  }} /></th>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Employees</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {mockListCompanies.map((company) => (
                  <tr key={company.id}>
                    <td><input type="checkbox" onChange={() => setSelectedRows(prev => prev.includes(company.id) ? prev.filter(r => r !== company.id) : [...prev, company.id])} checked={selectedRows.includes(company.id)} /></td>
                    <td><span className="text-body-sm font-medium">{company.name}</span></td>
                    <td className="text-body-sm text-secondary">{company.industry}</td>
                    <td className="text-body-sm text-secondary">{company.employees}</td>
                    <td className="text-body-sm text-secondary">{company.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="search-table">
              <thead>
                <tr>
                  <th className="search-th-check"><input type="checkbox" onChange={() => {
                    const items = selected.type === 'companies' ? mockListCompanies : mockListContacts
                    setSelectedRows(prev => prev.length === items.length ? [] : items.map(i => i.id))
                  }} /></th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {mockListContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td><input type="checkbox" onChange={() => setSelectedRows(prev => prev.includes(contact.id) ? prev.filter(r => r !== contact.id) : [...prev, contact.id])} checked={selectedRows.includes(contact.id)} /></td>
                    <td><span className="text-body-sm font-medium">{contact.name}</span></td>
                    <td className="text-body-sm text-secondary">{contact.company}</td>
                    <td className="text-body-sm text-secondary">{contact.title}</td>
                    <td className="text-body-sm text-secondary">{contact.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="search-pagination">
          <button className="search-page-btn"><IconChevronLeft size={14} /></button>
          <span className="text-body-sm font-medium">1</span>
          <button className="search-page-btn"><IconChevronRight size={14} /></button>
          <span className="text-caption text-secondary" style={{ marginLeft: 'var(--space-2)' }}>
            1 - 25 of {selected.count}
          </span>
        </div>
      </div>
    </PageLayout>
  )
}
