import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockContacts } from '@/data/mockContacts'
import Avatar from '@/components/shared/Avatar'
import Badge from '@/components/shared/Badge'
import Button from '@/components/shared/Button'
import Tabs from '@/components/shared/Tabs'
import {
  IconCheck,
  IconSparkle,
  IconPlus,
  IconClose,
} from '@/components/shared/Icons'
import './EnrollConfirmPage.css'

const enrolledContacts = mockContacts.slice(0, 4)
const recentlySaved = mockContacts.slice(4, 9)

interface StepData {
  id: number
  label: string
  format: string
  tone: string
  signals: number
  subject: string
  body: string
  length: number // 0-100
}

const initialSteps: StepData[] = [
  {
    id: 1,
    label: 'Step 1',
    format: 'Formal',
    tone: 'Custom tone',
    signals: 3,
    subject: 'Sustainability messaging and product series',
    body: `Hey Ivan,

Your 2024 Global Impact Report on science-based climate targets got me curious about Zendrek's supplier choices.

Given your Senior Product Designer role, I imagine that touches how you think about materials, packaging, and product stories.

Many teams now struggle to make sustainability messaging feel real while still looking playful and on-brand. I get how that tension can slow decisions and muddle how you present value.

Open to a quick chat on this?`,
    length: 45,
  },
  {
    id: 2,
    label: 'Step 2',
    format: 'Custom tone',
    tone: 'Custom tone',
    signals: 5,
    subject: '',
    body: `Hey Ivan,

Your Global Impact Report on science-based climate targets got me thinking about Zendrek's physical touchpoints.

As Senior Product Designer, you likely shape how those choices show up.

Open to connect?`,
    length: 35,
  },
  {
    id: 3,
    label: 'Step 3',
    format: 'Direct',
    tone: 'Direct',
    signals: 0,
    subject: '',
    body: '',
    length: 0,
  },
  {
    id: 4,
    label: 'Step 4',
    format: 'Direct',
    tone: 'Direct',
    signals: 0,
    subject: '',
    body: `Hey Ivan,

Your Global Impact Report on science-based climate targets got me thinking about Zendrek's physical touchpoints.

As Senior Product Designer, you likely shape how those choices show up.

Open to connect?`,
    length: 40,
  },
  {
    id: 5,
    label: 'Step 5',
    format: 'Direct',
    tone: 'Direct',
    signals: 0,
    subject: '',
    body: `Hey Ivan,

Your Global Impact Report on science-based climate targets got me thinking about Zendrek's physical touchpoints.

As Senior Product Designer, you likely shape how those choices show up.

Open to connect?`,
    length: 35,
  },
]

const detailTabs = [
  { id: 'preview', label: 'Preview' },
  { id: 'insights', label: 'Insights' },
  { id: 'about', label: 'About' },
]

const topTabs = [
  { id: 'editor', label: 'Editor' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'activity', label: 'Activity' },
  { id: 'report', label: 'Report' },
  { id: 'settings', label: 'Settings' },
]

export default function EnrollConfirmPage() {
  const navigate = useNavigate()
  const [selectedContactId, setSelectedContactId] = useState(enrolledContacts[0].id)
  const [activeDetailTab, setActiveDetailTab] = useState('preview')
  const [activeTopTab, setActiveTopTab] = useState('editor')
  const [hoveredConnector, setHoveredConnector] = useState<number | null>(null)
  const [addStepPopover, setAddStepPopover] = useState<number | null>(null)
  const [refineStepId, setRefineStepId] = useState<number | null>(null)
  const [activated, setActivated] = useState(false)

  const selectedContact = [...enrolledContacts, ...recentlySaved].find(
    (c) => c.id === selectedContactId
  )!

  if (activated) {
    return (
      <div className="enroll-page enroll-page-center">
        <div className="enroll-success-card">
          <div className="enroll-success-icon">
            <IconCheck size={32} />
          </div>
          <h2 className="text-title-md">Sequence activated</h2>
          <p className="text-body-sm text-secondary">
            {enrolledContacts.length} contacts enrolled. First emails send Monday at 9:00 AM.
          </p>
          <div className="enroll-success-actions">
            <Button variant="primary" onClick={() => navigate('/triage')}>
              Go to Inbox
            </Button>
            <Button variant="ghost" onClick={() => navigate('/search')}>
              Back to search
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="enroll-page">
      {/* Sequence top bar */}
      <div className="seq-topbar">
        <div className="seq-topbar-left">
          <span className="seq-name text-subtitle-lg">Cold Outbound — Decision Makers</span>
          <Badge variant="gray" size="sm">Inactive</Badge>
        </div>
        <Tabs
          tabs={topTabs}
          activeId={activeTopTab}
          onTabChange={setActiveTopTab}
          variant="underline"
          className="seq-top-tabs"
        />
        <div className="seq-topbar-right">
          <button className="seq-topbar-icon-btn">
            <IconSparkle size={16} />
          </button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/search')}>
            <IconPlus size={14} />
            Add contacts
          </Button>
          <Button variant="primary" size="sm" onClick={() => setActivated(true)}>
            Activate
          </Button>
        </div>
      </div>

      <div className="seq-body">
        {/* Left — contact list */}
        <div className="seq-contacts">
          <div className="seq-contacts-header">
            <span className="text-subtitle-lg">Preview sample</span>
            <span className="text-caption text-secondary">
              Select a contact to get a sense of your sequence.
            </span>
          </div>

          <div className="seq-contacts-meta">
            <div className="seq-avatar-stack">
              {enrolledContacts.slice(0, 3).map((c) => (
                <Avatar
                  key={c.id}
                  initials={c.name.split(' ').map((w) => w[0]).join('')}
                  size="sm"
                />
              ))}
            </div>
            <span className="text-caption text-secondary">
              / {enrolledContacts.length} contact{enrolledContacts.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="seq-contact-list">
            {enrolledContacts.map((c) => (
              <button
                key={c.id}
                className={`seq-contact-item ${selectedContactId === c.id ? 'seq-contact-active' : ''}`}
                onClick={() => setSelectedContactId(c.id)}
              >
                <Avatar
                  initials={c.name.split(' ').map((w) => w[0]).join('')}
                  size="sm"
                />
                <div className="seq-contact-info">
                  <span className="text-body-sm font-medium">{c.name}</span>
                  <span className="text-caption text-secondary">
                    {selectedContactId === c.id ? 'Currently viewing' : 'Click to preview'}
                  </span>
                </div>
              </button>
            ))}

            <button className="seq-add-contact">
              <IconPlus size={14} />
              <span className="text-body-sm">Add contact</span>
            </button>
          </div>

          <div className="seq-recently-saved">
            <span className="text-caption text-tertiary">Recently saved</span>
            {recentlySaved.map((c) => (
              <button
                key={c.id}
                className={`seq-contact-item ${selectedContactId === c.id ? 'seq-contact-active' : ''}`}
                onClick={() => setSelectedContactId(c.id)}
              >
                <Avatar
                  initials={c.name.split(' ').map((w) => w[0]).join('')}
                  size="sm"
                />
                <div className="seq-contact-info">
                  <span className="text-body-sm font-medium">{c.name}</span>
                  <span className="text-caption text-secondary">
                    {selectedContactId === c.id ? 'Currently viewing' : 'Click to preview'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — sequence editor */}
        <div className="seq-editor">
          {/* Contact header */}
          <div className="seq-editor-contact">
            <span className="text-subtitle-lg">{selectedContact.name}</span>
            <span className="seq-editor-contact-icons">
              <IconClose size={14} />
            </span>
          </div>
          <div className="text-caption text-secondary" style={{ marginTop: '-8px' }}>
            {selectedContact.title} · {selectedContact.department} at {selectedContact.company}
          </div>

          <Tabs
            tabs={detailTabs}
            activeId={activeDetailTab}
            onTabChange={setActiveDetailTab}
            variant="underline"
            className="seq-detail-tabs"
          />

          {/* Steps */}
          <div className="seq-steps">
            {initialSteps.map((step, idx) => (
              <div key={step.id} className="seq-step-wrapper">
                {/* Step header */}
                <div className="seq-step-header">
                  <div className="seq-step-header-left">
                    {idx === initialSteps.length - 1 && (
                      <Badge variant="yellow" size="sm">Test A</Badge>
                    )}
                    <Badge variant="gray" size="sm">{step.label} ↓</Badge>
                    <Badge variant="gray" size="sm">{step.format} ↓</Badge>
                    {step.signals > 0 && (
                      <Badge variant="gray" size="sm">Signals {step.signals} ↓</Badge>
                    )}
                  </div>
                  <div className="seq-step-header-right">
                    {step.body && (
                      <button
                        className="seq-step-refine-btn"
                        onClick={() => setRefineStepId(refineStepId === step.id ? null : step.id)}
                      >
                        <IconSparkle size={13} />
                      </button>
                    )}
                    <span className="text-caption text-tertiary">···</span>
                  </div>
                </div>

                {/* Refine prompt */}
                {refineStepId === step.id && (
                  <div className="seq-refine-bar">
                    <Badge variant="gray" size="sm">Refine ↓</Badge>
                    <input
                      className="seq-refine-input"
                      placeholder={`What would you like to change about "${step.label}"?`}
                    />
                    <Button variant="ghost" size="sm" onClick={() => setRefineStepId(null)}>Cancel</Button>
                    <Button variant="primary" size="sm">Apply</Button>
                  </div>
                )}

                {/* Step body — email content */}
                {step.body ? (
                  <div className="seq-step-body">
                    {step.subject && (
                      <div className="seq-step-subject">
                        <span className="text-caption text-secondary">Subject</span>
                        <span className="text-body-sm">{step.subject}</span>
                      </div>
                    )}
                    <div className="seq-step-email text-body-sm">
                      {step.body.split('\n\n').map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    <div className="seq-step-footer">
                      <div className="seq-step-length">
                        <span className="text-caption text-secondary">Length</span>
                        <div className="seq-length-track">
                          <div
                            className="seq-length-fill"
                            style={{ width: `${step.length}%` }}
                          />
                          <div
                            className="seq-length-thumb"
                            style={{ left: `${step.length}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-caption text-tertiary">Full AI email</span>
                    </div>
                  </div>
                ) : (
                  <div className="seq-step-empty">
                    <div className="seq-step-empty-input">
                      <span className="text-caption text-tertiary">Type / to insert a dynamic variable</span>
                    </div>
                    <div className="seq-step-empty-toolbar">
                      <span className="text-caption text-tertiary">T</span>
                      <span className="text-caption text-tertiary">{ }</span>
                      <span className="text-caption text-tertiary">Preview</span>
                      <span className="text-caption text-tertiary" style={{ marginLeft: 'auto' }}>Custom</span>
                    </div>
                  </div>
                )}

                {/* Connector line with "Add step" */}
                {idx < initialSteps.length - 1 && (
                  <div
                    className="seq-connector"
                    onMouseEnter={() => setHoveredConnector(idx)}
                    onMouseLeave={() => {
                      if (addStepPopover !== idx) setHoveredConnector(null)
                    }}
                  >
                    <div className="seq-connector-line" />
                    {(hoveredConnector === idx || addStepPopover === idx) && (
                      <button
                        className="seq-add-step-btn"
                        onClick={() => setAddStepPopover(addStepPopover === idx ? null : idx)}
                      >
                        Add step
                      </button>
                    )}
                    {addStepPopover === idx && (
                      <div className="seq-add-step-popover">
                        <div className="seq-popover-field">
                          <span className="text-caption font-medium">Channel</span>
                          <div className="seq-popover-pills">
                            <Badge variant="blue" size="sm">Email</Badge>
                            <Badge variant="gray" size="sm">LinkedIn</Badge>
                            <Badge variant="gray" size="sm">Other</Badge>
                          </div>
                        </div>
                        <div className="seq-popover-field">
                          <span className="text-caption font-medium">Choose the email type</span>
                          <div className="seq-popover-select">Custom</div>
                        </div>
                        <div className="seq-popover-field">
                          <span className="text-caption font-medium">Tone</span>
                          <div className="seq-popover-select">Casual</div>
                        </div>
                        <div className="seq-popover-field">
                          <span className="text-caption font-medium">Length</span>
                          <div className="seq-popover-select">Default</div>
                        </div>
                        <div className="seq-popover-actions">
                          <Button variant="ghost" size="sm" onClick={() => { setAddStepPopover(null); setHoveredConnector(null) }}>Cancel</Button>
                          <Button variant="primary" size="sm" onClick={() => { setAddStepPopover(null); setHoveredConnector(null) }}>Add step</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
