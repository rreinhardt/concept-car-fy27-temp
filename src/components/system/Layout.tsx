import type { ReactNode } from 'react'
import { AssistantPanelProvider, useAssistantPanel } from '@/contexts/AssistantPanelContext'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import AssistantSidePanel from './AssistantSidePanel'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

function LayoutInner({ children }: LayoutProps) {
  const { assistantOpen } = useAssistantPanel()

  return (
    <div className={`layout ${assistantOpen ? 'layout-assistant-open' : ''}`}>
      <Sidebar />
      <div className="layout-main">
        <Topbar />
        <div className="layout-body">
          <AssistantSidePanel />
          <div className="layout-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AssistantPanelProvider>
      <LayoutInner>{children}</LayoutInner>
    </AssistantPanelProvider>
  )
}
