import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import {
  IconSparkle,
  IconChevronRight,
} from '@/components/shared/Icons'
import '../main/SearchPage.css'
import './DiagnosticPage.css'

interface DiagnosticItem {
  category: string
  score: string
  color: 'red' | 'yellow' | 'green'
  detail: string
  fix: { label: string; detail: string } | null
}

interface SequenceDiag {
  id: number
  name: string
  status: 'attention' | 'healthy' | 'warning'
  replyRate: number
  target: number
  items: DiagnosticItem[]
}

const sequenceDiags: SequenceDiag[] = [
  {
    id: 1,
    name: 'Cold Outbound — Decision Makers',
    status: 'attention',
    replyRate: 8,
    target: 12,
    items: [
      {
        category: 'Targeting',
        score: 'Weak',
        color: 'red',
        detail: '60% of non-replies were poor ICP fit — company size and persona mismatch',
        fix: { label: 'Narrow ICP filter', detail: 'Focus on 50-500 employee companies in radiation oncology specifically' },
      },
      {
        category: 'Messaging',
        score: 'Moderate',
        color: 'yellow',
        detail: 'Step 3 had lowest engagement — subject line too generic',
        fix: { label: 'Rewrite subject line', detail: 'Step 3 subject "Quick check-in" → use pain-signal personalization instead' },
      },
      {
        category: 'Timing',
        score: 'Good',
        color: 'green',
        detail: 'Tuesday AM sends performed well; no timing issues detected',
        fix: { label: 'Shift send to Tue AM', detail: 'Move Step 2 from Thursday to Tuesday morning for better open rates' },
      },
      {
        category: 'Deliverability',
        score: 'Good',
        color: 'green',
        detail: 'All emails delivered — no bounces or spam flags',
        fix: null,
      },
    ],
  },
  {
    id: 2,
    name: 'Warm Nurture — Recent Engagement',
    status: 'healthy',
    replyRate: 15,
    target: 12,
    items: [
      {
        category: 'Targeting',
        score: 'Good',
        color: 'green',
        detail: 'Strong ICP alignment — 85% of contacts match ideal persona',
        fix: null,
      },
      {
        category: 'Messaging',
        score: 'Good',
        color: 'green',
        detail: 'All steps performing above benchmark — personalization working well',
        fix: null,
      },
      {
        category: 'Timing',
        score: 'Good',
        color: 'green',
        detail: 'Send times optimized — Wed/Thu mornings showing best engagement',
        fix: null,
      },
      {
        category: 'Deliverability',
        score: 'Good',
        color: 'green',
        detail: '99% delivery rate — no issues detected',
        fix: null,
      },
    ],
  },
  {
    id: 3,
    name: 'Event Follow-Up',
    status: 'warning',
    replyRate: 10,
    target: 12,
    items: [
      {
        category: 'Targeting',
        score: 'Good',
        color: 'green',
        detail: 'Contacts are high-intent event attendees — strong fit',
        fix: null,
      },
      {
        category: 'Messaging',
        score: 'Moderate',
        color: 'yellow',
        detail: 'Step 1 open rate high but reply rate drops at Step 2 — losing momentum',
        fix: { label: 'Shorten follow-up cadence', detail: 'Reduce gap between Step 1 and 2 from 5 days to 2 days while intent is fresh' },
      },
      {
        category: 'Timing',
        score: 'Moderate',
        color: 'yellow',
        detail: 'Step 3 sends on Friday PM — low engagement window',
        fix: { label: 'Move Step 3 to Monday AM', detail: 'Shift from Friday 4pm to Monday 9am for better visibility' },
      },
      {
        category: 'Deliverability',
        score: 'Good',
        color: 'green',
        detail: 'No delivery issues — all emails reaching inbox',
        fix: null,
      },
    ],
  },
  {
    id: 4,
    name: 'Competitive Displacement',
    status: 'attention',
    replyRate: 5,
    target: 10,
    items: [
      {
        category: 'Targeting',
        score: 'Moderate',
        color: 'yellow',
        detail: 'Signal data for competitor usage is stale for 40% of contacts',
        fix: { label: 'Refresh intent signals', detail: 'Re-run enrichment to validate competitor tech stack data before next send' },
      },
      {
        category: 'Messaging',
        score: 'Weak',
        color: 'red',
        detail: 'Comparison claims too aggressive — triggering negative sentiment',
        fix: { label: 'Soften comparison angle', detail: 'Shift from direct competitor callout to pain-point-first messaging with subtle differentiation' },
      },
      {
        category: 'Timing',
        score: 'Good',
        color: 'green',
        detail: 'Send schedule aligned with engagement windows',
        fix: null,
      },
      {
        category: 'Deliverability',
        score: 'Moderate',
        color: 'yellow',
        detail: '3 emails flagged as promotional — landing in Promotions tab',
        fix: { label: 'Reduce link density', detail: 'Step 2 has 4 links — reduce to 1 to avoid promotional filters' },
      },
    ],
  },
  {
    id: 5,
    name: 'Inbound Demo Request',
    status: 'healthy',
    replyRate: 22,
    target: 15,
    items: [
      {
        category: 'Targeting',
        score: 'Good',
        color: 'green',
        detail: 'All contacts are inbound — high buying intent confirmed',
        fix: null,
      },
      {
        category: 'Messaging',
        score: 'Good',
        color: 'green',
        detail: 'Concise demo-focused copy with strong CTAs performing well',
        fix: null,
      },
      {
        category: 'Timing',
        score: 'Good',
        color: 'green',
        detail: 'Fast response within 2hr SLA — maximizing conversion window',
        fix: null,
      },
      {
        category: 'Deliverability',
        score: 'Good',
        color: 'green',
        detail: '100% delivery — clean inbound list',
        fix: null,
      },
    ],
  },
]

const statusColors: Record<string, 'red' | 'yellow' | 'green'> = {
  attention: 'red',
  warning: 'yellow',
  healthy: 'green',
}

export default function DiagnosticPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(sequenceDiags[0].id)

  const selected = sequenceDiags.find((s) => s.id === selectedId)!
  const attentionCount = sequenceDiags.filter((s) => s.status === 'attention').length
  const healthyCount = sequenceDiags.filter((s) => s.status === 'healthy').length

  return (
    <div className="search-page">
      {/* Page header */}
      <div className="search-page-header">
        <h2 className="text-title-md">Diagnostic</h2>
        <div className="search-liveness">
          <span className="search-liveness-dot" />
          <span className="text-caption text-secondary">
            <strong>{attentionCount}</strong> need attention &middot; <strong>{healthyCount}</strong> healthy
          </span>
        </div>
      </div>

      {/* Body: sidebar + main */}
      <div className="search-body">
        {/* Sidebar — sequence list */}
        <aside className="search-filters">
          <span className="diag-sidebar-label text-caption text-tertiary">Sequences</span>
          <div className="diag-sidebar-list">
            {sequenceDiags.map((seq) => (
              <button
                key={seq.id}
                className={`diag-sidebar-item ${selectedId === seq.id ? 'diag-sidebar-item-active' : ''}`}
                onClick={() => setSelectedId(seq.id)}
              >
                <span className={`diag-sidebar-dot diag-sidebar-dot-${seq.status}`} />
                <div className="diag-sidebar-item-content">
                  <span className="text-body-sm">{seq.name}</span>
                  <span className="text-caption text-tertiary">{seq.replyRate}% reply rate</span>
                </div>
              </button>
            ))}
          </div>

          <button className="diag-sidebar-link">
            <span className="text-body-sm text-secondary">Account Health</span>
            <IconChevronRight size={12} />
          </button>
        </aside>

        {/* Main — diagnostic content */}
        <div className="search-main">
          <div className="search-table-frame diag-main-content">
            {/* Sequence heading */}
            <div className="diag-heading">
              <div className="diag-heading-top">
                <h3 className="text-title-sm">{selected.name}</h3>
                <Badge variant={statusColors[selected.status]} size="sm">
                  {selected.status === 'attention' ? 'Needs attention' : selected.status === 'warning' ? 'Warning' : 'Healthy'}
                </Badge>
              </div>
              <p className="diag-heading-stat text-body-sm">
                <IconSparkle size={13} />
                {selected.replyRate}% reply rate —{' '}
                <span className={
                  selected.replyRate >= selected.target
                    ? 'diag-stat-green'
                    : selected.replyRate >= selected.target * 0.8
                      ? 'diag-stat-yellow'
                      : 'diag-stat-red'
                }>
                  {selected.replyRate >= selected.target ? 'above' : 'below'} your {selected.target}% target
                </span>
              </p>
            </div>

            {/* Metrics row — typographic treatment */}
            <div className="diag-metrics">
              <div className="diag-metric">
                <span className="diag-metric-value">{selected.replyRate}%</span>
                <span className="text-caption text-secondary">Reply rate</span>
              </div>
              <div className="diag-metric-divider" />
              <div className="diag-metric">
                <span className="diag-metric-value">{selected.target}%</span>
                <span className="text-caption text-secondary">Target</span>
              </div>
              <div className="diag-metric-divider" />
              <div className="diag-metric">
                <span className="diag-metric-value">{selected.items.filter((i) => i.color !== 'green').length}</span>
                <span className="text-caption text-secondary">Issues</span>
              </div>
              <div className="diag-metric-divider" />
              <div className="diag-metric">
                <span className="diag-metric-value">{selected.items.filter((i) => i.fix).length}</span>
                <span className="text-caption text-secondary">Fixes</span>
              </div>
            </div>

            {/* Two-column: root causes paired with fixes */}
            <div className="diag-grid">
              <div className="diag-grid-header text-caption font-medium text-secondary">Root cause analysis</div>
              <div className="diag-grid-header text-caption font-medium text-secondary">Recommended fix</div>

              {selected.items.map((item, i) => (
                <div key={item.category} className="diag-grid-row">
                  <div className="diag-cause">
                    <div className="diag-cause-header">
                      <span className="text-body-sm font-medium">{item.category}</span>
                      <Badge variant={item.color} size="sm">{item.score}</Badge>
                    </div>
                    <p className="text-caption text-secondary">{item.detail}</p>
                  </div>

                  <div className={`diag-fix ${!item.fix ? 'diag-fix-empty' : ''}`}>
                    {item.fix ? (
                      <>
                        <div className="diag-fix-number">{i + 1}</div>
                        <div>
                          <span className="text-body-sm font-medium">{item.fix.label}</span>
                          <p className="text-caption text-secondary">{item.fix.detail}</p>
                        </div>
                      </>
                    ) : (
                      <span className="text-caption text-tertiary">No action needed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="diag-actions">
              <Button variant="primary" onClick={() => navigate('/home')}>
                Apply changes and re-enroll
              </Button>
              <Button variant="ghost" onClick={() => navigate('/home')}>
                Archive sequence
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
