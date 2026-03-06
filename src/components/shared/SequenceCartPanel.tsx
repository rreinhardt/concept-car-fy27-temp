import { useState } from 'react'
import { mockSequences } from '@/data/mockSequences'
import { emailEnrichmentConfig } from '@/data/mockEnrichment'
import Button from '@/components/shared/Button'
import WaterfallPreview from '@/components/shared/WaterfallPreview'
import {
  IconChevronLeft, IconClose, IconChevronRight,
  IconMail, IconPhone, IconSparkle, IconCoin, IconInfo,
} from '@/components/shared/Icons'
import './SaveCartPanel.css'
import './SequenceCartPanel.css'

type GoalFilter = 'All' | 'Book meeting' | 'Nurture' | 'Reactivate'

const mockStepsBySequence: Record<number, { type: string; label: string }[]> = {
  1: [
    { type: 'email', label: 'Introduction email' },
    { type: 'email', label: 'Follow-up: pain point' },
    { type: 'call', label: 'Call task' },
    { type: 'email', label: 'Case study send' },
    { type: 'email', label: 'Break-up email' },
  ],
  2: [
    { type: 'email', label: 'Value recap email' },
    { type: 'email', label: 'Resources & content' },
    { type: 'call', label: 'Check-in call' },
    { type: 'email', label: 'Meeting ask' },
  ],
  3: [
    { type: 'email', label: 'Re-engagement intro' },
    { type: 'email', label: 'New offer highlight' },
    { type: 'email', label: 'Final nudge' },
  ],
  4: [
    { type: 'email', label: 'Nice to meet you' },
    { type: 'email', label: 'Key takeaways from event' },
    { type: 'call', label: 'Follow-up call' },
    { type: 'email', label: 'Meeting request' },
  ],
  5: [
    { type: 'email', label: 'Product launch announcement' },
    { type: 'email', label: 'Feature deep-dive' },
    { type: 'email', label: 'Demo invite' },
  ],
  6: [
    { type: 'email', label: 'Competitive insights email' },
    { type: 'email', label: 'ROI comparison' },
    { type: 'call', label: 'Discovery call ask' },
    { type: 'email', label: 'Migration offer' },
    { type: 'email', label: 'Final push' },
  ],
}

const goalColors: Record<string, string> = {
  'Book meeting': 'scp-goal-meeting',
  'Nurture': 'scp-goal-nurture',
  'Reactivate': 'scp-goal-reactivate',
}

interface SequenceCartPanelProps {
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

export default function SequenceCartPanel({
  selectedCount,
  selectedContacts,
  enrichmentState,
  emailApproach,
  emailValidation,
  onBack,
  onClose,
  onConfigEmail,
  onConfirm,
}: SequenceCartPanelProps) {
  const [seqExpanded, setSeqExpanded] = useState(false)
  const [emailStatusExpanded, setEmailStatusExpanded] = useState(false)
  const [enrichmentExpanded, setEnrichmentExpanded] = useState(false)
  const [activeGoal, setActiveGoal] = useState<GoalFilter>('All')
  const [selectedSequenceId, setSelectedSequenceId] = useState<number | null>(1)
  const [statusFilter, setStatusFilter] = useState({ verified: true, unverified: true, unavailable: true })
  const [includeCatchAll, setIncludeCatchAll] = useState(true)

  const goalFilters: GoalFilter[] = ['All', 'Book meeting', 'Nurture', 'Reactivate']
  const filtered = activeGoal === 'All' ? mockSequences : mockSequences.filter(s => s.goal === activeGoal)

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

  const selectedSeq = selectedSequenceId ? mockSequences.find(s => s.id === selectedSequenceId) : null

  return (
    <div className="svcp-panel">
      {/* Header */}
      <div className="svcp-header">
        <button className="svcp-back" onClick={onBack}>
          <IconChevronLeft size={16} />
        </button>
        <span className="svcp-title text-body-sm font-medium">Add to sequence</span>
        <button className="svcp-close" onClick={onClose}>
          <IconClose size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="svcp-body">
        <p className="scp-count text-caption text-secondary">
          {selectedCount} contact{selectedCount !== 1 ? 's' : ''} selected
        </p>

        {/* Sequence picker accordion */}
        <div className="svcp-accordion svcp-accordion-selection">
          <button
            className="svcp-accordion-header svcp-accordion-header-selection"
            onClick={() => setSeqExpanded(v => !v)}
          >
            <div className="svcp-accordion-header-main">
              <span className="text-body-sm font-medium">
                {selectedSeq ? selectedSeq.name : 'Choose a sequence'}
              </span>
              {selectedSeq && (
                <span className="text-caption text-secondary">
                  {selectedSeq.steps} steps · {selectedSeq.days} days
                </span>
              )}
            </div>
            <IconChevronRight
              size={14}
              className={`svcp-accordion-chevron${seqExpanded ? ' svcp-accordion-chevron-open' : ''}`}
            />
          </button>
          {seqExpanded && (
            <div className="svcp-accordion-body scp-seq-body">
              {/* Goal filter pills */}
              <div className="scp-filters">
                {goalFilters.map((goal) => (
                  <button
                    key={goal}
                    className={`scp-filter-pill text-caption${activeGoal === goal ? ' scp-filter-pill-active' : ''}`}
                    onClick={() => setActiveGoal(goal)}
                  >
                    {goal}
                  </button>
                ))}
              </div>

              {/* Sequence list */}
              <div className="scp-seq-list">
                {filtered.map((seq) => {
                  const isSelected = selectedSequenceId === seq.id
                  const steps = mockStepsBySequence[seq.id] ?? []
                  return (
                    <div
                      key={seq.id}
                      className={`scp-seq-item${isSelected ? ' scp-seq-item-selected' : ''}`}
                      onClick={() => setSelectedSequenceId(isSelected ? null : seq.id)}
                    >
                      <div className="scp-seq-row">
                        <div className="scp-seq-info">
                          <div className="scp-seq-name-row">
                            <span className={`scp-goal-badge text-caption ${goalColors[seq.goal] ?? ''}`}>
                              {seq.goal}
                            </span>
                          </div>
                          <span className="scp-seq-name text-body-sm font-medium">{seq.name}</span>
                          <span className="text-caption text-secondary">
                            {seq.steps} steps · {seq.days} days
                          </span>
                        </div>
                        <span className="scp-sparkle">
                          <IconSparkle size={13} />
                        </span>
                      </div>

                      {isSelected && (
                        <div className="scp-steps">
                          {steps.map((step, i) => (
                            <div key={i} className="scp-step-row">
                              <span className="scp-step-num text-caption text-secondary">{i + 1}</span>
                              <span className="scp-step-icon">
                                {step.type === 'email' ? <IconMail size={11} /> : <IconPhone size={11} />}
                              </span>
                              <span className="text-caption">{step.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
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
              <span className="svcp-credit-metric-label text-caption text-secondary">records to enroll</span>
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
          disabled={!selectedSequenceId}
          onClick={onConfirm}
        >
          Enroll in sequence
        </Button>
      </div>
    </div>
  )
}
