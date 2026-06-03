import { useState } from 'react'
import { useApp } from './context/AppContext.jsx'
import AppShell from './components/AppShell.jsx'
import ScenarioList from './pages/ScenarioList.jsx'
import RunScenario from './pages/qa/RunScenario.jsx'
import RunHistory from './pages/qa/RunHistory.jsx'
import ScenarioBuilder from './pages/developer/ScenarioBuilder.jsx'
import Organisations from './pages/Organisations.jsx'
import Invites from './pages/Invites.jsx'

function NoDomainPrompt({ onNavigate }) {
  return (
    <AppShell onNavigate={onNavigate} currentPage="scenarios">
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
        <div className="glass-card rounded-2xl px-10 py-12 max-w-md">
          <p className="text-3xl mb-4">⬡</p>
          <h2 className="text-ash-50 text-xl font-semibold mb-2">No domain selected</h2>
          <p className="text-ash-400 text-sm mb-6">Select a domain from the sidebar to start working with scenarios.</p>
          <p className="text-ash-500 text-xs">Click the domain name in the top-left to switch or create one.</p>
        </div>
      </div>
    </AppShell>
  )
}

function App() {
  const { selectedDomain, keycloak } = useApp()
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [historyScenario, setHistoryScenario] = useState(null)
  const [page, setPage] = useState('scenarios')

  const roles = keycloak.tokenParsed?.realm_access?.roles ?? []
  const isDeveloper = roles.includes('developer') || roles.includes('admin')

  function navigate(p) {
    setPage(p)
    setSelectedScenario(null)
    setHistoryScenario(null)
  }

  if (selectedScenario) return <RunScenario scenario={selectedScenario} onBack={() => setSelectedScenario(null)} onNavigate={navigate} />
  if (historyScenario) return <RunHistory scenario={historyScenario} onBack={() => setHistoryScenario(null)} onNavigate={navigate} />
  if (page === 'builder' && isDeveloper) return <ScenarioBuilder onNavigate={navigate} />
  if (page === 'organisations') return <Organisations onNavigate={navigate} />
  if (page === 'invites') return <Invites onNavigate={navigate} />
  if (!selectedDomain) return <NoDomainPrompt onNavigate={navigate} />
  return <ScenarioList onRun={setSelectedScenario} onHistory={setHistoryScenario} onNavigate={navigate} />
}

export default App
