import { useNavigate } from 'react-router-dom'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import { IconSparkle } from '@/components/shared/Icons'
import './DiagnosticPage.css'

const diagnosticItems = [
  {
    category: 'Targeting',
    score: 'Weak',
    color: 'red' as const,
    detail: '60% of non-replies were poor ICP fit — company size and persona mismatch',
    fix: { label: 'Narrow ICP filter', detail: 'Focus on 50-500 employee companies in radiation oncology specifically' },
  },
  {
    category: 'Messaging',
    score: 'Moderate',
    color: 'yellow' as const,
    detail: 'Step 3 had lowest engagement — subject line too generic',
    fix: { label: 'Rewrite subject line', detail: 'Step 3 subject "Quick check-in" → use pain-signal personalization instead' },
  },
  {
    category: 'Timing',
    score: 'Good',
    color: 'green' as const,
    detail: 'Tuesday AM sends performed well; no timing issues detected',
    fix: { label: 'Shift send to Tue AM', detail: 'Move Step 2 from Thursday to Tuesday morning for better open rates' },
  },
  {
    category: 'Deliverability',
    score: 'Good',
    color: 'green' as const,
    detail: 'All emails delivered — no bounces or spam flags',
    fix: null,
  },
]

export default function DiagnosticPage() {
  const navigate = useNavigate()

  return (
    <div className="diag-page">
      <h2 className="text-title-md">Diagnostic</h2>
      <div className="diag-card">
      {/* Insight card — full width */}
      <div className="diag-insight">
        <div className="diag-insight-header">
          <IconSparkle size={18} />
          <h2 className="text-title-md">Why did this sequence underperform?</h2>
        </div>
        <p className="text-body-sm text-secondary">
          Cold Outbound — Decision Makers achieved 8% reply rate (below your 12% target).
          Here's what Apollo's analysis found.
        </p>
      </div>

      {/* Two-column: root causes paired with fixes */}
      <div className="diag-grid">
        <div className="diag-grid-header text-subtitle-lg">Root cause analysis</div>
        <div className="diag-grid-header text-subtitle-lg">Recommended fix</div>

        {diagnosticItems.map((item, i) => (
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

      {/* Actions — full width */}
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
  )
}
