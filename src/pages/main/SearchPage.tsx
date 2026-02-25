import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockContacts } from '@/data/mockContacts'
import Badge from '@/components/shared/Badge'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import {
  IconSearch,
  IconFilter,
  IconLock,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from '@/components/shared/Icons'
import './SearchPage.css'

const filterSections = [
  'Job title',
  'Industry',
  'Number of employees',
  'Buying intent',
  'Keywords',
  'Scores',
  'Technologies',
]

export default function SearchPage() {
  const navigate = useNavigate()
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedRows.length === mockContacts.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(mockContacts.map((c) => c.id))
    }
  }

  return (
    <div className="search-page">
      {/* Sidebar filters */}
      <aside className="search-filters">
        <div className="search-filters-header">
          <h2 className="text-title-md">People</h2>
        </div>

        <div className="search-filters-controls">
          <div className="search-view-selector">
            <span className="text-body-sm">Default view</span>
            <IconChevronDown size={14} />
          </div>
          <Button variant="ghost" size="sm" icon={<IconFilter />}>Filters</Button>
        </div>

        <Input
          placeholder="Search people"
          sizeVariant="sm"
          iconLeft={<IconSearch size={14} />}
        />

        {/* Summary stats */}
        <div className="search-stats">
          <div className="search-stat">
            <span className="text-caption text-secondary">Total</span>
            <span className="text-body-sm font-medium">234.0M</span>
          </div>
          <div className="search-stat">
            <span className="text-caption text-secondary">Net New</span>
            <span className="text-body-sm font-medium">234.0M</span>
          </div>
          <div className="search-stat">
            <span className="text-caption text-secondary">Saved</span>
            <span className="text-body-sm font-medium">0</span>
          </div>
        </div>

        {/* Filter sections */}
        <div className="search-filter-list">
          {filterSections.map((section) => (
            <button key={section} className="search-filter-item">
              <span className="text-body-sm">{section}</span>
              <IconChevronRight size={14} />
            </button>
          ))}
        </div>

        <div className="search-filter-actions">
          <button className="text-body-sm" style={{ color: 'var(--color-text-link)' }}>
            <IconPlus size={14} /> Add filter
          </button>
          <button className="text-caption text-secondary">Reset all</button>
        </div>

        <div className="search-pagination-info text-caption text-secondary">
          1 - 25 of 126,222
        </div>
      </aside>

      {/* Main table */}
      <div className="search-main">
        {/* Action bar */}
        {selectedRows.length > 0 && (
          <div className="search-bulk-bar">
            <span className="text-body-sm font-medium">{selectedRows.length} selected</span>
            <Button variant="secondary" size="sm" onClick={() => navigate('/save-to-list')}>Save to list</Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/enroll')}>Enroll</Button>
            <Button variant="secondary" size="sm">Export</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>Dismiss</Button>
          </div>
        )}

        {/* Table */}
        <div className="search-table-wrapper">
          <table className="search-table">
            <thead>
              <tr>
                <th className="search-th-check">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === mockContacts.length}
                    onChange={toggleAll}
                  />
                </th>
                <th>Name</th>
                <th>Job Title</th>
                <th>Emails</th>
                <th>Phone Numbers</th>
                <th>Qualify</th>
                <th>
                  <button className="search-add-col text-caption" style={{ color: 'var(--color-text-link)' }}>
                    + Add columns
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockContacts.map((contact) => (
                <tr key={contact.id} className={selectedRows.includes(contact.id) ? 'search-row-selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(contact.id)}
                      onChange={() => toggleRow(contact.id)}
                    />
                  </td>
                  <td>
                    <div className="search-cell-name">
                      <div className="text-body-sm font-medium">{contact.name}</div>
                      <div className="text-caption text-secondary">{contact.company}</div>
                    </div>
                  </td>
                  <td className="text-body-sm text-secondary">{contact.title}</td>
                  <td>
                    <button className="search-access-btn">
                      <IconLock size={12} />
                      <span>Access email</span>
                    </button>
                  </td>
                  <td>
                    <button className="search-access-btn">
                      <IconLock size={12} />
                      <span>Access mobile</span>
                    </button>
                  </td>
                  <td>
                    <Badge variant={contact.fitScore === 'Excellent' ? 'green' : contact.fitScore === 'Good' ? 'blue' : 'gray'} size="sm">
                      {contact.fitScore}
                    </Badge>
                  </td>
                  <td className="text-caption text-tertiary">Click to run...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination + flow CTA */}
        <div className="search-pagination">
          <button className="search-page-btn"><IconChevronLeft size={14} /></button>
          <span className="text-body-sm font-medium">1</span>
          <button className="search-page-btn"><IconChevronRight size={14} /></button>
          <span className="text-caption text-secondary" style={{ marginLeft: 'var(--space-2)' }}>
            1 - 25 of 126,222
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="primary" size="sm" onClick={() => navigate('/review')}>
              Review contacts
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
