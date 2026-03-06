import './Tabs.css'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeId: string
  onTabChange: (id: string) => void
  variant?: 'underline' | 'pill'
  className?: string
}

export default function Tabs({
  tabs,
  activeId,
  onTabChange,
  variant = 'underline',
  className = '',
}: TabsProps) {
  return (
    <div className={`tabs tabs-${variant} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${tab.id === activeId ? 'tab-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
