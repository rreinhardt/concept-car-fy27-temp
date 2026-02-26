import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockSequences } from '@/data/mockSequences'
import type { Sequence } from '@/data/mockSequences'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import Tabs from '@/components/shared/Tabs'
import { IconSparkle } from '@/components/shared/Icons'
import './SequencePickerPage.css'

const goalTabs = [
  { id: 'all', label: 'All' },
  { id: 'Book meeting', label: 'Book meeting' },
  { id: 'Nurture', label: 'Nurture' },
  { id: 'Reactivate', label: 'Reactivate' },
]

export default function SequencePickerPage() {
  const navigate = useNavigate()
  const [activeGoal, setActiveGoal] = useState('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const filtered = activeGoal === 'all'
    ? mockSequences
    : mockSequences.filter((s) => s.goal === activeGoal)

  const selected: Sequence | undefined = mockSequences.find((s) => s.id === selectedId)

  return (
    <div className="seqp-page">
      {/* Main — card grid */}
      <div className="seqp-main">
        <div className="seqp-header">
          <h2 className="text-title-md">Choose a sequence</h2>
          <p className="text-body-sm text-secondary">Select a template or create your own</p>
        </div>

        <Tabs
          tabs={goalTabs}
          activeId={activeGoal}
          onTabChange={setActiveGoal}
          variant="pill"
          className="seqp-tabs"
        />

        <div className="seqp-grid">
          {filtered.map((seq) => (
            <button
              key={seq.id}
              className={`seqp-card ${selectedId === seq.id ? 'seqp-card-selected' : ''}`}
              onClick={() => setSelectedId(seq.id)}
            >
              <div className="seqp-card-top">
                <Badge
                  variant={seq.goal === 'Book meeting' ? 'blue' : seq.goal === 'Nurture' ? 'green' : 'yellow'}
                  size="sm"
                >
                  {seq.goal}
                </Badge>
                {seq.id <= 2 && (
                  <span className="seqp-card-ai">
                    <IconSparkle size={12} /> AI Recommended
                  </span>
                )}
              </div>
              <h3 className="text-body-sm font-medium">{seq.name}</h3>
              <p className="text-caption text-secondary">{seq.description}</p>
              <div className="seqp-card-meta text-caption text-tertiary">
                {seq.steps} steps &middot; {seq.days} days
              </div>
            </button>
          ))}
        </div>

        <div className="seqp-footer">
          <Button variant="ghost">Create new sequence</Button>
        </div>
      </div>

      {/* Preview panel — only shown when a sequence is selected */}
      {selected && (
        <div className="seqp-preview">
          <div className="seqp-preview-header">
            <h3 className="text-title-sm">{selected.name}</h3>
            <Badge
              variant={selected.goal === 'Book meeting' ? 'blue' : selected.goal === 'Nurture' ? 'green' : 'yellow'}
              size="sm"
            >
              {selected.goal}
            </Badge>
          </div>

          <div className="seqp-preview-stats">
            <div className="seqp-preview-stat">
              <span className="text-caption text-secondary">Steps</span>
              <span className="text-title-md">{selected.steps}</span>
            </div>
            <div className="seqp-preview-stat">
              <span className="text-caption text-secondary">Days</span>
              <span className="text-title-md">{selected.days}</span>
            </div>
          </div>

          <p className="text-body-sm text-secondary">{selected.description}</p>

          {/* Sample steps */}
          <div className="seqp-preview-steps">
            <h4 className="text-subtitle-lg">Sequence steps</h4>
            {Array.from({ length: selected.steps }, (_, i) => (
              <div key={i} className="seqp-preview-step">
                <div className="seqp-step-dot" />
                <div className="seqp-step-content">
                  <span className="text-body-sm font-medium">
                    {i === 0 ? 'Initial outreach' : i === selected.steps - 1 ? 'Break-up email' : `Follow-up ${i}`}
                  </span>
                  <span className="text-caption text-secondary">
                    Day {i === 0 ? 1 : Math.round((selected.days / selected.steps) * i)} &middot; Email
                    {i === 0 ? ' + AI personalization' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="seqp-preview-actions">
            <Button variant="primary" onClick={() => navigate('/enroll')}>
              Use this sequence
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
