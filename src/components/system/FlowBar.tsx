import { useLocation, useNavigate } from 'react-router-dom'
import { IconChevronLeft, IconChevronRight } from '@/components/shared/Icons'
import './FlowBar.css'

const flowSteps = [
  { path: '/', label: 'Sign Up' },
  { path: '/verified', label: 'Verified' },
  { path: '/welcome', label: 'Welcome' },
  { path: '/knowledge-base', label: 'Knowledge Base' },
  { path: '/target-audience', label: 'Target Audience' },
  { path: '/search', label: 'Search' },
  { path: '/review', label: 'Review + Reveal' },
  { path: '/save-to-list', label: 'Save to List' },
  { path: '/sequences', label: 'Sequences' },
  { path: '/enroll', label: 'Enroll' },
  { path: '/triage', label: 'Triage' },
  { path: '/meeting-booked', label: 'Meeting' },
  { path: '/diagnostic', label: 'Diagnostic' },
  { path: '/home', label: 'Scorecard' },
]

export default function FlowBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentIndex = flowSteps.findIndex((s) => s.path === location.pathname)
  const prev = currentIndex > 0 ? flowSteps[currentIndex - 1] : null
  const next = currentIndex < flowSteps.length - 1 ? flowSteps[currentIndex + 1] : null

  return (
    <div className="flowbar">
      <button
        className="flowbar-nav-btn"
        disabled={!prev}
        onClick={() => prev && navigate(prev.path)}
      >
        <IconChevronLeft size={14} />
        <span>{prev?.label || ''}</span>
      </button>

      <div className="flowbar-steps">
        {flowSteps.map((step, i) => (
          <button
            key={step.path}
            className={`flowbar-dot ${i === currentIndex ? 'flowbar-dot-active' : ''} ${i < currentIndex ? 'flowbar-dot-done' : ''}`}
            onClick={() => navigate(step.path)}
            title={step.label}
          />
        ))}
      </div>

      <div className="flowbar-label text-caption">
        {currentIndex >= 0 ? `${currentIndex + 1}/${flowSteps.length} — ${flowSteps[currentIndex].label}` : ''}
      </div>

      <button
        className="flowbar-nav-btn"
        disabled={!next}
        onClick={() => next && navigate(next.path)}
      >
        <span>{next?.label || ''}</span>
        <IconChevronRight size={14} />
      </button>
    </div>
  )
}
