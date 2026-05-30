import { useState } from 'react'
import { useApp } from './context/AppContext.jsx'
import DomainSelector from './pages/DomainSelector.jsx'
import ScenarioList from './pages/ScenarioList.jsx'
import RunScenario from './pages/qa/RunScenario.jsx'
import ScenarioBuilder from './pages/developer/ScenarioBuilder.jsx'

function App() {
  const { selectedDomain, keycloak } = useApp()
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [page, setPage] = useState('scenarios')

  const roles = keycloak.tokenParsed?.realm_access?.roles ?? []
  const isDeveloper = roles.includes('developer') || roles.includes('admin')

  if (!selectedDomain) return <DomainSelector />
  if (selectedScenario) return <RunScenario scenario={selectedScenario} onBack={() => setSelectedScenario(null)} />
  if (page === 'builder' && isDeveloper) return <ScenarioBuilder onNavigate={setPage} />
  return <ScenarioList onRun={setSelectedScenario} onNavigate={setPage} />
}

export default App
