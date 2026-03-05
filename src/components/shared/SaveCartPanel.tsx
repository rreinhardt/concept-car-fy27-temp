import { useState, useRef, useEffect } from 'react'
import { mockSequences } from '@/data/mockSequences'
import { emailEnrichmentConfig } from '@/data/mockEnrichment'
import Button from '@/components/shared/Button'
import WaterfallPreview from '@/components/shared/WaterfallPreview'
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconCheck,
  IconInfo,
  IconCoin,
} from '@/components/shared/Icons'
import './SaveCartPanel.css'

const mockLists = [
  { id: 1, name: 'My prospects', count: 24, lastAdded: '2 days ago' },
  { id: 2, name: 'ICP Security', count: 18, lastAdded: '1 week ago' },
  { id: 3, name: 'ICP Furniture', count: 12, lastAdded: '3 weeks ago' },
]

interface SaveCartPanelProps {
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

export default function SaveCartPanel({
  selectedCount,
  selectedContacts,
  enrichmentState,
  emailApproach,
  emailValidation,
  onBack,
  onClose,
  onConfigEmail,
  onConfirm,
}: SaveCartPanelProps) {
  const [emailStatusExpanded, setEmailStatusExpanded] = useState(false)
  const [enrichmentExpanded, setEnrichmentExpanded] = useState(false)
  const [includeCatchAll, setIncludeCatchAll] = useState(true)
  const [statusFilter, setStatusFilter] = useState({ verified: true, unverified: true, unavailable: true })
  const [addToList, setAddToList] = useState(false)
  const [addToSeq, setAddToSeq] = useState(false)
  const [selectedList, setSelectedList] = useState<number>(1)
  const [selectedSeq, setSelectedSeq] = useState<number>(1)
  const [listPopoverOpen, setListPopoverOpen] = useState(false)
  const [seqPopoverOpen, setSeqPopoverOpen] = useState(false)
  const listBtnRef = useRef<HTMLButtonElement>(null)
  const seqBtnRef = useRef<HTMLButtonElement>(null)
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const [seqPopoverPos, setSeqPopoverPos] = useState<{ top: number; left: number; width: number } | null>(null)

  // Email status counts
  const verifiedCount = selectedContacts.filter(c =>
    c.emailAvailability === 'found-verified').length
  const unverifiedCount = selectedContacts.filter(c =>
    ['found-unverified', 'stale', 'user-managed'].includes(c.emailAvailability ?? '')).length
  const unavailableCount = selectedContacts.filter(c =>
    ['not-found', 'unavailable'].includes(c.emailAvailability ?? '')).length

  // Net new = contacts not yet enriched
  const netNewCount = selectedContacts.filter(c =>
    !enrichmentState[c.id]?.email || enrichmentState[c.id]?.email === 'loading').length

  // Credit range (email only)
  const emailMin = 1 + (emailValidation ? 1 : 0)
  const emailMax = 5 + (emailValidation ? 1 : 0)
  const enabledSourceCount = emailEnrichmentConfig.sources.filter(s => s.enabled).length

  const totalRecords = selectedCount
  const verifiedPct = totalRecords > 0 ? Math.round((verifiedCount / totalRecords) * 100) : 0
  const unverifiedPct = totalRecords > 0 ? Math.round((unverifiedCount / totalRecords) * 100) : 0
  const unavailablePct = totalRecords > 0 ? Math.round((unavailableCount / totalRecords) * 100) : 0

  // Credit explanation text
  let creditExplanation = ''
  if (emailApproach === 'verified' && emailValidation) {
    creditExplanation = 'Credits are used for each source queried in order. Apollo is checked first (1 cr). If unverified, up to 4 more sources are tried. A final ZeroBounce check confirms deliverability. Only net new records consume credits.'
  } else if (emailApproach === 'verified' && !emailValidation) {
    creditExplanation = 'Credits are used for each source queried. Apollo is checked first (1 cr), then up to 4 more sources until a verified email is found. Only net new records consume credits.'
  } else {
    creditExplanation = 'The search stops at the first email found across up to 5 sources. Credits are used only for sources actually queried. Only net new records consume credits.'
  }

  // Popover positioning
  const openListPopover = () => {
    if (listBtnRef.current) {
      const rect = listBtnRef.current.getBoundingClientRect()
      setPopoverPos({
        top: 0,
        left: rect.left,
        width: Math.max(rect.width, 220),
      })
      // Position will be finalized using bottom anchoring
      setListPopoverOpen(true)
      setSeqPopoverOpen(false)
    }
  }

  const openSeqPopover = () => {
    if (seqBtnRef.current) {
      const rect = seqBtnRef.current.getBoundingClientRect()
      setSeqPopoverPos({
        top: 0,
        left: rect.left,
        width: Math.max(rect.width, 220),
      })
      setSeqPopoverOpen(true)
      setListPopoverOpen(false)
    }
  }

  // Close popovers on outside click
  useEffect(() => {
    if (!listPopoverOpen && !seqPopoverOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (listPopoverOpen && !target.closest('.svcp-popover') && !target.closest('.svcp-footer-picker-btn')) {
        setListPopoverOpen(false)
      }
      if (seqPopoverOpen && !target.closest('.svcp-popover') && !target.closest('.svcp-footer-picker-btn')) {
        setSeqPopoverOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [listPopoverOpen, seqPopoverOpen])

  // Compute popover position relative to button (anchored above)
  const getListPopoverStyle = (): React.CSSProperties => {
    if (!listBtnRef.current || !popoverPos) return { display: 'none' }
    const rect = listBtnRef.current.getBoundingClientRect()
    const w = Math.max(rect.width, 220)
    const left = Math.min(rect.left, window.innerWidth - w - 8)
    return {
      position: 'fixed',
      bottom: window.innerHeight - rect.top + 4,
      left,
      width: w,
      zIndex: 9999,
    }
  }

  const getSeqPopoverStyle = (): React.CSSProperties => {
    if (!seqBtnRef.current || !seqPopoverPos) return { display: 'none' }
    const rect = seqBtnRef.current.getBoundingClientRect()
    const w = Math.max(rect.width, 220)
    const left = Math.min(rect.left, window.innerWidth - w - 8)
    return {
      position: 'fixed',
      bottom: window.innerHeight - rect.top + 4,
      left,
      width: w,
      zIndex: 9999,
    }
  }

  const toggleStatusFilter = (key: 'verified' | 'unverified' | 'unavailable') => {
    setStatusFilter(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="svcp-panel">
      {/* Header */}
      <div className="svcp-header">
        <button className="svcp-back" onClick={onBack}>
          <IconChevronLeft size={16} />
        </button>
        <span className="svcp-title text-body-sm font-medium">Save contacts</span>
        <button className="svcp-close" onClick={onClose}>
          <IconClose size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="svcp-body">
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
              <span className="svcp-email-bar-label text-caption text-secondary">{verifiedPct}% verified</span>
            </div>
            <IconChevronRight
              size={14}
              className={`svcp-accordion-chevron${emailStatusExpanded ? ' svcp-accordion-chevron-open' : ''}`}
            />
          </button>
          {emailStatusExpanded && (
            <div className="svcp-accordion-body">
              {/* Status checkboxes */}
              <div className="svcp-status-checks">
                <label className="svcp-status-check-label text-caption">
                  <input
                    type="checkbox"
                    checked={statusFilter.verified}
                    onChange={() => toggleStatusFilter('verified')}
                  />
                  <span>Verified</span>
                  <span className="svcp-status-check-count text-secondary">{verifiedCount}</span>
                </label>
                <label className="svcp-status-check-label text-caption">
                  <input
                    type="checkbox"
                    checked={statusFilter.unverified}
                    onChange={() => toggleStatusFilter('unverified')}
                  />
                  <span>Unverified</span>
                  <span className="svcp-status-check-count text-secondary">{unverifiedCount}</span>
                </label>
                <label className="svcp-status-check-label text-caption">
                  <input
                    type="checkbox"
                    checked={statusFilter.unavailable}
                    onChange={() => toggleStatusFilter('unavailable')}
                  />
                  <span>Unavailable</span>
                  <span className="svcp-status-check-count text-secondary">{unavailableCount}</span>
                </label>
              </div>

              <div className="svcp-status-divider" />

              {/* Catch-all */}
              <label className="svcp-catchall-label text-caption">
                <input
                  type="checkbox"
                  checked={includeCatchAll}
                  onChange={(e) => setIncludeCatchAll(e.target.checked)}
                />
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
        {/* Also add to list */}
        <div className="svcp-footer-opt">
          <label className="svcp-footer-opt-toggle">
            <input
              type="checkbox"
              className="svcp-footer-checkbox"
              checked={addToList}
              onChange={(e) => {
                setAddToList(e.target.checked)
                if (!e.target.checked) setListPopoverOpen(false)
              }}
            />
            <span className="text-caption">Also add to list</span>
          </label>
          {addToList && (
            <button
              ref={listBtnRef}
              className="svcp-footer-picker-btn text-caption"
              onClick={openListPopover}
            >
              {mockLists.find(l => l.id === selectedList)?.name ?? 'Select'}
              <IconChevronRight size={10} className="svcp-footer-picker-chevron" />
            </button>
          )}
        </div>

        {/* Also add to sequence */}
        <div className="svcp-footer-opt">
          <label className="svcp-footer-opt-toggle">
            <input
              type="checkbox"
              className="svcp-footer-checkbox"
              checked={addToSeq}
              onChange={(e) => {
                setAddToSeq(e.target.checked)
                if (!e.target.checked) setSeqPopoverOpen(false)
              }}
            />
            <span className="text-caption">Also add to sequence</span>
          </label>
          {addToSeq && (
            <button
              ref={seqBtnRef}
              className="svcp-footer-picker-btn text-caption"
              onClick={openSeqPopover}
            >
              {mockSequences.find(s => s.id === selectedSeq)?.name ?? 'Select'}
              <IconChevronRight size={10} className="svcp-footer-picker-chevron" />
            </button>
          )}
        </div>

        <div className="svcp-footer-divider" />

        <Button variant="primary" onClick={onConfirm}>
          Save {selectedCount} contact{selectedCount !== 1 ? 's' : ''}
        </Button>
      </div>

      {/* List popover */}
      {listPopoverOpen && (
        <div className="svcp-popover" style={getListPopoverStyle()}>
          <div className="svcp-popover-inner">
            {mockLists.map(list => (
              <button
                key={list.id}
                className={`svcp-popover-item${selectedList === list.id ? ' svcp-popover-item-selected' : ''}`}
                onClick={() => { setSelectedList(list.id); setListPopoverOpen(false) }}
              >
                <div className="svcp-popover-item-main">
                  <span className="text-caption font-medium">{list.name}</span>
                  <span className="text-caption text-secondary">{list.count} contacts</span>
                </div>
                {selectedList === list.id && (
                  <span className="svcp-popover-check"><IconCheck size={12} /></span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sequence popover */}
      {seqPopoverOpen && (
        <div className="svcp-popover" style={getSeqPopoverStyle()}>
          <div className="svcp-popover-inner">
            {mockSequences.map(seq => (
              <button
                key={seq.id}
                className={`svcp-popover-item${selectedSeq === seq.id ? ' svcp-popover-item-selected' : ''}`}
                onClick={() => { setSelectedSeq(seq.id); setSeqPopoverOpen(false) }}
              >
                <div className="svcp-popover-item-main">
                  <span className="text-caption font-medium">{seq.name}</span>
                  <span className="text-caption text-secondary">{seq.steps} steps &middot; {seq.days} days</span>
                </div>
                {selectedSeq === seq.id && (
                  <span className="svcp-popover-check"><IconCheck size={12} /></span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
