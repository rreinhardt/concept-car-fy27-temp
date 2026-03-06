import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/shared/Button'
import { IconCheck, IconPlus } from '@/components/shared/Icons'
import './SaveToListPage.css'

const lists = [
  { id: 1, name: 'My prospects', count: 24 },
  { id: 2, name: 'ICP Security', count: 18 },
  { id: 3, name: 'ICP Furniture', count: 12 },
]

export default function SaveToListPage() {
  const navigate = useNavigate()
  const [selectedList, setSelectedList] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
  }

  return (
    <div className="stl-page">
      <div className="stl-card">
      <div className="stl-container">
        {!saved ? (
          <>
            {/* Header */}
            <div className="stl-header">
              <h2 className="text-title-md">Save to list</h2>
              <p className="text-body-sm text-secondary">12 contacts selected — choose a destination list</p>
            </div>

            {/* List picker */}
            <div className="stl-lists">
              {lists.map((list) => (
                <button
                  key={list.id}
                  className={`stl-list-item ${selectedList === list.id ? 'stl-list-selected' : ''}`}
                  onClick={() => setSelectedList(list.id)}
                >
                  <div className="stl-list-info">
                    <span className="text-body-sm font-medium">{list.name}</span>
                    <span className="text-caption text-secondary">{list.count} contacts</span>
                  </div>
                  {selectedList === list.id && (
                    <span className="stl-list-check"><IconCheck size={16} /></span>
                  )}
                </button>
              ))}

              <button className="stl-new-list">
                <IconPlus size={14} />
                <span className="text-body-sm">New list</span>
              </button>
            </div>

            {/* Actions */}
            <div className="stl-actions">
              <Button
                variant="primary"
                disabled={!selectedList}
                onClick={handleSave}
              >
                Save 12 contacts
              </Button>
              <Button variant="ghost" onClick={() => navigate('/review')}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            {/* Saved confirmation */}
            <div className="stl-success">
              <div className="stl-success-icon">
                <IconCheck size={32} />
              </div>
              <h2 className="text-title-md">12 contacts added</h2>
              <p className="text-body-sm text-secondary">
                Saved to "{lists.find((l) => l.id === selectedList)?.name}"
              </p>
            </div>

            {/* Next step prompt */}
            <div className="stl-next">
              <p className="text-subtitle-lg">Next: Enroll in sequence?</p>
              <p className="text-body-sm text-secondary">
                Get these contacts into an automated outreach sequence to start engaging.
              </p>
              <div className="stl-next-actions">
                <Button variant="primary" onClick={() => navigate('/sequences')}>
                  Choose a sequence
                </Button>
                <Button variant="ghost" onClick={() => navigate('/search')}>
                  Back to search
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  )
}
