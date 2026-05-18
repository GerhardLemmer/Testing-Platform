import { useApp } from './context/AppContext.jsx'
import DomainSelector from './pages/DomainSelector.jsx'

function App() {
  const { selectedDomain } = useApp()

  if (!selectedDomain) {
    return <DomainSelector />
  }

  return (
    <div className="min-h-screen bg-shamrock-950 text-shamrock-50 flex items-center justify-center">
      <p className="text-shamrock-300">Domain selected: {selectedDomain.name}</p>
    </div>
  )
}

export default App
