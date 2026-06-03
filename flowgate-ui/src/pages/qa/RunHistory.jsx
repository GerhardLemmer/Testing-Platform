import { useEffect, useState } from 'react'
import { getScenarioRuns } from '../../api/api.js'
import AppShell from '../../components/AppShell.jsx'

function RunHistory({ scenario, onBack, onNavigate }) {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getScenarioRuns(scenario.id)
      .then(setRuns)
      .catch(() => setError('Failed to load run history'))
      .finally(() => setLoading(false))
  }, [scenario.id])

  function formatDate(iso) {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  return (
    <AppShell onNavigate={onNavigate} currentPage="scenarios">
      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-ash-400 hover:text-ash-100 text-sm transition-colors"
          >
            ← Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-ash-50 tracking-tight">{scenario.display_name}</h2>
            <p className="text-ash-400 text-sm mt-1">Run History</p>
          </div>
        </div>

        {loading && <p className="text-ash-300">Loading history...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && runs.length === 0 && (
          <p className="text-ash-300">No runs yet for this scenario.</p>
        )}

        <div className="space-y-4">
          {runs.map(run => (
            <div key={run.id} className="glass-card rounded-xl px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-ash-300 text-sm">{formatDate(run.created_at)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  run.outcome === 'pass' ? 'badge-pass' : 'badge-fail'
                }`}>
                  {run.outcome.toUpperCase()}
                </span>
              </div>

              {run.failed_step && (
                <p className="text-ash-400 text-sm mb-3">
                  Failed at step: <span className="text-red-400 font-medium">{run.failed_step}</span>
                </p>
              )}

              {run.input_data && Object.keys(run.input_data).length > 0 && (
                <div className="bg-white/[0.04] rounded-lg px-4 py-3">
                  <p className="text-ash-400 text-xs font-semibold uppercase tracking-wider mb-2">Inputs</p>
                  <div className="space-y-1">
                    {Object.entries(run.input_data).map(([key, value]) => (
                      <div key={key} className="flex gap-2 text-sm">
                        <span className="text-ash-400">{key}:</span>
                        <span className="text-ash-100">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

export default RunHistory
