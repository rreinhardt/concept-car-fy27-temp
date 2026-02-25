import { useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import Button from '@/components/shared/Button'
import './SignUpPage.css'

export default function SignUpPage() {
  const navigate = useNavigate()
  const user = useUser()

  return (
    <div className="signup-page">
      <div className="signup-left">
        {/* Logo */}
        <div className="signup-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="2.5" fill="currentColor" />
            <path d="M16 4V12M16 20V28M4 16H12M20 16H28M7.5 7.5L12.2 12.2M19.8 19.8L24.5 24.5M24.5 7.5L19.8 12.2M12.2 19.8L7.5 24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="signup-logo-name">Apollo</span>
        </div>

        {/* Headline */}
        <h1 className="signup-headline text-display-lg">
          Sign up for Apollo — free forever
        </h1>
        <p className="signup-subtext text-body-lg text-secondary">
          Find, contact, and close your ideal buyers with over 210 million contacts in one, easy-to-use AI sales platform.
        </p>

        {/* Legal */}
        <p className="signup-legal text-caption text-tertiary">
          By signing up, I agree to Apollo's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>

        {/* Form */}
        <div className="signup-form">
          <div className="signup-email-row">
            <input
              type="email"
              className="signup-email-input"
              defaultValue={user.email}
              placeholder="name@company.com"
            />
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/verified')}
            >
              Sign up for free
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="signup-divider">
          <span>or</span>
        </div>

        {/* SSO */}
        <div className="signup-sso">
          <button className="signup-sso-btn" onClick={() => navigate('/verified')}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
          <button className="signup-sso-btn" onClick={() => navigate('/verified')}>
            <svg width="18" height="18" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            Sign up with Microsoft
          </button>
        </div>

        {/* Trust */}
        <div className="signup-trust">
          <div className="signup-stars">
            {'★★★★★'.split('').map((s, i) => (
              <span key={i} className="signup-star">{s}</span>
            ))}
          </div>
          <span className="text-caption text-secondary">
            4.7/5 based on 9,015 reviews | GDPR Compliant
          </span>
        </div>
      </div>

      {/* Right side — product preview */}
      <div className="signup-right">
        <div className="signup-preview-card">
          <div className="signup-preview-header text-subtitle-sm">BUILD WORKFLOW</div>
          <div className="signup-preview-steps">
            <div className="signup-preview-step">
              <div className="signup-preview-avatar">MS</div>
              <div>
                <div className="text-body-sm font-medium">Michael Smith</div>
                <div className="text-caption text-secondary">Director of Marketing at Oliv...</div>
              </div>
            </div>
            <div className="signup-preview-connector" />
            <div className="signup-preview-step">
              <div className="signup-preview-step-label text-caption text-secondary">FILL IN PROMPT</div>
              <div className="text-body-sm">Confirm decision maker</div>
            </div>
            <div className="signup-preview-connector" />
            <div className="signup-preview-step">
              <div className="text-body-sm">Add to: <span className="signup-preview-tag">Marketing outbound</span></div>
            </div>
            <div className="signup-preview-connector" />
            <div className="signup-preview-step">
              <div className="signup-preview-step-label text-caption text-secondary">UPDATE CONTACT</div>
              <div className="text-body-sm">Contact stage: Meeting set</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
