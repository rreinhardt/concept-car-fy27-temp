import { useState } from 'react'
import Input from './Input'
import {
  IconSearch,
  IconClose,
  IconMail,
  IconSequence,
  IconBookmark,
  IconSparkle,
  IconDataEnrich,
  IconWorkflows,
  IconRobot,
  IconPhone,
  IconGlobe,
  IconPeople,
  IconBuilding,
  IconSpreadsheet,
  IconChart,
  IconTag,
  IconFilter,
  IconStar,
  IconPlus,
} from './Icons'
import './ActionsPanel.css'

export interface ActionItemDef {
  icon: React.ReactNode
  label: string
  desc?: string
  id: string
}

export interface ActionGroup {
  label?: string
  items: ActionItemDef[]
}

interface ActionsPanelProps {
  onClose: () => void
  onAction?: (action: string) => void
  selectedCount?: number
  onDeselect?: () => void
  suggestedGroups?: ActionGroup[]
  advancedGroups?: ActionGroup[]
}

const defaultSuggestedGroups: ActionGroup[] = [
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
  {
    label: 'Import & Export',
    items: [
      { icon: <IconPlus size={15} />, label: 'Import', desc: 'CSV, API, or webhook', id: 'import' },
      { icon: <IconSpreadsheet size={15} />, label: 'Export', desc: 'Download as CSV or push to tools', id: 'export' },
    ],
  },
]

const defaultAdvancedGroups: ActionGroup[] = [
  {
    label: 'Data sources',
    items: [
      { icon: <IconPeople size={15} />, label: 'Search for people', id: 'search-people' },
      { icon: <IconBuilding size={15} />, label: 'Search for companies', id: 'search-companies' },
      { icon: <IconGlobe size={15} />, label: 'Search via external URL', id: 'search-url' },
      { icon: <IconPeople size={15} />, label: 'Find people at these companies', id: 'find-people-companies' },
      { icon: <IconSpreadsheet size={15} />, label: 'Import from CSV', id: 'import-csv' },
    ],
  },
  {
    label: 'Enrichments',
    items: [
      { icon: <IconDataEnrich size={15} />, label: 'Enrich person', desc: 'Company identity match', id: 'enrich-person' },
      { icon: <IconMail size={15} />, label: 'Enrich email', desc: 'Email by identifier', id: 'enrich-email' },
      { icon: <IconSparkle size={15} />, label: 'Research agent', desc: 'Full-scale AI research', id: 'research-agent' },
      { icon: <IconSparkle size={15} />, label: 'Qualification agent', desc: 'Qualify against ICP', id: 'qualification-agent' },
      { icon: <IconChart size={15} />, label: 'Job change tracking', desc: 'Monitor role changes', id: 'job-change' },
      { icon: <IconChart size={15} />, label: 'Recent funding', desc: 'Track funding events', id: 'recent-funding' },
    ],
  },
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
      { icon: <IconWorkflows size={15} />, label: 'Push to Workflows', id: 'push-workflows' },
      { icon: <IconGlobe size={15} />, label: 'Export rows to Apollo', id: 'export-apollo' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { icon: <IconGlobe size={15} />, label: 'Salesforce', id: 'salesforce' },
      { icon: <IconGlobe size={15} />, label: 'HubSpot', id: 'hubspot' },
      { icon: <IconGlobe size={15} />, label: 'Google Sheets', id: 'gsheets' },
      { icon: <IconGlobe size={15} />, label: 'Notion', id: 'notion' },
      { icon: <IconGlobe size={15} />, label: 'Airtable', id: 'airtable' },
    ],
  },
]

export default function ActionsPanel({ onClose, onAction, selectedCount = 0, onDeselect, suggestedGroups, advancedGroups }: ActionsPanelProps) {
  const [tab, setTab] = useState<'suggested' | 'advanced'>('suggested')
  const [query, setQuery] = useState('')

  const groups = tab === 'suggested'
    ? (suggestedGroups ?? defaultSuggestedGroups)
    : (advancedGroups ?? defaultAdvancedGroups)

  const filtered = query.trim()
    ? groups.map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            (item.desc && item.desc.toLowerCase().includes(query.toLowerCase()))
        ),
      })).filter((g) => g.items.length > 0)
    : groups

  return (
    <div className="ap-panel">
      <div className="ap-header">
        <span className="text-subtitle-lg">Actions</span>
        <button className="ap-close" onClick={onClose}>
          <IconClose size={16} />
        </button>
      </div>

      {selectedCount > 0 && (
        <div className="ap-selection-bar">
          <span className="ap-selection-count">{selectedCount} selected</span>
          <button className="ap-selection-clear text-caption" onClick={onDeselect}>
            Clear
          </button>
        </div>
      )}

      <Input
        placeholder="Search actions..."
        sizeVariant="sm"
        iconLeft={<IconSearch size={14} />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="ap-tabs">
        <button
          className={`ap-tab ${tab === 'suggested' ? 'ap-tab-active' : ''}`}
          onClick={() => setTab('suggested')}
        >
          Suggested
        </button>
        <button
          className={`ap-tab ${tab === 'advanced' ? 'ap-tab-active' : ''}`}
          onClick={() => setTab('advanced')}
        >
          Advanced
        </button>
      </div>

      <div className="ap-body">
        {filtered.map((group, i) => (
          <div key={group.label ?? i} className="ap-group">
            {group.label && <span className="ap-group-label text-caption text-tertiary">{group.label}</span>}
            <div className="ap-group-items">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className="ap-item"
                  onClick={() => onAction?.(item.id)}
                >
                  <span className="ap-item-icon">{item.icon}</span>
                  <div className="ap-item-text">
                    <span className="text-body-sm">{item.label}</span>
                    {item.desc && <span className="text-caption text-tertiary">{item.desc}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="ap-empty text-body-sm text-tertiary">
            No actions match "{query}"
          </div>
        )}
      </div>
    </div>
  )
}
