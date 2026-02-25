import { useNavigate } from 'react-router-dom'
import { weeklyScorecard } from '@/data/mockMetrics'
import Button from '@/components/shared/Button'
import './ScorecardHomePage.css'

export default function ScorecardHomePage() {
  const navigate = useNavigate()
  const { funnel, metrics, coaching } = weeklyScorecard

  return (
    <div className="scorecard-page">
      <div className="scorecard-header">
        <h1 className="text-title-lg">Weekly Scorecard</h1>
        <span className="text-body-sm text-secondary">Last 7 days</span>
      </div>

      {/* Funnel */}
      <div className="scorecard-funnel">
        {[
          { label: 'Sent', value: funnel.sent, width: '100%' },
          { label: 'Opened', value: funnel.opened, width: `${(funnel.opened / funnel.sent) * 100}%` },
          { label: 'Replied', value: funnel.replied, width: `${(funnel.replied / funnel.sent) * 100}%` },
          { label: 'Meetings', value: funnel.meetings, width: `${(funnel.meetings / funnel.sent) * 100}%` },
        ].map((stage) => (
          <div key={stage.label} className="scorecard-funnel-row">
            <span className="scorecard-funnel-label text-body-sm">{stage.label}</span>
            <div className="scorecard-funnel-bar-track">
              <div
                className="scorecard-funnel-bar"
                style={{ width: stage.width }}
              />
            </div>
            <span className="scorecard-funnel-value text-body-sm font-medium">{stage.value}</span>
          </div>
        ))}
      </div>

      {/* Metric cards */}
      <div className="scorecard-metrics">
        <div className="scorecard-metric-card">
          <span className="text-caption text-secondary">Reply rate</span>
          <span className="text-title-lg">{metrics.replyRate}</span>
        </div>
        <div className="scorecard-metric-card">
          <span className="text-caption text-secondary">Meetings booked</span>
          <span className="text-title-lg">{metrics.meetingsBooked}</span>
        </div>
        <div className="scorecard-metric-card">
          <span className="text-caption text-secondary">Credits used</span>
          <span className="text-title-lg">{metrics.creditsUsed}</span>
        </div>
      </div>

      {/* Coaching */}
      <div className="scorecard-coaching">
        <div className="scorecard-coaching-section">
          <h3 className="text-subtitle-lg">What worked</h3>
          <ul className="scorecard-coaching-list">
            {coaching.whatWorked.map((item, i) => (
              <li key={i} className="text-body-sm text-secondary">{item}</li>
            ))}
          </ul>
        </div>
        <div className="scorecard-coaching-section">
          <h3 className="text-subtitle-lg">What to change</h3>
          <ul className="scorecard-coaching-list">
            {coaching.whatToChange.map((item, i) => (
              <li key={i} className="text-body-sm text-secondary">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next action */}
      <div className="scorecard-next">
        <div className="scorecard-next-card">
          <span className="text-subtitle-lg">Do this next</span>
          <p className="text-body-sm text-secondary">{coaching.doThisNext}</p>
          <div className="scorecard-saved-search">
            <span className="text-caption text-secondary">Saved search:</span>
            <span className="text-body-sm" style={{ color: 'var(--color-text-link)' }}>{coaching.savedSearch}</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/search')}>
            Re-run search
          </Button>
        </div>
      </div>

      {/* Restart flow */}
      <div className="scorecard-restart">
        <Button variant="ghost" onClick={() => navigate('/')}>
          Restart prototype from beginning
        </Button>
      </div>
    </div>
  )
}
