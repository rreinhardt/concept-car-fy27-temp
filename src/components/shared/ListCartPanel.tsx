import { useState } from 'react'
import { emailEnrichmentConfig } from '@/data/mockEnrichment'
import Button from '@/components/shared/Button'
import WaterfallPreview from '@/components/shared/WaterfallPreview'
import { IconChevronLeft, IconClose, IconCheck, IconPlus, IconChevronRight, IconCoin, IconInfo } from '@/components/shared/Icons'
import './SaveCartPanel.css'
import './ListCartPanel.css'

const mockLists = [
  { id: 1, name: 'My prospects', count: 24 },
  { id: 2, name: 'ICP Security', count: 18 },
  { id: 3, name: 'ICP Furniture', count: 12 },
]

interface ListCartPanelProps {
  selectedCount: number
  selectedContacts: Array<{ id: number; emailAvailability?: string }>
  enrichmentState: Record<number, { email?: 'loading' | any; phone?: 'loading' | any }>
  emailApproach: 'verified' | 'any'
  emailValidation: boolean
  onBack: () => void
  onClose: () => void
  onConfigEmail: () => void
  onConfirm: () => void
}

export default function ListCartPanel({
  selectedCount,
  selectedContacts,
  enrichmentState,
  emailApproach,
  emailValidation,
  onBack,
  onClose,
  onConfigEmail,
  onConfirm,
}: ListCartPanelProps) {
  const [listExpanded, setListExpanded] = useState(false)
  const [emailStatusExpanded, setEmailStatusExpanded] = useState(false)
  const [enrichmentExpanded, setEnrichmentExpanded] = useState(false)
  const [selectedList, setSelectedList] = useState<number | null>(1)
  const [statusFilter, setStatusFilter] = useState({ verified: true, unverified: true, unavailable: true })
  const [includeCatchAll, setIncludeCatchAll] = useState(true)

  const verifiedCount = selectedContacts.filter(c => c.emailAvailability === 'found-verified').length
  const unverifiedCount = selectedContacts.filter(c => ['found-unverified', 'stale', 'user-managed'].includes(c.emailAvailability ?? '')).length
  const unavailableCount = selectedContacts.filter(c => ['not-found', 'unavailable'].includes(c.emailAvailability ?? '')).length
  const netNewCount = selectedContacts.filter(c => !enrichmentState[c.id]?.email || enrichmentState[c.id]?.email === 'loading').length
  const totalRecords = selectedCount
  const verifiedPct = totalRecords > 0 ? Math.round((verifiedCount / totalRecords) * 100) : 0
  const unverifiedPct = totalRecords > 0 ? Math.round((unverifiedCount / totalRecords) * 100) : 0
  const unavailablePct = totalRecords > 0 ? Math.round((unavailableCount / totalRecords) * 100) : 0

  const emailMin = 1 + (emailValidation ? 1 : 0)
  const emailMax = 5 + (emailValidation ? 1 : 0)

  const enabledSourceCount = emailEnrichmentConfig.sources.filter(s => s.enabled).length

  const toggleStatusFilter = (key: 'verified' | 'unverified' | 'unavailable') => {
    setStatusFilter(prev => ({ ...prev, [key]: !prev[key] }))
  }

  let creditExplanation = ''
  if (emailApproach === 'verified' && emailValidation) {
    creditExplanation = 'Credits are used for each source queried in order. Apollo is checked first (1 cr). If unverified, up to 4 more sources are tried. A final ZeroBounce check confirms deliverability. Only net new records consume credits.'
  } else if (emailApproach === 'verified' && !emailValidation) {
    creditExplanation = 'Credits are used for each source queried. Apollo is checked first (1 cr), then up to 4 more sources until a verified email is found. Only net new records consume credits.'
  } else {
    creditExplanation = 'The search stops at the first email found across up to 5 sources. Credits are used only for sources actually queried. Only net new records consume credits.'
  }

  return (
    <div className="svcp-panel">
      {/* Header */}
      <div className="svcp-header">
        <button className="svcp-back" onClick={onBack}>
          <IconChevronLeft size={16} />
        </button>
        <span className="svcp-title text-body-sm font-medium">Add to list</span>
        <button className="svcp-close" onClick={onClose}>
          <IconClose size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="svcp-body">
        <p className="lcp-count text-caption text-secondary">
          {selectedCount} contact{selectedCount !== 1 ? 's' : ''} selected
        </p>

        {/* List picker accordion */}
        <div className="svcp-accordion svcp-accordion-selection">
          <button
            className="svcp-accordion-header svcp-accordion-header-selection"
            onClick={() => setListExpanded(v => !v)}
          >
            <div className="svcp-accordion-header-main">
              <span className="text-body-sm font-medium">
                {selectedList ? mockLists.find(l => l.id === selectedList)?.name : 'Choose a list'}
              </span>
              {selectedList && (
                <span className="text-caption text-secondary">
                  {mockLists.find(l => l.id === selectedList)?.count} contacts
                </span>
              )}
            </div>
            <IconChevronRight
              size={14}
              className={`svcp-accordion-chevron${listExpanded ? ' svcp-accordion-chevron-open' : ''}`}
            />
          </button>
          {listExpanded && (
            <div className="svcp-accordion-body lcp-list-body">
              {mockLists.map((list) => (
                <button
                  key={list.id}
                  className={`lcp-list-item${selectedList === list.id ? ' lcp-list-item-selected' : ''}`}
                  onClick={() => setSelectedList(selectedList === list.id ? null : list.id)}
                >
                  <div className="lcp-list-info">
                    <span className="text-body-sm font-medium">{list.name}</span>
                    <span className="text-caption text-secondary">{list.count} contacts</span>
                  </div>
                  {selectedList === list.id && (
                    <span className="lcp-list-check">
                      <IconCheck size={14} />
                    </span>
                  )}
                </button>
              ))}
              <button className="lcp-new-list">
                <IconPlus size={13} />
                <span className="text-body-sm">New list</span>
              </button>
            </div>
          )}
        </div>

        {/* Email status accordion */}
        <div className="svcp-accordion">
          <button
            className="svcp-accordion-header"
            onClick={() => setEmailStatusExpanded(v => !v)}
          >
            <div className="svcp-accordion-header-main">
              <span className="text-body-sm font-medium">Email status</span>
              <div className="svcp-email-bar-mini">
                <div className="svcp-email-bar-seg svcp-email-bar-verified" style={{ width: `${verifiedPct}%` }} />
                <div className="svcp-email-bar-seg svcp-email-bar-unverified" style={{ width: `${unverifiedPct}%` }} />
                <div className="svcp-email-bar-seg svcp-email-bar-unavailable" style={{ width: `${unavailablePct}%` }} />
              </div>
              <span className="text-caption text-secondary">{verifiedPct}% verified</span>
            </div>
            <IconChevronRight
              size={14}
              className={`svcp-accordion-chevron${emailStatusExpanded ? ' svcp-accordion-chevron-open' : ''}`}
            />
          </button>
          {emailStatusExpanded && (
            <div className="svcp-accordion-body">
              <div className="svcp-status-checks">
                <label className="svcp-status-check-label text-caption">
                  <input type="checkbox" checked={statusFilter.verified} onChange={() => toggleStatusFilter('verified')} />
                  <span>Verified</span>
                  <span className="svcp-status-check-count text-secondary">{verifiedCount}</span>
                </label>
                <label className="svcp-status-check-label text-caption">
                  <input type="checkbox" checked={statusFilter.unverified} onChange={() => toggleStatusFilter('unverified')} />
                  <span>Unverified</span>
                  <span className="svcp-status-check-count text-secondary">{unverifiedCount}</span>
                </label>
                <label className="svcp-status-check-label text-caption">
                  <input type="checkbox" checked={statusFilter.unavailable} onChange={() => toggleStatusFilter('unavailable')} />
                  <span>Unavailable</span>
                  <span className="svcp-status-check-count text-secondary">{unavailableCount}</span>
                </label>
              </div>
              <div className="svcp-status-divider" />
              <label className="svcp-catchall-label text-caption">
                <input type="checkbox" checked={includeCatchAll} onChange={(e) => setIncludeCatchAll(e.target.checked)} />
                <div className="svcp-catchall-body">
                  <span className="font-medium">Include catch-all emails</span>
                  <span className="text-secondary">Domains that accept all email addresses from that server, whether it exists or not.</span>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Enrichment settings accordion */}
        <div className="svcp-accordion">
          <button
            className="svcp-accordion-header"
            onClick={() => setEnrichmentExpanded(v => !v)}
          >
            <div className="svcp-accordion-header-main">
              <span className="text-body-sm font-medium">Enrichment settings</span>
              <div className="svcp-enrich-pills">
                <span className="svcp-enrich-pill text-caption">{enabledSourceCount} sources</span>
              </div>
              {emailValidation && (
                <span className="text-caption text-secondary">Validation by ZeroBounce</span>
              )}
            </div>
            <IconChevronRight
              size={14}
              className={`svcp-accordion-chevron${enrichmentExpanded ? ' svcp-accordion-chevron-open' : ''}`}
            />
          </button>
          {enrichmentExpanded && (
            <div className="svcp-accordion-body">
              <WaterfallPreview
                emailApproach={emailApproach}
                emailValidation={emailValidation}
                onConfigEmail={onConfigEmail}
              />
            </div>
          )}
        </div>

        {/* Credit summary card */}
        <div className="svcp-credit-card">
          <div className="svcp-credit-card-header text-caption font-medium">Credit summary</div>
          <div className="svcp-credit-metrics">
            <div className="svcp-credit-metric">
              <span className="svcp-credit-metric-value">{totalRecords}</span>
              <span className="svcp-credit-metric-label text-caption text-secondary">records to save</span>
            </div>
            <div className="svcp-credit-metric-divider" />
            <div className="svcp-credit-metric">
              <span className="svcp-credit-metric-value">{netNewCount}</span>
              <span className="svcp-credit-metric-label text-caption text-secondary">net new records</span>
            </div>
          </div>
          <div className="svcp-credit-dashed" />
          <div className="svcp-credit-total-row">
            <span className="svcp-credit-total-label text-caption font-medium">
              Credit total
              <span className="svcp-credit-info-icon"><IconInfo size={12} /></span>
            </span>
            <span className="svcp-credit-total-value text-caption font-medium">
              <IconCoin size={12} /> {netNewCount * emailMin}&ndash;{netNewCount * emailMax}
            </span>
          </div>
          <p className="svcp-credit-explanation text-caption text-secondary">
            {creditExplanation}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="svcp-footer">
        <Button
          variant="primary"
          disabled={!selectedList}
          onClick={onConfirm}
        >
          Save to list
        </Button>
      </div>
    </div>
  )
}
