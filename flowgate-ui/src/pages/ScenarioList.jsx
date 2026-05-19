import { useEffect, useState } from 'react'
import { getScenarios } from '../api/api.js'
import { useApp } from '../context/AppContext.jsx'
import AppShell from '../components/AppShell.jsx'

function ScenarioList({ onRun }) {
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
    <AppShell>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-cherry-pie-50">Scenarios</h2>
            <p className="text-cherry-pie-100 text-sm mt-1">{selectedDomain.name}</p>
          </div>
        </div>

        {loading && <p className="text-cherry-pie-100">Loading scenarios...</p>}
        {error && <p className="text-red-300">{error}</p>}

        {!loading && !error && scenarios.length === 0 && (
          <p className="text-cherry-pie-100">No scenarios found for this domain.</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className="bg-cherry-pie-400 hover:bg-cherry-pie-300 rounded-lg px-6 py-4 flex items-center justify-between transition-colors"
            >
              <div>
                <p className="font-semibold text-cherry-pie-50">{scenario.display_name}</p>
                <p className="text-cherry-pie-100 text-sm mt-1">{scenario.scenario_type}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onRun(scenario)}
                  className="bg-chateau-green-500 hover:bg-chateau-green-400 text-cherry-pie-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Run
                </button>
                {isDeveloper && (
                  <button
                    className="bg-cherry-pie-500 hover:bg-cherry-pie-600 text-cherry-pie-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
