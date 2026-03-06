import { useState } from 'react'
import PageLayout from '@/components/shared/PageLayout'
import Badge from '@/components/shared/Badge'
import {
  IconMail,
  IconSearch,
  IconChevronDown,
  IconChevronRight,
  IconSequence,
  IconSparkle,
} from '@/components/shared/Icons'
import Input from '@/components/shared/Input'
import '../main/SearchPage.css'
import './EmailsPage.css'

type MailboxView = 'inbox' | 'sent' | 'ai-written'
type GroupBy = 'sequence' | 'contact' | 'date'

interface SequenceGroup {
  id: number
  name: string
  count: number
  status: 'active' | 'paused'
}

const mockSequenceGroups: SequenceGroup[] = [
  { id: 1, name: 'Oncology Decision Makers — Q1', count: 48, status: 'active' },
  { id: 2, name: 'Warm Re-engagement', count: 23, status: 'active' },
  { id: 3, name: 'Event Follow-up — ASTRO 2025', count: 12, status: 'paused' },
  { id: 4, name: 'VP+ Engineering Outreach', count: 31, status: 'active' },
  { id: 5, name: 'Competitive Displacement', count: 17, status: 'active' },
]

const groupByLabels: Record<GroupBy, string> = {
  sequence: 'Sequences',
  contact: 'Contacts',
  date: 'Date',
}

const mailboxLabels: Record<MailboxView, string> = {
  inbox: 'Inbox',
  sent: 'Sent',
  'ai-written': 'Written by AI',
}

export default function EmailsPage() {
  const [activeView, setActiveView] = useState<MailboxView>('inbox')
  const [groupBy, setGroupBy] = useState<GroupBy>('sequence')
  const [groupByOpen, setGroupByOpen] = useState(false)

  const sidebar = (
    <>
      <Input
        placeholder="Search emails"
        sizeVariant="sm"
        iconLeft={<IconSearch size={14} />}
      />

      {/* Mailbox views */}
      <div className="emails-sidebar-views">
        <button
          className={`emails-sidebar-view ${activeView === 'inbox' ? 'emails-sidebar-view-active' : ''}`}
          onClick={() => setActiveView('inbox')}
        >
          <IconMail size={14} />
          <span className="text-body-sm">Inbox</span>
        </button>
        <button
          className={`emails-sidebar-view ${activeView === 'sent' ? 'emails-sidebar-view-active' : ''}`}
          onClick={() => setActiveView('sent')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 2L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 2L9.5 14L7 9L2 6.5L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          <span className="text-body-sm">Sent</span>
        </button>
        <button
          className={`emails-sidebar-view ${activeView === 'ai-written' ? 'emails-sidebar-view-active' : ''}`}
          onClick={() => setActiveView('ai-written')}
        >
          <IconSparkle size={14} />
          <span className="text-body-sm">Written by AI</span>
          <span className="emails-sidebar-count">
            <Badge variant="blue" size="sm">12</Badge>
          </span>
          <span className="emails-review-badge">Review</span>
        </button>
      </div>

      {/* Group by section */}
      <div className="emails-sidebar-section">
        <div className="emails-sidebar-section-header">
          <span className="text-caption text-tertiary">GROUP BY</span>
          <div className="emails-groupby-select">
            <button
              className="emails-groupby-trigger text-caption"
              onClick={() => setGroupByOpen(!groupByOpen)}
            >
              {groupByLabels[groupBy]}
              <IconChevronDown size={10} />
            </button>
            {groupByOpen && (
              <div className="emails-groupby-menu">
                {(Object.keys(groupByLabels) as GroupBy[]).map((key) => (
                  <button
                    key={key}
                    className={`emails-groupby-option text-body-sm ${groupBy === key ? 'emails-groupby-option-active' : ''}`}
                    onClick={() => { setGroupBy(key); setGroupByOpen(false) }}
                  >
                    {groupByLabels[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="emails-sidebar-groups">
          {mockSequenceGroups.map((seq) => (
            <button key={seq.id} className="emails-sidebar-group-item">
              <span className="emails-sidebar-group-icon">
                <IconSequence size={12} />
              </span>
              <div className="emails-sidebar-group-content">
                <span className="text-body-sm">{seq.name}</span>
                <span className="text-caption text-tertiary">
                  {seq.count} emails &middot; {seq.status === 'active' ? 'Active' : 'Paused'}
                </span>
              </div>
              <IconChevronRight size={12} />
            </button>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <PageLayout
      title="Emails"
      titleExtra={
        <div className="search-liveness">
          <span className="text-caption text-secondary">
            Viewing: <strong>{mailboxLabels[activeView]}</strong>
          </span>
        </div>
      }
      sidebar={sidebar}
      sidebarLabel="Mailbox"
    >
      <div className="search-table-area">
        <div className="search-table-frame">
          <div className="emails-content">
            {/* Empty state — centered */}
            <div className="emails-empty">
              <div className="emails-empty-icon">
                <IconMail size={32} />
              </div>
              <h3 className="text-subtitle-lg">Your inbox is empty</h3>
              <p className="text-body-sm text-secondary">
                Sent and received emails will appear here once you start engaging with contacts.
              </p>
            </div>

            {/* Info blocks */}
            <div className="emails-info-blocks">
              <div className="emails-info-card">
                <div className="emails-info-card-header">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11" r="0.75" fill="currentColor"/></svg>
                  <span className="text-body-sm font-medium">Existing emails won't appear here</span>
                </div>
                <p className="text-caption text-secondary">
                  Apollo does not import your existing email history from Gmail or Outlook. Only emails sent through Apollo — or replies to those emails — will be tracked and displayed here.
                </p>
              </div>

              <div className="emails-info-card">
                <div className="emails-info-card-header">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="text-body-sm font-medium">Tracking starts from today</span>
                </div>
                <p className="text-caption text-secondary">
                  Email opens, clicks, and replies are tracked going forward from the moment you send through Apollo. Historical engagement data from your email provider is not available.
                </p>
              </div>

              <div className="emails-info-card">
                <div className="emails-info-card-header">
                  <IconSparkle size={16} />
                  <span className="text-body-sm font-medium">AI-written emails need your review</span>
                </div>
                <p className="text-caption text-secondary">
                  Emails drafted by AI are held in the "Written by AI" tab until you review and approve them. Nothing is sent automatically without your confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
