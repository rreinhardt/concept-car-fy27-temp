import { useUser } from '@/contexts/UserContext'
import { IconSparkle, IconChevronDown, IconApolloLogo, IconClock, IconPlus } from '@/components/shared/Icons'
import '../main/SearchPage.css'
import './AssistantPage.css'

const prompts = [
  'Build your target audience',
  'Conduct research',
  'Get verified emails and phone numbers',
  'Craft outbound sequence',
]

const previousChats = [
  { id: 1, label: 'Sequence for healthcare CTOs', time: '2h ago' },
  { id: 2, label: 'Find companies hiring in oncology', time: '5h ago' },
  { id: 3, label: 'Draft cold intro for Mayo Clinic', time: 'Yesterday' },
  { id: 4, label: 'Research Varian Medical Systems', time: 'Yesterday' },
  { id: 5, label: 'Enrich contact list — Series B+', time: '2 days ago' },
  { id: 6, label: 'Personalize outreach for Elekta', time: '3 days ago' },
  { id: 7, label: 'ICP analysis — radiation oncology', time: '4 days ago' },
  { id: 8, label: 'Competitive positioning vs Accuray', time: '1 week ago' },
]

export default function AssistantPage() {
  const user = useUser()

  return (
    <div className="search-page">
      {/* Page header */}
      <div className="search-page-header">
        <h2 className="text-title-md">Assistant</h2>
      </div>

      {/* Body: sidebar + main */}
      <div className="search-body">
        {/* Sidebar — chat history */}
        <aside className="search-filters">
          <button className="assistant-new-chat-btn">
            <IconPlus size={14} />
            <span className="text-body-sm">New chat</span>
          </button>

          <div className="assistant-chat-list">
            {previousChats.map((chat) => (
              <button key={chat.id} className="assistant-chat-item">
                <span className="assistant-chat-label text-body-sm">{chat.label}</span>
                <span className="assistant-chat-time text-caption text-tertiary">
                  <IconClock size={10} />
                  {chat.time}
                </span>
              </button>
            ))}
          </div>

          <div className="assistant-sidebar-bottom">
            <button className="assistant-manage-context text-body-sm">
              <IconSparkle size={14} />
              Manage Context
            </button>
          </div>
        </aside>

        {/* Main area — white card with assistant content */}
        <div className="search-main">
          <div className="search-table-frame assistant-main">
            <div className="assistant-content">
              <div className="assistant-icon">
                <IconApolloLogo size={28} />
              </div>

              <h2 className="assistant-heading text-title-md">
                What do you want to do, {user.firstName}?
              </h2>

              {/* Chat input */}
              <div className="assistant-input-box">
                <textarea rows={1} placeholder="What can I help you do?" />
                <div className="assistant-input-toolbar">
                  <button className="assistant-context-btn">
                    <IconSparkle size={12} />
                    <span>Context</span>
                    <span className="assistant-context-dot" />
                  </button>
                  <button className="assistant-mic-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1a2.5 2.5 0 0 0-2.5 2.5v4a2.5 2.5 0 0 0 5 0v-4A2.5 2.5 0 0 0 8 1Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3.5 7v.5a4.5 4.5 0 0 0 9 0V7M8 12v2.5M6 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Explore prompts */}
              <div className="assistant-prompts">
                <div className="assistant-prompts-header">
                  <span className="text-body-sm font-medium">Explore prompts</span>
                  <button className="assistant-prompts-dropdown">
                    Recommended
                    <IconChevronDown size={12} />
                  </button>
                </div>
                <div className="assistant-prompts-grid">
                  {prompts.map((prompt) => (
                    <button key={prompt} className="assistant-prompt-card">
                      <span className="assistant-prompt-icon">
                        <IconSparkle size={14} />
                      </span>
                      <span className="text-body-sm">{prompt}</span>
                    </button>
                  ))}
                </div>
                <button className="assistant-view-all text-caption">View all prompts</button>
              </div>

              <span className="assistant-help-link">What can the Assistant do?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
