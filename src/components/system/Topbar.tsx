import { useUser } from '@/contexts/UserContext'
import Avatar from '@/components/shared/Avatar'
import { IconSearch, IconSparkle } from '@/components/shared/Icons'
import './Topbar.css'

export default function Topbar() {
  const user = useUser()

  return (
    <header className="topbar">
      {/* Search */}
      <div className="topbar-search">
        <IconSearch size={16} />
        <span className="topbar-search-text">Search across Apollo...</span>
      </div>

      {/* Right actions */}
      <div className="topbar-actions">
        <button className="topbar-assistant">
          <IconSparkle size={14} />
          <span>Assistant</span>
        </button>
        <Avatar initials={user.initials} size="md" />
      </div>
    </header>
  )
}
