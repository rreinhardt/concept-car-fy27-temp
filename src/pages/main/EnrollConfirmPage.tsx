import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import { IconCheck, IconSparkle } from '@/components/shared/Icons'
import './EnrollConfirmPage.css'

export default function EnrollConfirmPage() {
  const navigate = useNavigate()
  const [aiOn, setAiOn] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  if (enrolled) {
    return (
      <div className="enroll-page">
        <div className="enroll-container">
          <div className="enroll-success">
            <div className="enroll-success-icon">
              <IconCheck size={32} />
            </div>
            <h2 className="text-title-md">Enrollment confirmed</h2>
            <p className="text-body-sm text-secondary">
              12 prospects enrolled in Cold Outbound — Decision Makers.
              First email sends Monday at 9:00 AM.
            </p>
            <div className="enroll-success-actions">
              <Button variant="primary" onClick={() => navigate('/triage')}>
                Go to Inbox
              </Button>
              <Button variant="ghost" onClick={() => navigate('/search')}>
                Back to search
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="enroll-page">
      <div className="enroll-container">
        <h2 className="text-title-md">Review and confirm enrollment</h2>

        {/* Summary */}
        <div className="enroll-summary">
          <div className="enroll-summary-row">
            <span className="text-body-sm text-secondary">Prospects</span>
            <span className="text-body-sm font-medium">12 contacts</span>
          </div>
          <div className="enroll-summary-row">
            <span className="text-body-sm text-secondary">Sequence</span>
            <span className="text-body-sm font-medium">Cold Outbound — Decision Makers</span>
          </div>
          <div className="enroll-summary-row">
            <span className="text-body-sm text-secondary">Steps</span>
            <span className="text-body-sm font-medium">5 steps over 14 days</span>
          </div>
          <div className="enroll-summary-row">
            <span className="text-body-sm text-secondary">First send</span>
            <Badge variant="blue" size="sm">Mon 9:00 AM</Badge>
          </div>
        </div>

        {/* AI Personalization */}
        <div className="enroll-ai">
          <div className="enroll-ai-header">
            <div className="enroll-ai-label">
              <IconSparkle size={14} />
              <span className="text-subtitle-lg">AI personalization</span>
            </div>
            <button
              className={`enroll-toggle ${aiOn ? 'enroll-toggle-on' : ''}`}
              onClick={() => setAiOn(!aiOn)}
            >
              <div className="enroll-toggle-thumb" />
            </button>
          </div>
          <p className="text-caption text-secondary">
            Each email will be personalized using prospect research, pain signals, and company context.
          </p>
        </div>

        {/* Preview */}
        <div className="enroll-preview-section">
          <button
            className="enroll-preview-toggle text-body-sm"
            onClick={() => setShowPreview(!showPreview)}
            style={{ color: 'var(--color-text-link)' }}
          >
            {showPreview ? 'Hide' : 'Preview'} draft email
          </button>

          {showPreview && (
            <div className="enroll-preview-card">
              <div className="enroll-preview-meta">
                <span className="text-caption text-secondary">To: Kenton Jast, District Manager at Mercy Health</span>
              </div>
              <div className="enroll-preview-subject text-body-sm font-medium">
                Streamlining oncology workflows at Mercy Health
              </div>
              <div className="enroll-preview-body text-body-sm text-secondary">
                <p>Hi Kenton,</p>
                <p>
                  I noticed Mercy Health has been expanding its radiation oncology capabilities.
                  Given the administrative burden on clinical staff — something we hear often from
                  operations leaders in your space — I thought it might be worth connecting.
                </p>
                <p>
                  At Fuse Oncology, we help practices like yours reduce time-to-treatment by
                  eliminating manual documentation bottlenecks.
                </p>
                <p>Would a 15-minute call this week make sense?</p>
              </div>
              {aiOn && (
                <Badge variant="purple" size="sm">AI personalized</Badge>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="enroll-actions">
          <Button variant="primary" size="lg" onClick={() => setEnrolled(true)}>
            Enroll now
          </Button>
          <Button variant="ghost" onClick={() => navigate('/sequences')}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
