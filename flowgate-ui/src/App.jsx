import { useState } from 'react'
import { useApp } from './context/AppContext.jsx'
import DomainSelector from './pages/DomainSelector.jsx'
import ScenarioList from './pages/ScenarioList.jsx'
import RunScenario from './pages/qa/RunScenario.jsx'

function App() {
  const { selectedDomain } = useApp()
  const [selectedScenario, setSelectedScenario] = useState(null)

  if (!selectedDomain) return <DomainSelector />
  if (selectedScenario) return <RunScenario scenario={selectedScenario} onBack={() => setSelectedScenario(null)} />
  return <ScenarioList onRun={setSelectedScenario} />
}

export default App
