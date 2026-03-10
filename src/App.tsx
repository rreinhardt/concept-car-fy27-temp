import { Routes, Route } from 'react-router-dom'
import { FlowProvider } from '@/contexts/FlowContext'
import { UserProvider } from '@/contexts/UserContext'
import { PrototypeProvider } from '@/contexts/PrototypeContext'
import Layout from '@/components/system/Layout'
import FlowBar from '@/components/system/FlowBar'
import FeedbackOverlay from '@/components/system/FeedbackOverlay'

/* Onboarding pages (standalone — no layout shell) */
import SignUpPage from '@/pages/onboarding/SignUpPage'
import VerifiedPage from '@/pages/onboarding/VerifiedPage'
import BuildAnimationPage from '@/pages/onboarding/BuildAnimationPage'
import KnowledgeBasePage from '@/pages/onboarding/KnowledgeBasePage'
import TargetAudiencePage from '@/pages/onboarding/TargetAudiencePage'

/* Tool pages (standalone — no layout shell) */
import ApolloIA from '@/pages/tools/ApolloIA'

/* Main app pages (wrapped in Layout) */
import SearchPage from '@/pages/main/SearchPage'
import ReviewContactsPage from '@/pages/main/ReviewContactsPage'
import SaveToListPage from '@/pages/main/SaveToListPage'
import SequencePickerPage from '@/pages/main/SequencePickerPage'
import EnrollConfirmPage from '@/pages/main/EnrollConfirmPage'
import TriageQueuePage from '@/pages/main/TriageQueuePage'
import MeetingBookedPage from '@/pages/main/MeetingBookedPage'
import DiagnosticPage from '@/pages/main/DiagnosticPage'
import ScorecardHomePage from '@/pages/main/ScorecardHomePage'
import TasksPage from '@/pages/main/TasksPage'
import AssistantPage from '@/pages/main/AssistantPage'
import FindCompaniesPage from '@/pages/main/FindCompaniesPage'
import SavedListsPage from '@/pages/main/SavedListsPage'
import EmailsPage from '@/pages/main/EmailsPage'
import NotImplementedPage from '@/pages/main/NotImplementedPage'

function App() {
  return (
    <UserProvider>
      <FlowProvider>
        <PrototypeProvider>
          <Routes>
            {/* Tool pages — standalone */}
            <Route path="/apollo-ia" element={<ApolloIA />} />

            {/* Onboarding — standalone pages */}
            <Route path="/" element={<SignUpPage />} />
            <Route path="/verified" element={<VerifiedPage />} />
            <Route path="/welcome" element={<BuildAnimationPage />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/target-audience" element={<TargetAudiencePage />} />

            {/* Main app — layout shell */}
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/companies" element={<FindCompaniesPage />} />
                  <Route path="/lists" element={<SavedListsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/review" element={<ReviewContactsPage />} />
                  <Route path="/save-to-list" element={<SaveToListPage />} />
                  <Route path="/sequences" element={<SequencePickerPage />} />
                  <Route path="/enroll" element={<EnrollConfirmPage />} />
                  <Route path="/triage" element={<TriageQueuePage />} />
                  <Route path="/meeting-booked" element={<MeetingBookedPage />} />
                  <Route path="/diagnostic" element={<DiagnosticPage />} />
                  <Route path="/home" element={<ScorecardHomePage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/assistant" element={<AssistantPage />} />
                  <Route path="/emails" element={<EmailsPage />} />
                  <Route path="/agents" element={<NotImplementedPage />} />
                  <Route path="/sheets" element={<NotImplementedPage />} />
                  <Route path="/workflows" element={<NotImplementedPage />} />
                  <Route path="/analytics" element={<NotImplementedPage />} />
                  <Route path="/enrichment" element={<NotImplementedPage />} />
                  <Route path="/dialer" element={<NotImplementedPage />} />
                  <Route path="/meetings" element={<NotImplementedPage />} />
                  <Route path="/conversations" element={<NotImplementedPage />} />
                </Routes>
              </Layout>
            } />
          </Routes>

          {/* Prototype flow navigation — always visible */}
          <FlowBar />
          <FeedbackOverlay />
        </PrototypeProvider>
      </FlowProvider>
    </UserProvider>
  )
}

export default App
