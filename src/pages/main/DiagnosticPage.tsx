import { useNavigate } from 'react-router-dom'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import { IconSparkle } from '@/components/shared/Icons'
import './DiagnosticPage.css'

const rootCauses = [
  { category: 'Targeting', score: 'Weak', color: 'red' as const, detail: '60% of non-replies were poor ICP fit — company size and persona mismatch' },
  { category: 'Messaging', score: 'Moderate', color: 'yellow' as const, detail: 'Step 3 had lowest engagement — subject line too generic' },
  { category: 'Timing', score: 'Good', color: 'green' as const, detail: 'Tuesday AM sends performed well; no timing issues detected' },
  { category: 'Deliverability', score: 'Good', color: 'green' as const, detail: 'All emails delivered — no bounces or spam flags' },
]

const fixes = [
  { label: 'Narrow ICP filter', detail: 'Focus on 50-500 employee companies in radiation oncology specifically' },
  { label: 'Rewrite subject line', detail: 'Step 3 subject "Quick check-in" → use pain-signal personalization instead' },
  { label: 'Shift send to Tue AM', detail: 'Move Step 2 from Thursday to Tuesday morning for better open rates' },
]

export default function DiagnosticPage() {
  const navigate = useNavigate()

  return (
    <div className="diag-page">
      <div className="diag-container">
        {/* Insight card */}
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

        {/* Root cause */}
        <div className="diag-section">
          <h3 className="text-subtitle-lg">Root cause analysis</h3>
          <div className="diag-causes">
            {rootCauses.map((cause) => (
              <div key={cause.category} className="diag-cause">
                <div className="diag-cause-header">
                  <span className="text-body-sm font-medium">{cause.category}</span>
                  <Badge variant={cause.color} size="sm">{cause.score}</Badge>
                </div>
                <p className="text-caption text-secondary">{cause.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended fixes */}
        <div className="diag-section">
          <h3 className="text-subtitle-lg">Recommended fixes</h3>
          <div className="diag-fixes">
            {fixes.map((fix, i) => (
              <div key={i} className="diag-fix">
                <div className="diag-fix-number">{i + 1}</div>
                <div>
                  <span className="text-body-sm font-medium">{fix.label}</span>
                  <p className="text-caption text-secondary">{fix.detail}</p>
                </div>
              </div>
            ))}
          </div>
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
  )
}
