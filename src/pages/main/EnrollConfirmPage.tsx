import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockContacts } from '@/data/mockContacts'
import Avatar from '@/components/shared/Avatar'
import Badge from '@/components/shared/Badge'
import Button from '@/components/shared/Button'
import Tabs from '@/components/shared/Tabs'
import EmailComposeDrawer from '@/components/shared/EmailComposeDrawer'
import {
  IconSparkle,
  IconPlus,
  IconClose,
  IconChevronLeft,
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
    subject: 'Following up — sustainability at Zendrek',
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
    body: `Hey Ivan,

Just bumping this up in case my earlier notes got buried.

Happy to share a quick overview if that's easier than a call.

Open to connect?`,
    length: 25,
  },
  {
    id: 4,
    label: 'Step 4',
    format: 'Direct',
    tone: 'Direct',
    signals: 0,
    subject: 'Still worth a conversation?',
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
    subject: 'Closing the loop',
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
  const [stepModes, setStepModes] = useState<Record<number, 'ai' | 'manual'>>({})
  const [manualContent, setManualContent] = useState<Record<number, { subject: string; body: string }>>({})

  const getStepMode = (id: number) => stepModes[id] ?? 'ai'
  const setStepMode = (id: number, mode: 'ai' | 'manual') =>
    setStepModes(prev => ({ ...prev, [id]: mode }))
  const getManual = (step: StepData) => manualContent[step.id] ?? { subject: step.subject, body: step.body }
  const setManual = (id: number, field: 'subject' | 'body', value: string) =>
    setManualContent(prev => ({ ...prev, [id]: { ...getManual(initialSteps.find(s => s.id === id)!), [field]: value } }))

  const selectedContact = [...enrolledContacts, ...recentlySaved].find(
    (c) => c.id === selectedContactId
  )!

  if (activated) {
    return (
      <div className="seq-activate-overlay">
        <div className="seq-activate-backdrop" />
        <div className="seq-activate-content">
          <div className="seq-activate-check">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" fill="var(--color-accent-green)" />
              <path
                d="M18 28.5L25 35.5L38 21"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="seq-activate-check-path"
              />
            </svg>
          </div>
          <h2 className="seq-activate-heading text-title-lg">Sequence activated</h2>
          <p className="seq-activate-sub text-body-sm">
            {enrolledContacts.length} contacts enrolled. First emails send Monday at 9:00 AM.
          </p>
          <div className="seq-activate-actions">
            <button className="seq-activate-btn-primary" onClick={() => { setActivated(false); setActiveTopTab('contacts') }}>
              View contacts
            </button>
            <button className="seq-activate-btn-ghost" onClick={() => navigate('/search')}>
              Back to search
            </button>
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
          <button className="seq-back-btn" onClick={() => navigate('/sequences')}>
            <IconChevronLeft size={16} />
          </button>
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

      {activeTopTab === 'contacts' && <SequenceContactsView />}

      <div className="seq-body" style={{ display: activeTopTab === 'editor' ? 'flex' : 'none' }}>
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
                    <Badge variant="blue" size="sm">{step.label} ↓</Badge>
                    {getStepMode(step.id) === 'ai' && (
                      <>
                        <Badge variant="gray" size="sm">{step.format} ↓</Badge>
                        {step.signals > 0 && (
                          <Badge variant="gray" size="sm">Signals {step.signals} ↓</Badge>
                        )}
                      </>
                    )}
                  </div>
                  <div className="seq-step-header-right">
                    <div className="seq-mode-toggle">
                      <button
                        className={`seq-mode-btn ${getStepMode(step.id) === 'ai' ? 'seq-mode-btn-active' : ''}`}
                        onClick={() => setStepMode(step.id, 'ai')}
                      >
                        <IconSparkle size={11} />
                        Write with AI
                      </button>
                      <button
                        className={`seq-mode-btn ${getStepMode(step.id) === 'manual' ? 'seq-mode-btn-active' : ''}`}
                        onClick={() => setStepMode(step.id, 'manual')}
                      >
                        Write your own
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step body — email content */}
                {step.body ? (
                  <div className="seq-step-body">
                    {getStepMode(step.id) === 'manual' ? (
                      <>
                        <div className="seq-step-subject">
                          <span className="text-caption text-secondary">Subject</span>
                          <input
                            className="seq-manual-subject text-body-sm"
                            value={getManual(step).subject}
                            onChange={e => setManual(step.id, 'subject', e.target.value)}
                            placeholder="Subject line"
                          />
                        </div>
                        <textarea
                          className="seq-manual-body text-body-sm"
                          value={getManual(step).body}
                          onChange={e => setManual(step.id, 'body', e.target.value)}
                          placeholder="Write your email..."
                          rows={6}
                        />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                    {refineStepId === step.id ? (
                      <div className="seq-refine-bar">
                        <Badge variant="gray" size="sm">Refine ↓</Badge>
                        <input
                          className="seq-refine-input"
                          placeholder={`What would you like to change about "${step.label}"?`}
                          autoFocus
                        />
                        <Button variant="ghost" size="sm" onClick={() => setRefineStepId(null)}>Cancel</Button>
                        <Button variant="primary" size="sm">Apply</Button>
                      </div>
                    ) : (
                      <div className="seq-step-footer">
                        {getStepMode(step.id) === 'ai' && (
                          <div className="seq-step-length">
                            <span className="text-caption text-secondary">Length</span>
                            <div className="seq-length-track">
                              <div className="seq-length-fill" style={{ width: `${step.length}%` }} />
                              <div className="seq-length-thumb" style={{ left: `${step.length}%` }} />
                            </div>
                          </div>
                        )}
                        <button
                          className="seq-step-refine-btn"
                          onClick={() => setRefineStepId(step.id)}
                        >
                          <IconSparkle size={13} />
                        </button>
                      </div>
                    )}
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

const contactFilters = ['All', 'Upcoming', 'Step 1', 'Step 2', 'Replied', 'Opened', 'Meeting booked']

const stepSubjects = [
  'Sustainability messaging and product series',
  'Following up — sustainability at your company',
  'Quick question for you',
  'Still worth a conversation?',
  'Closing the loop',
]

function buildStepBody(stepIdx: number, firstName: string, company: string) {
  const bodies = [
    `Hey ${firstName},\n\nYour 2024 Global Impact Report on science-based climate targets got me curious about ${company}'s supplier choices.\n\nGiven your role, I imagine that touches how you think about materials, packaging, and product stories.\n\nMany teams now struggle to make sustainability messaging feel real while still looking playful and on-brand. I get how that tension can slow decisions.\n\nOpen to a quick chat on this?`,
    `Hey ${firstName},\n\nFollowing up on my last note — ${company}'s trajectory around sustainability has me thinking there's a timely angle here.\n\nAs someone shaping how those choices show up, you'd know better than anyone where the gaps are.\n\nWould a 15-minute call this week make sense?`,
    `Hey ${firstName},\n\nJust bumping this up in case my earlier emails got buried. Happy to share a quick overview if that's easier than a call.\n\nOpen to connect?`,
    `Hey ${firstName},\n\nI'll keep this short — wanted to check in one more time before I stop reaching out.\n\nWorth a quick chat?`,
    `Hey ${firstName},\n\nLast note from me — if the timing ever gets better, feel free to reach back out. Happy to pick up where we left off.`,
  ]
  return bodies[stepIdx] ?? bodies[0]
}

const statusList = ['Upcoming', 'Active', 'Replied', 'Opened', 'Active', 'Meeting booked', 'Upcoming', 'Active', 'Replied', 'Opened', 'Upcoming', 'Active']

const seqContactRows = mockContacts.slice(0, 12).map((c, i) => {
  const currentStep = (i % 5) + 1
  const firstName = c.name.split(' ')[0]
  const stepEmails: (string | null)[] = Array.from({ length: 5 }, (_, s) =>
    s < currentStep ? buildStepBody(s, firstName, c.company) : null
  )
  return {
    ...c,
    status: statusList[i % 12],
    step: `Step ${currentStep}`,
    stepEmails,
  }
})

interface ComposeState {
  body: string
  subject: string
  contactName: string
  contactEmail: string
  contactTitle: string
  contactCompany: string
}

function EmailCell({ body, subject, contactName, contactEmail, contactTitle, contactCompany, onOpen }: {
  body: string | null
  subject: string
  contactName: string
  contactEmail: string
  contactTitle: string
  contactCompany: string
  onOpen: (state: ComposeState) => void
}) {
  if (!body) return <span className="text-caption text-tertiary">—</span>

  const preview = body.split('\n').find(l => l.trim()) ?? ''

  return (
    <div
      className="seq-email-cell"
      onClick={() => onOpen({ body, subject, contactName, contactEmail, contactTitle, contactCompany })}
    >
      <span className="seq-email-preview text-caption">{preview}</span>
      <div className="seq-email-popover">
        <p className="text-caption">{body}</p>
      </div>
    </div>
  )
}

function SequenceContactsView() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [composeState, setComposeState] = useState<ComposeState | null>(null)

  const filtered = activeFilter === 'All'
    ? seqContactRows
    : seqContactRows.filter((r) => r.status === activeFilter)

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map((r) => r.id)))
  }

  const toggle = (id: number) => {
    const next = new Set(selectedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedIds(next)
  }

  return (
    <div className="seq-contacts-view">
      {/* Inner sidebar */}
      <div className="seq-contacts-sidebar">
        <div className="seq-contacts-sidebar-header">
          <span className="text-subtitle-lg">Contacts</span>
          <span className="text-caption text-secondary">{seqContactRows.length} enrolled in this sequence</span>
        </div>
        {contactFilters.map((f) => (
          <button
            key={f}
            className={`seq-contacts-filter ${activeFilter === f ? 'seq-contacts-filter-active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="seq-contacts-table-wrap">
        <table className="seq-contacts-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
              <th>Name</th>
              <th>Status</th>
              <th>Step</th>
              {stepSubjects.map((_, i) => (
                <th key={i}>Step {i + 1} email</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className={selectedIds.has(row.id) ? 'seq-row-selected' : ''}>
                <td><input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggle(row.id)} /></td>
                <td>
                  <div className="seq-contact-name-cell">
                    <span className="text-body-sm font-medium">{row.name}</span>
                    <span className="text-caption text-secondary">{row.company}</span>
                  </div>
                </td>
                <td><span className={`seq-status-badge seq-status-${row.status.toLowerCase().replace(/ /g, '-')}`}>{row.status}</span></td>
                <td className="text-body-sm text-secondary">{row.step}</td>
                {row.stepEmails.map((body, s) => (
                  <td key={s}>
                    <EmailCell
                      body={body}
                      subject={stepSubjects[s]}
                      contactName={row.name}
                      contactEmail={`${row.name.toLowerCase().replace(/\s+/g, '.')}@${row.company.toLowerCase().replace(/\s+/g, '')}.com`}
                      contactTitle={row.title}
                      contactCompany={row.company}
                      onOpen={setComposeState}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compose drawer */}
      {composeState && (
        <div className="seq-compose-drawer-wrap">
          <EmailComposeDrawer
            initialBody={composeState.body}
            initialSubject={composeState.subject}
            sendLabel="Update"
            contacts={[{
              name: composeState.contactName,
              email: composeState.contactEmail,
              title: composeState.contactTitle,
              company: composeState.contactCompany,
              signals: [],
            }]}
            onClose={() => setComposeState(null)}
            onBack={() => setComposeState(null)}
          />
        </div>
      )}
    </div>
  )
}
