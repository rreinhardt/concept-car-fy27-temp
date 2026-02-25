import { useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import Button from '@/components/shared/Button'
import Tag from '@/components/shared/Tag'
import Avatar from '@/components/shared/Avatar'
import { IconGlobe } from '@/components/shared/Icons'
import './KnowledgeBasePage.css'

export default function KnowledgeBasePage() {
  const navigate = useNavigate()
  const user = useUser()

  return (
    <div className="kb-page">
      {/* Left column */}
      <div className="kb-left">
        <div className="kb-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="2.5" fill="currentColor" />
            <path d="M16 4V12M16 20V28M4 16H12M20 16H28M7.5 7.5L12.2 12.2M19.8 19.8L24.5 24.5M24.5 7.5L19.8 12.2M12.2 19.8L7.5 24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="kb-logo-name">Apollo</span>
        </div>

        <h1 className="kb-heading text-display-sm">
          Here's how we understand your company
        </h1>
        <p className="kb-subtext text-body-lg text-secondary">
          We used public company information to tailor your search and recommendations.
        </p>

        <div className="kb-actions">
          <Button variant="primary" size="lg" onClick={() => navigate('/target-audience')}>
            Continue
          </Button>
          <Button variant="ghost" size="lg">
            Edit details
          </Button>
        </div>

        <div className="kb-lang">
          <IconGlobe size={14} />
          <span className="text-caption text-secondary">EN</span>
        </div>
      </div>

      {/* Right column — company card */}
      <div className="kb-right">
        <div className="kb-card">
          {/* User */}
          <div className="kb-card-user">
            <Avatar initials={user.initials} size="lg" color="#E8D5E8" />
            <div>
              <div className="text-body-lg font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-body-sm text-secondary">{user.title} at {user.company.name}</div>
            </div>
          </div>

          {/* Company */}
          <div className="kb-card-company">
            <div className="kb-company-logo">{user.company.logo}</div>
            <div>
              <div className="text-body-lg font-medium">{user.company.name}</div>
              <div className="text-body-sm text-secondary">{user.company.industry}</div>
            </div>
          </div>

          <div className="kb-card-divider" />

          {/* Customer overview */}
          <div className="kb-card-section">
            <div className="kb-card-label text-subtitle-lg">Customer overview</div>
            <p className="text-body-sm text-secondary">{user.company.overview}</p>
          </div>

          {/* Ideal buyers */}
          <div className="kb-card-section">
            <div className="kb-card-label text-subtitle-lg">Ideal buyers:</div>
            <div className="kb-card-tags">
              {user.company.idealBuyers.map((b) => (
                <Tag key={b} variant="blue">{b}</Tag>
              ))}
            </div>
          </div>

          {/* Primary users */}
          <div className="kb-card-section">
            <div className="kb-card-label text-subtitle-lg">Primary users:</div>
            <div className="kb-card-tags">
              {user.company.primaryUsers.map((u) => (
                <Tag key={u} variant="blue">{u}</Tag>
              ))}
            </div>
          </div>

          {/* Pain signals */}
          <div className="kb-card-section">
            <div className="kb-card-label text-subtitle-lg">Core pain signals to look for:</div>
            <ul className="kb-card-list">
              {user.company.painSignals.map((s) => (
                <li key={s} className="text-body-sm text-secondary">{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
