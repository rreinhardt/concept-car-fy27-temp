import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockContacts } from '@/data/mockContacts'
import Badge from '@/components/shared/Badge'
import Button from '@/components/shared/Button'
import Popover from '@/components/transient/Popover'
import { IconCheck, IconLock } from '@/components/shared/Icons'
import './ReviewContactsPage.css'

export default function ReviewContactsPage() {
  const navigate = useNavigate()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set())
  const [popoverRowId, setPopoverRowId] = useState<number | null>(null)

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

  const confirmReveal = (id: number) => {
    setRevealedRows((prev) => new Set(prev).add(id))
    setPopoverRowId(null)
  }

  return (
    <div className="review-page">
      <div className="review-header">
        <h2 className="text-title-md">Review Contacts</h2>
        <span className="text-body-sm text-secondary">Verify data quality before saving</span>
      </div>

      {/* Table area — positioning context for the floating bulk bar */}
      <div className="review-table-area">
        {/* Bulk action bar — slides up from behind the table */}
        {selectedRows.length > 0 && (
          <div className="review-bulk-bar">
            <span className="text-body-sm font-medium">{selectedRows.length} selected</span>
            <Button variant="primary" size="sm" onClick={() => navigate('/save-to-list')}>
              Save to list
            </Button>
            <Button variant="secondary" size="sm">Enroll</Button>
            <Button variant="secondary" size="sm">Export</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>Dismiss</Button>
          </div>
        )}
      {/* Table with glow frame */}
      <div className="review-table-frame">
      <div className="review-table-wrapper">
        <table className="review-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === mockContacts.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Name</th>
              <th>Freshness</th>
              <th>Verified</th>
              <th>Reachability</th>
              <th>Fit</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {mockContacts.map((c) => (
              <tr key={c.id} className={selectedRows.includes(c.id) ? 'review-row-selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(c.id)}
                    onChange={() => toggleRow(c.id)}
                  />
                </td>
                <td>
                  <div className="review-cell-name">
                    <span className="text-body-sm font-medium">{c.name}</span>
                    <span className="text-caption text-secondary">{c.title} at {c.company}</span>
                  </div>
                </td>
                <td>
                  <Badge variant={c.freshness.includes('1 day') ? 'green' : c.freshness.includes('2 day') ? 'green' : 'gray'} size="sm">
                    {c.freshness}
                  </Badge>
                </td>
                <td>
                  {c.verified ? (
                    <span className="review-verified"><IconCheck size={12} /> Verified</span>
                  ) : (
                    <span className="text-caption text-tertiary">Unverified</span>
                  )}
                </td>
                <td>
                  <div className="review-reach">
                    <div className="review-reach-bar">
                      <div className="review-reach-fill" style={{ width: `${c.reachability}%` }} />
                    </div>
                    <span className="text-caption">{c.reachability}%</span>
                  </div>
                </td>
                <td>
                  <Badge variant={c.reachability >= 90 ? 'green' : c.reachability >= 80 ? 'blue' : 'gray'} size="sm">
                    {c.reachability >= 90 ? 'Excellent' : c.reachability >= 80 ? 'Good' : 'Average'}
                  </Badge>
                </td>
                <td style={{ position: 'relative' }}>
                  {revealedRows.has(c.id) ? (
                    <span className="text-body-sm">a.{c.name.split(' ')[1]?.toLowerCase()}@{c.company.toLowerCase().replace(/\s/g, '')}.com</span>
                  ) : (
                    <>
                      <button className="review-reveal-btn" onClick={() => setPopoverRowId(c.id)}>
                        <IconLock size={12} /> Unlock email
                      </button>
                      <Popover
                        open={popoverRowId === c.id}
                        onClose={() => setPopoverRowId(null)}
                        className="review-popover"
                      >
                        <div className="review-popover-content">
                          <p className="text-body-sm font-medium">Unlock email + phone</p>
                          <p className="text-caption text-secondary">Costs 2 credits</p>
                          <div className="review-popover-actions">
                            <Button variant="primary" size="sm" onClick={() => confirmReveal(c.id)}>Confirm</Button>
                            <Button variant="ghost" size="sm" onClick={() => setPopoverRowId(null)}>Cancel</Button>
                          </div>
                        </div>
                      </Popover>
                    </>
                  )}
                </td>
                <td>
                  {revealedRows.has(c.id) ? (
                    <span className="text-body-sm">(555) 012-{String(c.id).padStart(4, '0')}</span>
                  ) : (
                    <button className="review-reveal-btn" onClick={() => setPopoverRowId(c.id)}>
                      <IconLock size={12} /> Unlock phone
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      </div>

      {/* CTA */}
      <div className="review-footer">
        <Button variant="primary" onClick={() => navigate('/save-to-list')}>
          Save {selectedRows.length || mockContacts.length} contacts to list
        </Button>
      </div>
    </div>
  )
}
