import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { IconApolloLogo } from '@/components/shared/Icons'
import './VerifiedPage.css'

export default function VerifiedPage() {
  const navigate = useNavigate()

  // Auto-advance after 3 seconds (simulating "user verifies email")
  useEffect(() => {
    const timer = setTimeout(() => navigate('/welcome'), 3000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="verified-page">
      {/* Logo */}
      <div className="verified-logo">
        <IconApolloLogo size={20} />
        <span className="verified-logo-name">Apollo</span>
      </div>

      {/* Illustration */}
      <div className="verified-illustration">
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          {/* Envelope */}
          <rect x="40" y="50" width="120" height="80" rx="8" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
          <path d="M40 58L100 100L160 58" stroke="#E5E7EB" strokeWidth="2" />
          <path d="M40 50L100 90L160 50" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          {/* Badge */}
          <circle cx="150" cy="55" r="14" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
          <text x="150" y="60" textAnchor="middle" fontSize="14" fontWeight="600" fill="#1E40AF">1</text>
          {/* Sparkle */}
          <path d="M60 40L62 35L64 40L69 42L64 44L62 49L60 44L55 42L60 40Z" fill="#F59E0B" />
        </svg>
      </div>

      {/* Text */}
      <h1 className="verified-heading text-display-sm">
        You're in. Verify your email to get started.
      </h1>
      <p className="verified-subtext text-body-lg text-secondary">
        Check your inbox and follow the verification link to activate your Apollo account.
      </p>

      {/* Click to advance hint */}
      <button className="verified-skip text-caption text-tertiary" onClick={() => navigate('/welcome')}>
        Click to skip ahead
      </button>

      {/* Trust */}
      <div className="verified-trust">
        <div className="verified-stars">
          {'★★★★★'.split('').map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        <span className="text-caption text-secondary">
          4.7/5 based on 8,111 reviews | GDPR Compliant
        </span>
      </div>
    </div>
  )
}
