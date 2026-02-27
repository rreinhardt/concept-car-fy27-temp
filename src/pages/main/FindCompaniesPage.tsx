import { useState } from 'react'
import { mockCompanies } from '@/data/mockCompanies'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import {
  IconSearch,
  IconFilter,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconTrending,
  IconClock,
} from '@/components/shared/Icons'
import '../main/SearchPage.css'

const filterSections = [
  'Industry',
  'Number of employees',
  'Revenue',
  'Location',
  'Buying intent',
  'Technologies',
  'Funding stage',
]

export default function FindCompaniesPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedRows.length === mockCompanies.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(mockCompanies.map((c) => c.id))
    }
  }

  return (
    <div className="search-page">
      {/* Page header */}
      <div className="search-page-header">
        <h2 className="text-title-md">Companies</h2>
        <div className="search-liveness">
          <span className="search-liveness-dot" />
          <span className="text-caption text-secondary">
            <strong>6</strong> new companies match &middot; <strong>14</strong> signals detected &middot; Updated 8m ago
          </span>
        </div>
      </div>

      {/* Body: sidebar + table */}
      <div className="search-body">
        {/* Sidebar filters */}
        <aside className="search-filters">
          <div className="search-filters-controls">
            <div className="search-view-selector">
              <span className="text-body-sm">Default view</span>
              <IconChevronDown size={14} />
            </div>
            <Button variant="ghost" size="sm" icon={<IconFilter />}>Filters</Button>
          </div>

          <Input
            placeholder="Search companies"
            sizeVariant="sm"
            iconLeft={<IconSearch size={14} />}
          />

          {/* Summary stats */}
          <div className="search-stats">
            <div className="search-stat">
              <span className="text-caption text-secondary">Total</span>
              <span className="text-body-sm font-medium">73.2M</span>
            </div>
            <div className="search-stat">
              <span className="text-caption text-secondary">Net New</span>
              <span className="text-body-sm font-medium">73.2M</span>
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
        </aside>

        {/* Main table */}
        <div className="search-main">
          {/* Action bar */}
          {selectedRows.length > 0 && (
            <div className="search-bulk-bar">
              <span className="text-body-sm font-medium">{selectedRows.length} selected</span>
              <Button variant="secondary" size="sm">Save to list</Button>
              <Button variant="secondary" size="sm">Export</Button>
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
                        checked={selectedRows.length === mockCompanies.length}
                        onChange={toggleAll}
                      />
                    </th>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>Employees</th>
                    <th>Revenue</th>
                    <th>Signals</th>
                    <th>
                      <button className="search-add-col text-caption" style={{ color: 'var(--color-text-link)' }}>
                        + Add columns
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockCompanies.map((company) => (
                    <tr key={company.id} className={selectedRows.includes(company.id) ? 'search-row-selected' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(company.id)}
                          onChange={() => toggleRow(company.id)}
                        />
                      </td>
                      <td>
                        <div className="search-cell-name">
                          <div className="search-cell-name-row">
                            <span className="text-body-sm font-medium">{company.name}</span>
                            {company.trending && (
                              <span className="search-trending-badge">
                                <IconTrending size={10} />
                                Trending
                              </span>
                            )}
                          </div>
                          <div className="search-cell-meta">
                            <span className="text-caption text-secondary">{company.location}</span>
                            {company.updatedAgo && (
                              <span className="search-updated">
                                <IconClock size={10} />
                                {company.updatedAgo}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-body-sm text-secondary">{company.industry}</td>
                      <td className="text-body-sm text-secondary">{company.employees}</td>
                      <td className="text-body-sm text-secondary">{company.revenue}</td>
                      <td>
                        <div className="search-signals">
                          {company.signals.map((signal) => (
                            <span key={signal} className={`search-signal search-signal-${signal === 'High ICP fit' ? 'icp' : signal === 'Hiring' ? 'hiring' : signal === 'Funding' ? 'funding' : signal === 'Tech change' ? 'tech' : 'activity'}`}>
                              {signal}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-caption text-tertiary">Click to run...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="search-pagination">
              <button className="search-page-btn"><IconChevronLeft size={14} /></button>
              <span className="text-body-sm font-medium">1</span>
              <button className="search-page-btn"><IconChevronRight size={14} /></button>
              <span className="text-caption text-secondary" style={{ marginLeft: 'var(--space-2)' }}>
                1 - 25 of 73,201
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
