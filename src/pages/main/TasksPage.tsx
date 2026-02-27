import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import {
  IconSearch,
  IconFilter,
  IconChevronDown,
  IconChevronRight,
  IconSparkle,
} from '@/components/shared/Icons'
import '../main/SearchPage.css'
import './TasksPage.css'

interface Task {
  id: number
  type: 'reply' | 'follow-up' | 'call' | 'review'
  priority: 'urgent' | 'high' | 'medium'
  contact: string
  company: string
  title: string
  reason: string
  detail: string
  action: string
  route: string
  isNext?: boolean
  dueIn?: string
  sequence?: string
}

const mockTasks: Task[] = [
  {
    id: 1,
    type: 'reply',
    priority: 'urgent',
    contact: 'Jane Smith',
    company: 'Acme Corp',
    title: 'VP of Operations',
    reason: 'Reply within 2hrs for 3x meeting rate',
    detail: 'Replied to Step 2 asking about a demo — positive buying signal detected.',
    action: 'Reply now',
    route: '/triage',
    isNext: true,
    dueIn: '1h 23m',
    sequence: 'Cold Outbound v2',
  },
  {
    id: 2,
    type: 'follow-up',
    priority: 'high',
    contact: 'Marcus Chen',
    company: 'Novalis Health',
    title: 'Director of IT',
    reason: 'Opened 3x in 24hrs — high engagement window',
    detail: 'Step 1 opened multiple times. No reply yet. Consider phone follow-up.',
    action: 'Send follow-up',
    route: '/triage',
    dueIn: '3h',
    sequence: 'Warm Re-engage',
  },
  {
    id: 3,
    type: 'call',
    priority: 'high',
    contact: 'Shea Sanford',
    company: 'Mayo Clinic',
    title: 'Project Lead',
    reason: 'High ICP fit + hiring signal detected',
    detail: 'Matched your ideal persona. Recently posted 2 relevant job openings.',
    action: 'Call now',
    route: '/triage',
    dueIn: 'Today',
  },
  {
    id: 4,
    type: 'review',
    priority: 'medium',
    contact: 'Korey Veum',
    company: 'Novalis',
    title: 'Regional Manager',
    reason: 'New funding round detected — buying power likely increased',
    detail: 'Company raised Series C. Good time to re-engage.',
    action: 'Review contact',
    route: '/search',
    dueIn: 'Tomorrow',
  },
  {
    id: 5,
    type: 'follow-up',
    priority: 'medium',
    contact: 'Dandre Kassler',
    company: 'Varian Medical',
    title: 'Marketing Lead',
    reason: 'Step 3 due — keep sequence momentum',
    detail: 'Next step in Cold Outbound sequence. Subject line needs personalization.',
    action: 'Preview & send',
    route: '/enroll',
    dueIn: 'Tomorrow',
    sequence: 'Cold Outbound v2',
  },
]

const blockers = [
  { id: 'inbox-limit', label: 'Daily send limit approaching', detail: '45 of 50 emails sent today. 3 sequences paused.', action: 'View limits' },
  { id: 'invalid', label: '5 contacts have invalid data', detail: 'Bounced emails or outdated phone numbers detected.', action: 'Clean up' },
]

const typeColors: Record<string, 'green' | 'blue' | 'yellow' | 'gray'> = {
  reply: 'green',
  'follow-up': 'blue',
  call: 'yellow',
  review: 'gray',
}

const priorityColors: Record<string, 'red' | 'yellow' | 'blue'> = {
  urgent: 'red',
  high: 'yellow',
  medium: 'blue',
}

const filterSections = [
  'Task type',
  'Priority',
  'Sequence',
  'Contact',
  'Company',
  'Due date',
]

export default function TasksPage() {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [dismissedBlockers, setDismissedBlockers] = useState<Set<string>>(new Set())
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const visibleTasks = mockTasks.filter((t) => !dismissed.has(t.id))
  const visibleBlockers = blockers.filter((b) => !dismissedBlockers.has(b.id))

  const skip = (id: number) => {
    setDismissed((prev) => new Set(prev).add(id))
  }

  const dismissBlocker = (id: string) => {
    setDismissedBlockers((prev) => new Set(prev).add(id))
  }

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedRows.length === visibleTasks.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(visibleTasks.map((t) => t.id))
    }
  }

  return (
    <div className="search-page">
      {/* Page header */}
      <div className="search-page-header">
        <h2 className="text-title-md">Tasks</h2>
        <div className="search-liveness">
          <span className="search-liveness-dot" />
          <span className="text-caption text-secondary">
            <strong>{visibleTasks.filter(t => t.priority === 'urgent').length}</strong> urgent &middot; <strong>{visibleTasks.length}</strong> total &middot; {visibleBlockers.length} blockers
          </span>
        </div>
      </div>

      {/* Body: sidebar + table */}
      <div className="search-body">
        {/* Sidebar filters */}
        <aside className="search-filters">
          <div className="search-filters-controls">
            <div className="search-view-selector">
              <span className="text-body-sm">All tasks</span>
              <IconChevronDown size={14} />
            </div>
            <Button variant="ghost" size="sm" icon={<IconFilter />}>Filters</Button>
          </div>

          <Input
            placeholder="Search tasks"
            sizeVariant="sm"
            iconLeft={<IconSearch size={14} />}
          />

          {/* Filter sections */}
          <div className="search-filter-list">
            {filterSections.map((section) => (
              <button key={section} className="search-filter-item">
                <span className="text-body-sm">{section}</span>
                <IconChevronRight size={14} />
              </button>
            ))}
          </div>
        </aside>

        {/* Main table */}
        <div className="search-main">
          {/* Blockers */}
          {visibleBlockers.length > 0 && (
            <div className="tasks-blockers">
              {visibleBlockers.map((blocker) => (
                <div key={blocker.id} className="tasks-blocker">
                  <div className="tasks-blocker-content">
                    <span className="text-body-sm font-medium">{blocker.label}</span>
                    <span className="text-caption text-secondary">{blocker.detail}</span>
                  </div>
                  <div className="tasks-blocker-actions">
                    <Button variant="secondary" size="sm">{blocker.action}</Button>
                    <button className="text-caption text-tertiary" onClick={() => dismissBlocker(blocker.id)}>Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bulk action bar */}
          {selectedRows.length > 0 && (
            <div className="search-bulk-bar">
              <span className="text-body-sm font-medium">{selectedRows.length} selected</span>
              <Button variant="secondary" size="sm">Complete all</Button>
              <Button variant="secondary" size="sm">Snooze</Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>Dismiss</Button>
            </div>
          )}

          {/* Table with glow frame */}
          <div className="search-table-frame">
            <div className="search-table-wrapper">
              <table className="search-table">
                <thead>
                  <tr>
                    <th className="search-th-check">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === visibleTasks.length && visibleTasks.length > 0}
                        onChange={toggleAll}
                      />
                    </th>
                    <th>Contact</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Reason</th>
                    <th>Due</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTasks.map((task) => (
                    <tr key={task.id} className={`${selectedRows.includes(task.id) ? 'search-row-selected' : ''} ${task.isNext ? 'tasks-row-next' : ''}`}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(task.id)}
                          onChange={() => toggleRow(task.id)}
                        />
                      </td>
                      <td>
                        <div className="search-cell-name">
                          <div className="search-cell-name-row">
                            <span className="text-body-sm font-medium">{task.contact}</span>
                            {task.isNext && (
                              <span className="tasks-next-badge">
                                <IconSparkle size={10} />
                                Next
                              </span>
                            )}
                          </div>
                          <div className="search-cell-meta">
                            <span className="text-caption text-secondary">{task.title} at {task.company}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={typeColors[task.type]} size="sm">{task.type}</Badge>
                      </td>
                      <td>
                        <Badge variant={priorityColors[task.priority]} size="sm">{task.priority}</Badge>
                      </td>
                      <td>
                        <div className="tasks-reason-cell">
                          <span className="text-body-sm">{task.reason}</span>
                          {task.sequence && (
                            <span className="text-caption text-tertiary">{task.sequence}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`text-body-sm ${task.priority === 'urgent' ? 'tasks-due-urgent' : 'text-secondary'}`}>
                          {task.dueIn}
                        </span>
                      </td>
                      <td>
                        <div className="tasks-action-cell">
                          <Button
                            variant={task.isNext ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => navigate(task.route)}
                          >
                            {task.action}
                          </Button>
                          <button className="text-caption text-tertiary" onClick={() => skip(task.id)}>Skip</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleTasks.length === 0 && (
                <div className="tasks-empty">
                  <span className="text-body-lg text-secondary">All caught up! No tasks right now.</span>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="search-pagination">
              <span className="text-caption text-secondary">
                Showing {visibleTasks.length} of {mockTasks.length} tasks
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
