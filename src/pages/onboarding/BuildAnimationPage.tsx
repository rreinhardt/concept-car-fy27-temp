import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './BuildAnimationPage.css'

const steps = [
  {
    icon: 'logo',
    heading: 'Welcome to Apollo',
    subtext: '',
  },
  {
    icon: 'logo',
    heading: "You're ready to start",
    subtext: '',
  },
  {
    icon: 'person',
    heading: 'Personalizing your workspace',
    subtext: 'Finalizing key details',
  },
  {
    icon: 'building',
    heading: 'Personalizing your workspace',
    subtext: 'Gathering company details',
  },
]

export default function BuildAnimationPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (step >= steps.length) {
      navigate('/knowledge-base')
      return
    }

    const timer = setTimeout(() => {
      setFading(true)
      setTimeout(() => {
        setStep((s) => s + 1)
        setFading(false)
      }, 300)
    }, 1800)

    return () => clearTimeout(timer)
  }, [step, navigate])

  if (step >= steps.length) return null

  const current = steps[step]

  return (
    <div className="build-page">
      <div className={`build-content ${fading ? 'build-fading' : 'build-visible'}`}>
        {/* Step badges */}
        <div className="build-badges">
          {step >= 0 && <span className="build-badge">1</span>}
          {step >= 2 && <span className="build-badge">2</span>}
        </div>

        {/* Icon */}
        <div className="build-icon">
          {current.icon === 'logo' && (
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="2.5" fill="currentColor" />
              <path d="M16 4V12M16 20V28M4 16H12M20 16H28M7.5 7.5L12.2 12.2M19.8 19.8L24.5 24.5M24.5 7.5L19.8 12.2M12.2 19.8L7.5 24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {current.icon === 'person' && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" />
              <path d="M8 42c0-8.84 7.16-16 16-16s16 7.16 16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
          {current.icon === 'building' && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="6" width="20" height="36" rx="2" stroke="currentColor" strokeWidth="2.5" />
              <rect x="28" y="18" width="12" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" />
              <rect x="13" y="12" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="13" y="22" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="21" y="12" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="21" y="22" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="32" y="24" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="32" y="32" width="4" height="4" rx="1" fill="currentColor" />
            </svg>
          )}
        </div>

        {/* Text */}
        <h1 className="build-heading text-display-sm">{current.heading}</h1>
        {current.subtext && (
          <p className="build-subtext text-body-lg text-secondary">{current.subtext}</p>
        )}
      </div>

      {/* Skip */}
      <button
        className="build-skip text-caption text-tertiary"
        onClick={() => navigate('/knowledge-base')}
      >
        Click to skip
      </button>
    </div>
  )
}
