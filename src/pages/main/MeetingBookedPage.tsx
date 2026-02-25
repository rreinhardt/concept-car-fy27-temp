import { useNavigate } from 'react-router-dom'
import Button from '@/components/shared/Button'
import { IconCheck } from '@/components/shared/Icons'
import './MeetingBookedPage.css'

export default function MeetingBookedPage() {
  const navigate = useNavigate()

  return (
    <div className="meeting-page">
      <div className="meeting-container">
        {/* Success illustration */}
        <div className="meeting-success-icon">
          <IconCheck size={40} />
        </div>

        <h1 className="text-title-lg">Meeting booked!</h1>

        {/* Details */}
        <div className="meeting-details">
          <div className="meeting-detail-row">
            <span className="text-body-sm text-secondary">Contact</span>
            <span className="text-body-sm font-medium">Jane Smith</span>
          </div>
          <div className="meeting-detail-row">
            <span className="text-body-sm text-secondary">Company</span>
            <span className="text-body-sm font-medium">Acme Corp</span>
          </div>
          <div className="meeting-detail-row">
            <span className="text-body-sm text-secondary">Date & time</span>
            <span className="text-body-sm font-medium">Thursday at 2:00 PM</span>
          </div>
          <div className="meeting-detail-row">
            <span className="text-body-sm text-secondary">Location</span>
            <a href="#" className="text-body-sm" style={{ color: 'var(--color-text-link)' }}>
              Google Meet link
            </a>
          </div>
        </div>

        {/* Next actions */}
        <div className="meeting-next">
          <p className="text-subtitle-lg">What's next?</p>
          <div className="meeting-next-options">
            <button className="meeting-next-card" onClick={() => navigate('/triage')}>
              <span className="text-body-sm font-medium">3 more in triage queue</span>
              <span className="text-caption text-secondary">Continue processing replies and signals</span>
            </button>
            <button className="meeting-next-card" onClick={() => navigate('/home')}>
              <span className="text-body-sm font-medium">View this week's scorecard</span>
              <span className="text-caption text-secondary">See your weekly performance metrics</span>
            </button>
          </div>
        </div>

        {/* Continue flow */}
        <div className="meeting-flow-cta">
          <Button variant="primary" onClick={() => navigate('/diagnostic')}>
            Continue to Diagnostics
          </Button>
        </div>
      </div>
    </div>
  )
}
