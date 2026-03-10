import { useState, useRef, useEffect } from 'react'
import { useAssistantPanel } from '@/contexts/AssistantPanelContext'
import {
  IconAssistant,
  IconChevronRight,
} from '@/components/shared/Icons'
import './AssistantSidePanel.css'

export default function AssistantSidePanel() {
  const { assistantOpen, messages, closeAssistant, sendMessage } = useAssistantPanel()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (assistantOpen) {
      setTimeout(() => inputRef.current?.focus(), 500)
    }
  }, [assistantOpen])

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    sendMessage(inputValue.trim())
    setInputValue('')
  }

  return (
    <div className={`asst-slot ${assistantOpen ? 'asst-slot-open' : ''}`}>
      <div className="asst-card">
        {/* Header */}
        <div className="asst-header">
          <div className="asst-header-left">
            <IconAssistant size={16} />
            <span className="text-body-sm font-medium">Assistant</span>
          </div>
          <button className="asst-close" onClick={closeAssistant}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="asst-messages">
          {messages.length === 0 && (
            <div className="asst-empty">
              <IconAssistant size={28} />
              <span className="text-caption text-tertiary">Analyzing page context…</span>
            </div>
          )}

          {messages.map((msg) => {
            if (msg.role === 'nav') {
              return (
                <div key={msg.id} className="asst-nav-message">
                  <IconChevronRight size={10} />
                  <span className="text-caption">{msg.content}</span>
                </div>
              )
            }

            if (msg.role === 'assistant') {
              return (
                <div key={msg.id} className="asst-msg asst-msg-assistant">
                  <div className="asst-msg-avatar">
                    <IconAssistant size={14} />
                  </div>
                  <div className="asst-msg-bubble asst-msg-bubble-assistant">
                    <p className="text-body-sm">{msg.content}</p>
                  </div>
                </div>
              )
            }

            return (
              <div key={msg.id} className="asst-msg asst-msg-user">
                <div className="asst-msg-bubble asst-msg-bubble-user">
                  <p className="text-body-sm">{msg.content}</p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input — pinned to bottom */}
        <div className="asst-chat-input-area">
          <div className="asst-chat-input-box">
            <textarea
              ref={inputRef}
              className="asst-chat-input"
              placeholder="Message Assistant…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              rows={1}
            />
            <button
              className={`asst-send-btn ${inputValue.trim() ? 'asst-send-btn-active' : ''}`}
              onClick={handleSubmit}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="asst-disclaimer text-caption text-tertiary">
            Assistant can make mistakes. Double check responses.
          </p>
        </div>
      </div>
    </div>
  )
}
