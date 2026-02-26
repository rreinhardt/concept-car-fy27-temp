import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconApolloLogo } from '@/components/shared/Icons'
import './BuildAnimationPage.css'

const steps = [
  {
    heading: 'Welcome to Apollo',
    subtext: '',
  },
  {
    heading: "You're ready to start",
    subtext: '',
  },
  {
    heading: 'Personalizing your workspace',
    subtext: 'Finalizing key details',
  },
  {
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
      }, 400)
    }, 1800)

    return () => clearTimeout(timer)
  }, [step, navigate])

  if (step >= steps.length) return null

  const current = steps[step]

  return (
    <div className="build-page">
      <div className="build-icon">
        <IconApolloLogo size={48} />
      </div>

      <div className={`build-content ${fading ? 'build-fading' : 'build-visible'}`}>
        <h1 className="build-heading text-display-sm">{current.heading}</h1>
        {current.subtext && (
          <p className="build-subtext text-body-lg text-secondary">{current.subtext}</p>
        )}
      </div>

      <button
        className="build-skip text-caption text-tertiary"
        onClick={() => navigate('/knowledge-base')}
      >
        Click to skip
      </button>
    </div>
  )
}
