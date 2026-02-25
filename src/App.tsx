import { Routes, Route } from 'react-router-dom'
import { FlowProvider } from '@/contexts/FlowContext'
import { UserProvider } from '@/contexts/UserContext'
import { PrototypeProvider } from '@/contexts/PrototypeContext'
import Layout from '@/components/system/Layout'

/* Onboarding pages (standalone — no layout shell) */
import SignUpPage from '@/pages/onboarding/SignUpPage'
import VerifiedPage from '@/pages/onboarding/VerifiedPage'
import BuildAnimationPage from '@/pages/onboarding/BuildAnimationPage'
import KnowledgeBasePage from '@/pages/onboarding/KnowledgeBasePage'
import TargetAudiencePage from '@/pages/onboarding/TargetAudiencePage'

/* Main app pages (wrapped in Layout) */
import SearchPage from '@/pages/main/SearchPage'
import ScorecardHomePage from '@/pages/main/ScorecardHomePage'

function App() {
  return (
    <UserProvider>
      <FlowProvider>
        <PrototypeProvider>
          <Routes>
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
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/home" element={<ScorecardHomePage />} />
                  {/* Remaining pages will be added in Phase 4-6 */}
                </Routes>
              </Layout>
            } />
          </Routes>
        </PrototypeProvider>
      </FlowProvider>
    </UserProvider>
  )
}

export default App
