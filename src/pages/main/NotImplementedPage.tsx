import { useLocation } from 'react-router-dom'
import './NotImplementedPage.css'

const pageLabels: Record<string, string> = {
  '/agents': 'Agents',
  '/sheets': 'Sheets',
  '/workflows': 'Workflows',
  '/analytics': 'Analytics',
  '/enrichment': 'Data enrichment',
  '/dialer': 'Dialer',
  '/meetings': 'Meetings',
  '/conversations': 'Conversations',
}

export default function NotImplementedPage() {
  const { pathname } = useLocation()
  const label = pageLabels[pathname] ?? pathname

  return (
    <div className="not-impl-page">
      <div className="not-impl-badge text-caption">Not implemented</div>
      <h2 className="not-impl-title">{label}</h2>
      <p className="not-impl-sub text-body-sm text-secondary">
        This page is a placeholder and hasn't been built yet.
      </p>
    </div>
  )
}
