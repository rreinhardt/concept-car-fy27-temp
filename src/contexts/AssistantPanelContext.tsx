import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type MessageRole = 'assistant' | 'user' | 'nav'

interface ChatMessage {
  id: number
  role: MessageRole
  content: string
  timestamp: number
}

interface AssistantPanelState {
  assistantOpen: boolean
  messages: ChatMessage[]
  toggleAssistant: () => void
  closeAssistant: () => void
  sendMessage: (content: string) => void
}

/* ── Page context map ── */
const pageGreetings: Record<string, string> = {
  '/home': 'How can I help with your weekly scorecard? I can dig into any metric, explain trends, or suggest next actions to improve your numbers.',
  '/search': 'How can I help with your people search? I can refine your filters, find lookalike contacts, or enrich the results you\'re seeing.',
  '/companies': 'How can I help with company research? I can narrow your filters, find key decision makers, or identify buying signals.',
  '/lists': 'How can I help with your saved lists? I can help you organize contacts, merge duplicates, or set up enrichment.',
  '/sequences': 'How can I help with sequences? I can suggest messaging, optimize send times, or help you pick the right sequence for your contacts.',
  '/enroll': 'How can I help with enrollment? I can review step content, suggest personalization, or check deliverability before you activate.',
  '/diagnostic': 'How can I help with diagnostics? I can explain the root causes, prioritize fixes, or rewrite underperforming steps.',
  '/tasks': 'How can I help with your tasks? I can prioritize what to tackle first, draft replies, or clear blockers.',
  '/assistant': 'How can I help? I can find leads, research contacts in bulk, enrich your data, or build targeted lists.',
  '/triage': 'How can I help with triage? I can draft replies, flag high-priority items, or route contacts to the right sequence.',
  '/review': 'How can I help review these contacts? I can check ICP fit, flag duplicates, or suggest which to prioritize for outreach.',
  '/save-to-list': 'How can I help with saving to a list? I can suggest which list to use or help you create a new one.',
  '/meeting-booked': 'Nice — a meeting booked! I can help you prep: pull company research, find mutual connections, or draft an agenda.',
}

const pageLabels: Record<string, string> = {
  '/home': 'Scorecard',
  '/search': 'People Search',
  '/companies': 'Companies',
  '/lists': 'Saved Lists',
  '/sequences': 'Sequences',
  '/enroll': 'Enrollment',
  '/diagnostic': 'Diagnostic',
  '/tasks': 'Tasks',
  '/assistant': 'Assistant',
  '/triage': 'Triage',
  '/review': 'Review Contacts',
  '/save-to-list': 'Save to List',
  '/meeting-booked': 'Meeting Booked',
}

const defaultGreeting = 'How can I help you? I can find leads, research contacts, enrich data, or help with your sequences.'

const AssistantPanelContext = createContext<AssistantPanelState>({
  assistantOpen: false,
  messages: [],
  toggleAssistant: () => {},
  closeAssistant: () => {},
  sendMessage: () => {},
})

let nextId = 1

export function AssistantPanelProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const lastPathRef = useRef(location.pathname)
  const hasOpenedRef = useRef(false)

  const addMessage = useCallback((role: MessageRole, content: string) => {
    setMessages((prev) => [...prev, { id: nextId++, role, content, timestamp: Date.now() }])
  }, [])

  const toggleAssistant = useCallback(() => {
    setAssistantOpen((prev) => {
      const opening = !prev
      if (opening && !hasOpenedRef.current) {
        // First open — generate contextual greeting
        hasOpenedRef.current = true
        const greeting = pageGreetings[location.pathname] || defaultGreeting
        setTimeout(() => {
          addMessage('assistant', greeting)
        }, 600) // delay until panel animation completes
      }
      return opening
    })
  }, [location.pathname, addMessage])

  const closeAssistant = useCallback(() => {
    setAssistantOpen(false)
  }, [])

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return
    addMessage('user', content)
    // Simulate assistant thinking + response
    setTimeout(() => {
      addMessage('assistant', 'Let me look into that for you. I\'ll analyze the data and get back to you shortly.')
    }, 1200)
  }, [addMessage])

  // Track navigation while panel is open
  useEffect(() => {
    if (!assistantOpen) {
      lastPathRef.current = location.pathname
      return
    }

    if (location.pathname !== lastPathRef.current) {
      const label = pageLabels[location.pathname] || location.pathname
      addMessage('nav', `Navigated to ${label}`)

      // After nav message, add contextual greeting for new page
      const greeting = pageGreetings[location.pathname]
      if (greeting) {
        setTimeout(() => {
          addMessage('assistant', greeting)
        }, 800)
      }

      lastPathRef.current = location.pathname
    }
  }, [location.pathname, assistantOpen, addMessage])

  return (
    <AssistantPanelContext.Provider value={{ assistantOpen, messages, toggleAssistant, closeAssistant, sendMessage }}>
      {children}
    </AssistantPanelContext.Provider>
  )
}

export function useAssistantPanel() {
  return useContext(AssistantPanelContext)
}
