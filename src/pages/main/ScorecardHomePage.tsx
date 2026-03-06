import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { weeklyScorecard, funnelData } from '@/data/mockMetrics'
import type { FunnelPeriod, FunnelSource } from '@/data/mockMetrics'
import Button from '@/components/shared/Button'
import './ScorecardHomePage.css'

const periods: { key: FunnelPeriod; label: string }[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: 'all', label: 'All time' },
]

const comparisons: { key: FunnelSource; label: string }[] = [
  { key: 'you', label: 'Your data' },
  { key: 'industry', label: 'Industry avg' },
  { key: 'previous', label: 'Previous period' },
]

const stageKeys = ['sent', 'opened', 'replied', 'meetings'] as const
const stageLabels: Record<typeof stageKeys[number], string> = {
  sent: 'Sent',
  opened: 'Opened',
  replied: 'Replied',
  meetings: 'Meetings',
}

export default function ScorecardHomePage() {
  const navigate = useNavigate()
  const { metrics, coaching } = weeklyScorecard
  const [period, setPeriod] = useState<FunnelPeriod>('7d')
  const [compare, setCompare] = useState<FunnelSource | null>(null)

  return (
    <div className="scorecard-page">
      <div className="scorecard-header">
        <h1 className="text-title-lg">Weekly Scorecard</h1>
        <span className="text-body-sm text-secondary">Last 7 days</span>
      </div>

      {/* Top row: funnel + metrics */}
      <div className="scorecard-top">
        <div className="scorecard-card scorecard-funnel-card">
          {/* Funnel controls */}
          <div className="scorecard-funnel-controls">
            <div className="scorecard-toggle-group">
              {periods.map((p) => (
                <button
                  key={p.key}
                  className={`scorecard-toggle ${period === p.key ? 'scorecard-toggle-active' : ''}`}
                  onClick={() => setPeriod(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="scorecard-toggle-group">
              {comparisons.map((c) => (
                <button
                  key={c.key}
                  className={`scorecard-toggle ${compare === c.key ? 'scorecard-toggle-active' : ''} ${c.key === 'you' ? 'scorecard-toggle-you' : ''}`}
                  onClick={() => setCompare(compare === c.key ? null : (c.key === 'you' ? null : c.key))}
                  disabled={c.key === 'you'}
                >
                  {c.key === 'you' && <span className="scorecard-dot scorecard-dot-you" />}
                  {c.key !== 'you' && <span className={`scorecard-dot scorecard-dot-${c.key}`} />}
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Funnel bars */}
          <div className="scorecard-funnel">
            {stageKeys.map((key, i) => {
              const youData = funnelData[period].you
              const youVal = youData[key]
              const youPct = (youVal / youData.sent) * 100
              const compareData = compare ? funnelData[period][compare] : null
              const compareVal = compareData ? compareData[key] : null
              const comparePct = compareData ? (compareData[key] / compareData.sent) * 100 : null

              // Conversion rate from previous stage
              const prevKey = i > 0 ? stageKeys[i - 1] : null
              const convRate = prevKey ? Math.round((youVal / youData[prevKey]) * 100) : null

              return (
                <div key={key} className="scorecard-funnel-stage">
                  {convRate !== null && (
                    <div className="scorecard-conversion">
                      <span className="scorecard-conversion-line" />
                      <span className="text-caption text-tertiary">{convRate}%</span>
                    </div>
                  )}
                  <div className="scorecard-funnel-row">
                    <span className="scorecard-funnel-label text-body-sm">{stageLabels[key]}</span>
                    <div className="scorecard-funnel-bar-track">
                      {comparePct !== null && (
                        <div
                          className="scorecard-funnel-bar-compare"
                          style={{ width: `${comparePct}%` }}
                        />
                      )}
                      <div
                        className="scorecard-funnel-bar"
                        style={{ width: `${youPct}%` }}
                      />
                    </div>
                    <div className="scorecard-funnel-values">
                      <span className="text-body-sm font-medium">{youVal}</span>
                      <span className={`text-caption text-tertiary scorecard-compare-value ${compareVal !== null ? 'scorecard-compare-visible' : ''}`}>
                        {compareVal ?? '\u00A0'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="scorecard-metrics">
          <div className="scorecard-card scorecard-metric-card">
            <span className="text-caption text-secondary">Reply rate</span>
            <span className="text-title-lg">{metrics.replyRate}</span>
          </div>
          <div className="scorecard-card scorecard-metric-card">
            <span className="text-caption text-secondary">Meetings booked</span>
            <span className="text-title-lg">{metrics.meetingsBooked}</span>
          </div>
          <div className="scorecard-card scorecard-metric-card">
            <span className="text-caption text-secondary">Credits used</span>
            <span className="text-title-lg">{metrics.creditsUsed}</span>
          </div>
        </div>
      </div>

      {/* Middle row: coaching */}
      <div className="scorecard-coaching">
        <div className="scorecard-card scorecard-coaching-section">
          <h3 className="text-subtitle-lg">What worked</h3>
          <ul className="scorecard-coaching-list">
            {coaching.whatWorked.map((item, i) => (
              <li key={i} className="text-body-sm text-secondary">{item}</li>
            ))}
          </ul>
        </div>
        <div className="scorecard-card scorecard-coaching-section">
          <h3 className="text-subtitle-lg">What to change</h3>
          <div className="scorecard-actions-list">
            {coaching.whatToChange.map((item, i) => (
              <div key={i} className="scorecard-action-item">
                <span className="text-body-sm text-secondary">{item.text}</span>
                <button
                  className="scorecard-action-btn text-caption"
                  onClick={() => navigate(item.route)}
                >
                  {item.action} &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: next action */}
      <div className="scorecard-card scorecard-next-card">
        <span className="text-subtitle-lg">Do this next</span>
        <p className="text-body-sm text-secondary">{coaching.doThisNext}</p>
        <div className="scorecard-next-row">
          <div className="scorecard-saved-search">
            <span className="text-caption text-secondary">Saved search:</span>
            <span className="text-body-sm" style={{ color: 'var(--color-text-link)' }}>{coaching.savedSearch}</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/search')}>
            Re-run search
          </Button>
        </div>
      </div>
    </div>
  )
}
