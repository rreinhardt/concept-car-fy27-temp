import { useState } from 'react'
import { IconApolloLogo, IconClose, IconCheck, IconMail, IconCalendar, IconChat, IconSequence } from './Icons'
import Button from './Button'
import './MailboxSetupWizard.css'

interface MailboxSetupWizardProps {
  onComplete: () => void
  onClose: () => void
}

type Provider = 'google' | 'outlook' | 'other'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function OutlookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M24 7.387v10.478c0 .23-.08.424-.238.576a.806.806 0 01-.588.234h-8.42v-6.56l1.56 1.14a.344.344 0 00.4.008l6.96-4.872a.342.342 0 00.146-.174.434.434 0 00-.028-.37.327.327 0 00-.266-.18h-.014a.372.372 0 00-.206.066l-6.852 4.776-1.7-1.236V5.672h8.42c.233 0 .43.077.588.234.16.152.238.347.238.576V7.387z" fill="#0072C6"/>
      <path d="M8.066 8.2a3.2 3.2 0 00-1.573.401 2.89 2.89 0 00-1.12 1.111c-.274.474-.41.997-.41 1.573 0 .55.13 1.058.39 1.524a2.87 2.87 0 001.085 1.1 2.94 2.94 0 001.532.41c.59 0 1.12-.14 1.59-.418a2.93 2.93 0 001.108-1.126c.268-.474.402-.996.402-1.568 0-.562-.13-1.076-.39-1.543a2.91 2.91 0 00-1.08-1.094A2.93 2.93 0 008.066 8.2zm-.128 4.87c-.504 0-.908-.19-1.21-.573-.302-.382-.454-.878-.454-1.488 0-.63.15-1.14.451-1.53.3-.388.7-.582 1.195-.582.505 0 .905.188 1.2.564.296.376.444.876.444 1.5 0 .636-.148 1.145-.444 1.527-.295.382-.69.573-1.182.582z" fill="#0072C6"/>
      <path d="M14.754 5.672V18.67H.834A.83.83 0 01.247 18.435.83.83 0 010 17.841V6.83c0-.233.082-.432.247-.596A.824.824 0 01.834 6l.004-.005 13.916-.323z" fill="#0072C6" opacity=".5"/>
    </svg>
  )
}

function MailGenericIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="#6B7280" strokeWidth="1.5"/>
      <path d="M1.5 4.5L8 9L14.5 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const features = [
  { icon: <IconMail size={16} />, label: 'Deliverability' },
  { icon: <IconSequence size={16} />, label: 'Automation' },
  { icon: <IconChat size={16} />, label: 'Messaging' },
  { icon: <IconCalendar size={16} />, label: 'Meetings' },
]

export default function MailboxSetupWizard({ onComplete, onClose }: MailboxSetupWizardProps) {
  const [step, setStep] = useState(1)
  const [provider, setProvider] = useState<Provider>('google')
  const [legalChecked, setLegalChecked] = useState(true)
  const [exiting, setExiting] = useState(false)

  const handleClose = () => {
    setExiting(true)
    setTimeout(onClose, 280)
  }

  const handleDone = () => {
    setExiting(true)
    setTimeout(onComplete, 280)
  }

  return (
    <div className={`mbs-overlay${exiting ? ' mbs-overlay-exit' : ''}`}>
      {/* Top bar — hidden on Google OAuth step (simulated off-site) */}
      {step !== 2 && (
        <div className="mbs-topbar">
          <div className="mbs-topbar-left">
            <span className="mbs-topbar-logo">
              <IconApolloLogo size={20} />
            </span>
            <span className="mbs-topbar-label text-body-sm">Workspace set up</span>
          </div>
          <div className="mbs-progress">
            <span className={`mbs-progress-seg${step >= 1 ? ' mbs-progress-seg-active' : ''}`} />
            <span className={`mbs-progress-seg${step >= 2 ? ' mbs-progress-seg-active' : ''}`} />
            <span className={`mbs-progress-seg${step >= 3 ? ' mbs-progress-seg-active' : ''}`} />
          </div>
          <button className="mbs-topbar-close" onClick={handleClose}>
            <IconClose size={16} />
          </button>
        </div>
      )}

      {/* Step content */}
      {step === 1 && (
        <div className="mbs-content">
          <div className="mbs-left">
            <div className="mbs-left-inner">
            <h2 className="mbs-title">Start unlocking Apollo's key features by connecting your mailbox</h2>
            <p className="mbs-desc text-body-sm">
              Connecting your mailbox lets Apollo send emails on your behalf, track replies, and sync your calendar for scheduling.
            </p>

            <div className="mbs-providers">
              {([
                { id: 'google' as Provider, name: 'Google', icon: <GoogleIcon /> },
                { id: 'outlook' as Provider, name: 'Microsoft Outlook', icon: <OutlookIcon /> },
                { id: 'other' as Provider, name: 'Other email provider', icon: <MailGenericIcon /> },
              ]).map((p) => (
                <button
                  key={p.id}
                  className={`mbs-provider${provider === p.id ? ' mbs-provider-selected' : ''}`}
                  onClick={() => setProvider(p.id)}
                >
                  <span className="mbs-provider-icon">{p.icon}</span>
                  <span className="mbs-provider-name text-body-sm">{p.name}</span>
                  <span className="mbs-provider-radio">
                    <span className="mbs-provider-radio-dot" />
                  </span>
                </button>
              ))}
            </div>

            <div className="mbs-legal">
              <button
                className={`mbs-legal-check${legalChecked ? ' mbs-legal-check-checked' : ''}`}
                onClick={() => setLegalChecked(!legalChecked)}
              >
                {legalChecked && <IconCheck size={10} />}
              </button>
              <span className="mbs-legal-text text-caption">
                I agree to the terms of service and acknowledge Apollo's privacy policy for email integration.
              </span>
            </div>

            <div className="mbs-actions">
              <Button variant="ghost" size="md" onClick={handleClose}>Back</Button>
              <Button variant="primary" size="md" onClick={() => setStep(2)}>
                Connect mailbox
              </Button>
              <button className="mbs-link-later" onClick={handleClose}>
                I'll do this later
              </button>
            </div>
            </div>
          </div>

          <div className="mbs-right">
            <FeatureCard locked />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mbs-content">
          <div className="mbs-oauth-backdrop">
            <div className="mbs-oauth-modal">
              <div className="mbs-oauth-google-logo">
                <GoogleIcon />
                <span>Sign in with Google</span>
              </div>

              <div className="mbs-oauth-heading">
                <span className="mbs-oauth-apollo-icon">
                  <IconApolloLogo size={20} />
                </span>
                <span className="mbs-oauth-heading-text">
                  Apollo wants access to your Google Account
                </span>
              </div>

              <div className="mbs-oauth-perms">
                {[
                  'Read, compose, and send emails from Gmail',
                  'View and edit events on Google Calendar',
                  'View your GSuite domain-wide settings',
                ].map((perm) => (
                  <div className="mbs-oauth-perm" key={perm}>
                    <span className="mbs-oauth-perm-check">
                      <IconCheck size={12} />
                    </span>
                    <span className="mbs-oauth-perm-label text-body-sm">{perm}</span>
                  </div>
                ))}
              </div>

              <p className="mbs-oauth-trust text-caption">
                Make sure you trust Apollo. You may be sharing sensitive info with this app.
              </p>

              <div className="mbs-oauth-actions">
                <button className="mbs-oauth-cancel" onClick={() => setStep(1)}>Cancel</button>
                <button className="mbs-oauth-continue" onClick={() => setStep(3)}>Continue</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mbs-content">
          <div className="mbs-left">
            <div className="mbs-left-inner">
            <div className="mbs-success-icon">
              <IconCheck size={24} />
            </div>
            <h2 className="mbs-title">Great! Your mailbox is connected</h2>
            <p className="mbs-desc text-body-sm">
              You're all set. Apollo can now send emails on your behalf, track replies, and sync your calendar for scheduling.
            </p>

            <div className="mbs-actions">
              <Button variant="ghost" size="md" onClick={() => setStep(2)}>Back</Button>
              <Button variant="primary" size="md" onClick={handleDone}>
                Done
              </Button>
            </div>
            </div>
          </div>

          <div className="mbs-right">
            <FeatureCard locked={false} />
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ locked }: { locked: boolean }) {
  return (
    <div className="mbs-feature-card">
      <h3 className="mbs-feature-header">Unlock Apollo's key features</h3>
      <div className="mbs-feature-connector" />
      <div className={`mbs-feature-label${!locked ? ' mbs-feature-label-unlocked' : ''}`}>
        {locked ? 'Locked key features' : 'Unlocked!'}
      </div>
      <div className="mbs-feature-list">
        {features.map((f) => (
          <div
            key={f.label}
            className={`mbs-feature-row${!locked ? ' mbs-feature-row-unlock' : ''}`}
          >
            <span className="mbs-feature-row-icon">{f.icon}</span>
            <span className="mbs-feature-row-text text-body-sm">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
