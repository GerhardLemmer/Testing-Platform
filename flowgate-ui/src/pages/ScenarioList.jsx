import { useEffect, useState } from 'react'
import { getScenarios } from '../api/api.js'
import { useApp } from '../context/AppContext.jsx'
import AppShell from '../components/AppShell.jsx'

function ScenarioList({ onRun, onHistory, onNavigate }) {
  const { selectedDomain, keycloak } = useApp()
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const roles = keycloak.tokenParsed?.realm_access?.roles ?? []
  const isDeveloper = roles.includes('developer') || roles.includes('admin')

  useEffect(() => {
    getScenarios(selectedDomain.id)
      .then(setScenarios)
      .catch(() => setError('Failed to load scenarios'))
      .finally(() => setLoading(false))
  }, [selectedDomain.id])

  return (
    <AppShell onNavigate={onNavigate} currentPage="scenarios">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-ash-50 tracking-tight">Scenarios</h2>
            <p className="text-ash-300 text-sm mt-1">{selectedDomain.name}</p>
          </div>
        </div>

        {loading && <p className="text-ash-300">Loading scenarios...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && scenarios.length === 0 && (
          <p className="text-ash-300">No scenarios found for this domain.</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className="glass-card rounded-xl px-6 py-4 flex items-center justify-between transition-all"
            >
              <div>
                <p className="font-semibold text-ash-50">{scenario.display_name}</p>
                <p className="text-ash-400 text-sm mt-1">{scenario.scenario_type}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onHistory(scenario)}
                  className="btn-ghost px-4 py-2 rounded-lg text-sm"
                >
                  History
                </button>
                <button
                  onClick={() => onRun(scenario)}
                  className="btn-primary px-4 py-2 rounded-lg text-sm"
                >
                  Run
                </button>
                {isDeveloper && (
                  <button
                    className="btn-ghost px-4 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

export default ScenarioList
