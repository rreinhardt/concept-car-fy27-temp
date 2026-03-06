import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import preloaderData from '@/assets/lottie-preloader.json'
import Button from './Button'
import './SendingOverlay.css'

interface SendingOverlayProps {
  contactName: string
  onViewInbox: () => void
  onBackToSearch: () => void
}

export default function SendingOverlay({
  contactName,
  onViewInbox,
  onBackToSearch,
}: SendingOverlayProps) {
  const [phase, setPhase] = useState<'sending' | 'success'>('sending')

  useEffect(() => {
    const timer = setTimeout(() => setPhase('success'), 2700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="sending-overlay">
      <div className="sending-overlay-backdrop" />

      <div className="sending-overlay-content">
        {phase === 'sending' ? (
          <div className="sending-loader" key="sending">
            <div className="sending-lottie">
              <Lottie animationData={preloaderData} loop />
            </div>
            <p className="sending-label text-body-sm">Sending...</p>
          </div>
        ) : (
          <div className="sending-success" key="success">
            {/* Confetti particles */}
            <div className="sending-confetti" aria-hidden>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="sending-confetti-dot" style={{ '--i': i } as React.CSSProperties} />
              ))}
            </div>

            {/* Checkmark */}
            <div className="sending-check">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="var(--color-accent-green)" />
                <path
                  d="M15 24.5L21.5 31L33 18"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sending-check-path"
                />
              </svg>
            </div>

            <h2 className="sending-heading text-title-md">Email sent!</h2>
            <p className="sending-subtext text-body-sm">
              Your email to {contactName} is on its way
            </p>

            <div className="sending-actions">
              <Button variant="secondary" size="md" onClick={onViewInbox}>
                View inbox
              </Button>
              <Button variant="primary" size="md" onClick={onBackToSearch}>
                Back to search
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
