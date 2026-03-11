import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockSequences } from '@/data/mockSequences'
import type { Sequence } from '@/data/mockSequences'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import Tabs from '@/components/shared/Tabs'
import PageLayout from '@/components/shared/PageLayout'
import {
  IconSparkle,
  IconPlus,
  IconChevronRight,
} from '@/components/shared/Icons'
import '../main/SearchPage.css'
import './SequencePickerPage.css'

const goalTabs = [
  { id: 'all', label: 'All' },
  { id: 'Book meeting', label: 'Book meeting' },
  { id: 'Nurture', label: 'Nurture' },
  { id: 'Reactivate', label: 'Reactivate' },
]

const activeSequences = [
  'Cold Outbound — Decision Makers',
  'Warm Nurture — Recent Engagement',
  'Event Follow-Up',
  'Competitive Displacement',
  'Inbound Demo Request',
  'Partner Channel Outreach',
]

const inactiveCount = 4

export default function SequencePickerPage() {
  const navigate = useNavigate()
  const [activeGoal, setActiveGoal] = useState('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const filtered = activeGoal === 'all'
    ? mockSequences
    : mockSequences.filter((s) => s.goal === activeGoal)

  const selected: Sequence | undefined = mockSequences.find((s) => s.id === selectedId)

  const sidebar = (
    <>
      <button
        className="seqp-sidebar-item seqp-sidebar-item-active"
        onClick={() => {}}
      >
        <IconPlus size={14} />
        <span className="text-body-sm font-medium">Create new</span>
      </button>

      <div className="seqp-sidebar-section">
        <span className="seqp-sidebar-section-label text-caption text-tertiary">Active Sequences</span>
        <div className="seqp-sidebar-list">
          {activeSequences.map((name) => (
            <button key={name} className="seqp-sidebar-item">
              <span className="text-body-sm">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="seqp-sidebar-item seqp-sidebar-inactive-link">
        <span className="text-body-sm text-secondary">Inactive Sequences</span>
        <IconChevronRight size={12} />
      </button>
    </>
  )

  const previewPanel = selected ? (
    <div className="seqp-preview-content">
      <div className="seqp-preview-header">
        <div className="seqp-preview-title-row">
          <h3 className="text-subtitle-lg">{selected.name}</h3>
          <button
            className="seqp-preview-close text-caption text-tertiary"
            onClick={() => setSelectedId(null)}
          >
            &times;
          </button>
        </div>
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

      <div className="seqp-preview-steps">
        <h4 className="text-caption font-medium">Sequence steps</h4>
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

      <Button variant="primary" onClick={() => navigate('/enroll')}>
        Use this sequence
      </Button>
    </div>
  ) : null

  return (
    <PageLayout
      title="Sequences"
      titleExtra={
        <div className="search-liveness">
          <span className="search-liveness-dot" />
          <span className="text-caption text-secondary">
            <strong>{activeSequences.length}</strong> active &middot; <strong>{inactiveCount}</strong> inactive
          </span>
        </div>
      }
      sidebar={sidebar}
      sidebarLabel="Sequences"
      mainClassName="seqp-main-wrapper"
      actionsPanel={previewPanel}
      actionsPanelOpen={!!selected}
      onActionsPanelToggle={(open) => { if (!open) setSelectedId(null) }}
    >
      <div className="search-table-frame seqp-main-content">
        <div className="seqp-header">
          <h3 className="text-subtitle-lg">Choose a sequence</h3>
          <p className="text-caption text-secondary">Select a template or create your own</p>
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
              onClick={() => setSelectedId(selectedId === seq.id ? null : seq.id)}
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
      </div>
    </PageLayout>
  )
}
