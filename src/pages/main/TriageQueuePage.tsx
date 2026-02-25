import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { triageItems } from '@/data/mockMetrics'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import Avatar from '@/components/shared/Avatar'
import { IconMail } from '@/components/shared/Icons'
import './TriageQueuePage.css'

export default function TriageQueuePage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(triageItems[0].id)
  const selected = triageItems.find((t) => t.id === selectedId)!

  const typeColor = {
    reply: 'green' as const,
    open: 'yellow' as const,
    bounce: 'red' as const,
  }
  const typeLabel = {
    reply: 'Reply',
    open: 'Opened',
    bounce: 'Bounce',
  }

  return (
    <div className="triage-page">
      {/* Left — task list */}
      <div className="triage-list">
        <div className="triage-list-header">
          <h2 className="text-title-md">Inbox</h2>
          <Badge variant="red" size="sm">{triageItems.length}</Badge>
        </div>
        <p className="text-caption text-secondary triage-list-sub">Sorted by urgency</p>

        <div className="triage-items">
          {triageItems.map((item) => (
            <button
              key={item.id}
              className={`triage-item ${selectedId === item.id ? 'triage-item-active' : ''}`}
              onClick={() => setSelectedId(item.id)}
            >
              <div className="triage-item-top">
                <Badge variant={typeColor[item.type]} size="sm">{typeLabel[item.type]}</Badge>
                <span className="text-caption text-tertiary">{item.time}</span>
              </div>
              <div className="triage-item-name text-body-sm font-medium">{item.contact}</div>
              <div className="text-caption text-secondary">{item.company} &middot; {item.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right — thread detail */}
      <div className="triage-detail">
        <div className="triage-detail-header">
          <Avatar initials={selected.contact.split(' ').map((w) => w[0]).join('')} size="lg" />
          <div>
            <h3 className="text-title-sm">{selected.contact}</h3>
            <p className="text-body-sm text-secondary">{selected.title} at {selected.company}</p>
          </div>
          <Badge variant={typeColor[selected.type]} size="sm">{typeLabel[selected.type]}</Badge>
        </div>

        <div className="triage-context">
          <span className="text-caption text-secondary">Triggered by:</span>
          <span className="text-body-sm">{selected.sequenceStep}</span>
        </div>

        {/* Thread preview */}
        <div className="triage-thread">
          {selected.type === 'reply' ? (
            <div className="triage-message">
              <div className="triage-message-header">
                <IconMail size={14} />
                <span className="text-subtitle-lg">{selected.contact}'s reply</span>
              </div>
              <p className="text-body-sm">{selected.preview}</p>
            </div>
          ) : (
            <div className="triage-signal">
              <p className="text-body-sm text-secondary">{selected.preview}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="triage-actions">
          {selected.type === 'reply' && (
            <>
              <Button variant="primary" onClick={() => navigate('/meeting-booked')}>
                Book meeting
              </Button>
              <Button variant="secondary">Reply</Button>
              <Button variant="ghost">Add note</Button>
            </>
          )}
          {selected.type === 'open' && (
            <>
              <Button variant="primary">Reply</Button>
              <Button variant="secondary" onClick={() => navigate('/meeting-booked')}>
                Book meeting
              </Button>
              <Button variant="ghost">Skip</Button>
            </>
          )}
          {selected.type === 'bounce' && (
            <>
              <Button variant="primary" onClick={() => navigate('/diagnostic')}>
                Diagnose
              </Button>
              <Button variant="secondary">Re-enrich</Button>
              <Button variant="ghost">Archive</Button>
            </>
          )}
        </div>

        {/* Next item hint */}
        <div className="triage-next-hint">
          <p className="text-caption text-tertiary">
            {triageItems.length - 1} more items in your triage queue
          </p>
        </div>
      </div>
    </div>
  )
}
