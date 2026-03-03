import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import PageLayout from '@/components/shared/PageLayout'
import ActionsPanel, { type ActionGroup } from '@/components/shared/ActionsPanel'
import {
  IconSearch,
  IconFilter,
  IconChevronDown,
  IconChevronRight,
  IconSparkle,
  IconCheck,
  IconClock,
  IconPeople,
  IconMail,
  IconPhone,
  IconSequence,
  IconBookmark,
  IconTag,
  IconWorkflows,
  IconRobot,
  IconSpreadsheet,
  IconPlus,
  IconChart,
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

const taskSuggestedGroups: ActionGroup[] = [
  {
    label: 'Execute',
    items: [
      { icon: <IconCheck size={15} />, label: 'Complete selected', desc: 'Mark tasks as done', id: 'complete-selected' },
      { icon: <IconClock size={15} />, label: 'Snooze', desc: 'Defer tasks to later', id: 'snooze' },
      { icon: <IconPeople size={15} />, label: 'Reassign', desc: 'Assign to another rep', id: 'reassign' },
    ],
  },
  {
    label: 'Outreach',
    items: [
      { icon: <IconMail size={15} />, label: 'Email', desc: 'Send a one-off email', id: 'email' },
      { icon: <IconPhone size={15} />, label: 'Call', desc: 'Start a call task', id: 'call' },
      { icon: <IconSequence size={15} />, label: 'Add to sequence', desc: 'Enroll selected contacts', id: 'add-to-sequence' },
    ],
  },
  {
    label: 'Organize',
    items: [
      { icon: <IconBookmark size={15} />, label: 'Add to list', desc: 'Save to an existing or new list', id: 'add-to-list' },
      { icon: <IconTag size={15} />, label: 'Tag contacts', desc: 'Apply tags to selection', id: 'tag' },
    ],
  },
]

const taskAdvancedGroups: ActionGroup[] = [
  {
    label: 'Task management',
    items: [
      { icon: <IconPlus size={15} />, label: 'Create task', desc: 'Add a new task manually', id: 'create-task' },
      { icon: <IconChart size={15} />, label: 'Archive selected', desc: 'Remove from active queue', id: 'archive-selected' },
      { icon: <IconChart size={15} />, label: 'Change priority', desc: 'Update task urgency', id: 'change-priority' },
    ],
  },
  {
    label: 'Automation',
    items: [
      { icon: <IconWorkflows size={15} />, label: 'Create Workflow', desc: 'Build automation rules', id: 'create-workflow' },
      { icon: <IconRobot size={15} />, label: 'Run AI agent', desc: 'Execute an agent task', id: 'run-agent' },
    ],
  },
  {
    label: 'Export',
    items: [
      { icon: <IconSpreadsheet size={15} />, label: 'Download as CSV', id: 'download-csv' },
    ],
  },
]

export default function TasksPage() {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [dismissedBlockers, setDismissedBlockers] = useState<Set<string>>(new Set())
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [actionsPanelOpen, setActionsPanelOpen] = useState(false)

  const visibleTasks = mockTasks.filter((t) => !dismissed.has(t.id))
  const visibleBlockers = blockers.filter((b) => !dismissedBlockers.has(b.id))

  // Auto-open actions when rows selected
  useEffect(() => {
    if (selectedRows.length > 0 && !actionsPanelOpen) {
      setActionsPanelOpen(true)
    }
  }, [selectedRows.length])

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

  const sidebar = (
    <>
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

      <div className="search-filter-list">
        {filterSections.map((section) => (
          <button key={section} className="search-filter-item">
            <span className="text-body-sm">{section}</span>
            <IconChevronRight size={14} />
          </button>
        ))}
      </div>
    </>
  )

  return (
    <PageLayout
      title="Tasks"
      titleExtra={
        <div className="search-liveness">
          <span className="search-liveness-dot" />
          <span className="text-caption text-secondary">
            <strong>{visibleTasks.filter(t => t.priority === 'urgent').length}</strong> urgent &middot; <strong>{visibleTasks.length}</strong> total &middot; {visibleBlockers.length} blockers
          </span>
        </div>
      }
      sidebar={sidebar}
      actionsPanel={
        <ActionsPanel
          onClose={() => setActionsPanelOpen(false)}
          onAction={(id) => {
            if (id === 'add-to-sequence') navigate('/sequences')
            else if (id === 'add-to-list') navigate('/save-to-list')
            else if (id === 'enrich') navigate('/review')
            else setActionsPanelOpen(false)
          }}
          selectedCount={selectedRows.length}
          onDeselect={() => setSelectedRows([])}
          suggestedGroups={taskSuggestedGroups}
          advancedGroups={taskAdvancedGroups}
        />
      }
      actionsPanelOpen={actionsPanelOpen}
      onActionsPanelToggle={setActionsPanelOpen}
    >
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

        <div className="search-pagination">
          <span className="text-caption text-secondary">
            Showing {visibleTasks.length} of {mockTasks.length} tasks
          </span>
        </div>
      </div>
    </PageLayout>
  )
}
