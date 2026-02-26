import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/shared/Button'
import Tag from '@/components/shared/Tag'
import Badge from '@/components/shared/Badge'
import {
  IconBriefcase,
  IconBuilding,
  IconPeople,
  IconSignal,
  IconTag,
  IconChevronDown,
  IconChevronRight,
  IconArrowLeft,
  IconGlobe,
  IconApolloLogo,
} from '@/components/shared/Icons'
import './TargetAudiencePage.css'

interface FilterSection {
  id: string
  label: string
  icon: React.ReactNode
  count: number
  expanded?: boolean
  content?: React.ReactNode
}

export default function TargetAudiencePage() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string>('job-title')

  const filters: FilterSection[] = [
    {
      id: 'job-title',
      label: 'Job title',
      icon: <IconBriefcase />,
      count: 4,
      content: (
        <div className="ta-filter-detail">
          <div className="ta-filter-row">
            <span className="text-caption text-secondary">Seniority level is any of:</span>
            <div className="ta-filter-tags">
              <Tag variant="default">C Suite</Tag>
              <Tag variant="default">Director</Tag>
            </div>
          </div>
          <div className="ta-filter-row">
            <span className="text-caption text-secondary">Primary department is any of:</span>
            <div className="ta-filter-tags">
              <Tag variant="default">Medical & Health</Tag>
              <Tag variant="default">Operations</Tag>
            </div>
          </div>
        </div>
      ),
    },
    { id: 'industry', label: 'Industry', icon: <IconBuilding />, count: 5 },
    { id: 'employees', label: 'Number of employees', icon: <IconPeople />, count: 5 },
    { id: 'intent', label: 'Buying intent', icon: <IconSignal />, count: 5 },
    { id: 'keywords', label: 'Keywords', icon: <IconTag />, count: 5 },
  ]

  return (
    <div className="ta-page">
      {/* Left */}
      <div className="ta-left">
        <div className="ta-logo">
          <IconApolloLogo size={20} />
          <span className="ta-logo-name">Apollo</span>
        </div>

        <div className="ta-left-content">
          <button className="ta-back" onClick={() => navigate('/knowledge-base')}>
            <IconArrowLeft size={16} />
          </button>

          <h1 className="ta-heading text-display-sm">
            This is your target market
          </h1>
          <p className="ta-subtext text-body-lg text-secondary">
            Based on your profile, these filters reflect companies and people that match your business
          </p>

          <Button variant="primary" size="lg" onClick={() => navigate('/search')}>
            Show 5,000+ results
          </Button>
        </div>

        <div className="ta-lang">
          <IconGlobe size={14} />
          <span className="text-caption text-secondary">EN</span>
        </div>
      </div>

      {/* Right */}
      <div className="ta-right">
        <div className="ta-filters-card">
          <div className="ta-filters-header text-subtitle-lg">Your search will include:</div>

          {filters.map((f) => {
            const isExpanded = expandedId === f.id
            return (
              <div key={f.id} className="ta-filter-section">
                <button
                  className="ta-filter-header-btn"
                  onClick={() => setExpandedId(isExpanded ? '' : f.id)}
                >
                  <span className="ta-filter-icon">{f.icon}</span>
                  <span className="ta-filter-label text-body-sm font-medium">{f.label}</span>
                  <Badge variant="blue" size="sm">{f.count} selected</Badge>
                  <span className="ta-filter-chevron">
                    {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                  </span>
                </button>
                {isExpanded && f.content && (
                  <div className="ta-filter-content">{f.content}</div>
                )}
              </div>
            )
          })}

          <p className="ta-filters-footer text-caption text-tertiary">
            You can refine and add filters in search
          </p>
        </div>
      </div>
    </div>
  )
}
