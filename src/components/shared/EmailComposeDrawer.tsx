import { useState } from 'react'
import Button from './Button'
import Input from './Input'
import {
  IconClose,
  IconArrowLeft,
  IconChevronDown,
  IconChevronRight,
  IconSparkle,
} from './Icons'
import './EmailComposeDrawer.css'

interface ContactInfo {
  name: string
  email: string
  title: string
  company: string
  signals: string[]
}

interface EmailComposeDrawerProps {
  onClose: () => void
  onBack: () => void
  onSend?: () => void
  contacts?: ContactInfo[]
}

const mockAiEmail = `Hey Kenton,

I noticed Mercy Health has been expanding its operations team — congrats on the momentum.

As District Manager, I imagine coordinating quality standards across multiple sites gets more complex with every new hire.

We've been helping healthcare operations leaders streamline cross-site workflows without adding overhead. Teams like yours typically see a 40% reduction in coordination gaps within the first quarter.

Would you be open to a quick 15-minute call this week to explore if this could help?

Best,
Aaron Pfeiffer`

const defaultContact: ContactInfo = {
  name: 'Kenton Jast',
  email: 'kenton.jast@mercyhealth.org',
  title: 'District Manager',
  company: 'Mercy Health',
  signals: ['Hiring', 'High ICP fit'],
}

export default function EmailComposeDrawer({
  onClose,
  onBack,
  onSend,
  contacts,
}: EmailComposeDrawerProps) {
  const contactList = contacts && contacts.length > 0 ? contacts : [defaultContact]
  const [contactIdx, setContactIdx] = useState(0)
  const [mode, setMode] = useState<'ai' | 'manual'>('ai')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [aiSubject, setAiSubject] = useState('Scaling operations at Mercy Health')
  const [aiBody, setAiBody] = useState(mockAiEmail)

  const contact = contactList[contactIdx]
  const canCycle = contactList.length > 1
  const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const cycleNext = () => setContactIdx((i) => (i + 1) % contactList.length)

  const activeSubject = mode === 'ai' ? aiSubject : subject
  const activeBody = mode === 'ai' ? aiBody : body
  const setActiveSubject = mode === 'ai' ? setAiSubject : setSubject
  const setActiveBody = mode === 'ai' ? setAiBody : setBody

  return (
    <div className="ecd-panel">
      {/* Header */}
      <div className="ecd-header">
        <div className="ecd-header-left">
          <button className="ecd-back" onClick={onBack} title="Back to actions">
            <IconArrowLeft size={16} />
          </button>
          <span className="text-subtitle-lg">Compose email</span>
        </div>
        <button className="ecd-close" onClick={onClose}>
          <IconClose size={16} />
        </button>
      </div>

      {/* Deliverability notice */}
      <div className="ecd-notice ecd-notice-deliverability">
        <div className="ecd-notice-content">
          <span className="ecd-notice-icon ecd-notice-icon-warn">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l6.5 12H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="currentColor"/></svg>
          </span>
          <div className="ecd-notice-text">
            <span className="text-body-sm font-medium">Set up deliverability</span>
            <span className="text-caption text-secondary">
              Improve inbox placement and protect your sender reputation before sending.
            </span>
          </div>
        </div>
        <button className="ecd-notice-cta text-body-sm" onClick={() => {}}>
          Complete setup
        </button>
      </div>

      {/* Recipient */}
      <div className="ecd-recipient">
        <div className="ecd-recipient-avatar">{initials}</div>
        <div className="ecd-recipient-info">
          <span className="text-body-sm font-medium">{contact.name}</span>
          <span className="text-caption text-secondary">{contact.title} at {contact.company}</span>
        </div>
        {canCycle && (
          <button className="ecd-cycle-btn" onClick={cycleNext} title="Next contact">
            <span className="text-caption text-secondary">{contactIdx + 1}/{contactList.length}</span>
            <IconChevronRight size={14} />
          </button>
        )}
      </div>

      {/* From / To */}
      <div className="ecd-fields">
        <div className="ecd-field-row">
          <span className="ecd-field-label text-caption text-secondary">From</span>
          <button className="ecd-field-value text-body-sm">
            <span>You &lt;aaron.pfeiffer@fuseoncology.com&gt;</span>
            <IconChevronDown size={12} />
          </button>
        </div>
        <div className="ecd-field-row">
          <span className="ecd-field-label text-caption text-secondary">To</span>
          <span className="ecd-field-value-static text-body-sm">{contact.email}</span>
        </div>
      </div>

      {/* Mode toggle — below From/To */}
      <div className="ecd-mode-tabs">
        <button
          className={`ecd-mode-tab text-caption ${mode === 'ai' ? 'ecd-mode-tab-active' : ''}`}
          onClick={() => setMode('ai')}
        >
          <IconSparkle size={11} />
          Write with AI
        </button>
        <button
          className={`ecd-mode-tab text-caption ${mode === 'manual' ? 'ecd-mode-tab-active' : ''}`}
          onClick={() => setMode('manual')}
        >
          Write your own
        </button>
      </div>

      {/* Subject */}
      <Input
        placeholder="Subject"
        sizeVariant="sm"
        value={activeSubject}
        onChange={(e) => setActiveSubject(e.target.value)}
      />

      {/* Editor — same size in both modes */}
      <div className="ecd-body">
        <div className="ecd-editor-tabs">
          <button className="ecd-editor-tab ecd-editor-tab-active text-caption">Edit</button>
          <button className="ecd-editor-tab text-caption">Preview</button>
        </div>
        <textarea
          className="ecd-textarea text-body-sm"
          placeholder="Write your email..."
          value={activeBody}
          onChange={(e) => setActiveBody(e.target.value)}
        />
        <div className="ecd-toolbar">
          <button className="ecd-toolbar-btn" title="Bold"><strong>B</strong></button>
          <button className="ecd-toolbar-btn" title="Italic"><em>I</em></button>
          <button className="ecd-toolbar-btn" title="Link">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <button className="ecd-toolbar-btn" title="Image">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="5.5" cy="6" r="1.25" stroke="currentColor" strokeWidth="1"/><path d="M1.5 11l3.5-3.5L8 10.5l2.5-2.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="ecd-toolbar-divider" />
          <button className="ecd-toolbar-btn" title="Attach">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 7.5l-5.5 5.5a3.5 3.5 0 01-5-5l5.5-5.5a2.5 2.5 0 013.5 3.5l-5.5 5.5a1.5 1.5 0 01-2-2L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Refine / AI row */}
      {mode === 'ai' ? (
        <div className="ecd-refine-row">
          <div className="ecd-refine-wrap">
            <input
              className="ecd-refine-input text-body-sm"
              placeholder="Refine: what would you like to change?"
            />
            <button className="ecd-refine-action text-caption" onClick={() => {}}>
              <IconSparkle size={12} />
              Regenerate
            </button>
          </div>
        </div>
      ) : (
        <div className="ecd-ai-row">
          <button className="ecd-ai-pill">
            <span className="text-caption">Use template</span>
          </button>
          <button className="ecd-ai-pill">
            <IconSparkle size={12} />
            <span className="text-caption">Rephrase</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="ecd-footer">
        <span className="ecd-save-hint">Sending will save {contact.name} as a contact (1 credit)</span>
        <div className="ecd-footer-right">
          <Button variant="secondary" size="sm">Schedule</Button>
          <Button variant="primary" size="sm" onClick={onSend}>Send now</Button>
        </div>
      </div>
    </div>
  )
}
