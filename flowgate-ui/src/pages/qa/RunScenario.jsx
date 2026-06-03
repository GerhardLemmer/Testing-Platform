import { useEffect, useState } from 'react'
import { getScenarioInputs, runScenario } from '../../api/api.js'
import { useApp } from '../../context/AppContext.jsx'
import AppShell from '../../components/AppShell.jsx'

function RunScenario({ scenario, onBack, onNavigate }) {
  const { selectedDomain } = useApp()
  const [inputs, setInputs] = useState([])
  const [formData, setFormData] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getScenarioInputs(scenario.id)
      .then(data => {
        setInputs(data)
        const initial = {}
        data.forEach(input => {
          initial[input.field] = input.type === 'boolean' ? false : ''
        })
        setFormData(initial)
      })
      .catch(() => setError('Failed to load scenario inputs'))
      .finally(() => setLoading(false))
  }, [scenario.id])

  function handleChange(field, type, value) {
    setFormData(prev => ({
      ...prev,
      [field]: type === 'boolean' ? value : type === 'number' ? Number(value) : value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)
    try {
      const data = await runScenario(scenario.scenario_type, scenario.scenario_name, selectedDomain.id, formData)
      setResult(data)
    } catch {
      setError('Failed to run scenario')
    } finally {
      setSubmitting(false)
    }
  }

  function renderField(input) {
    if (input.type === 'boolean') {
      return (
        <div key={input.field} className="flex items-center gap-3">
          <input
            type="checkbox"
            id={input.field}
            checked={formData[input.field] ?? false}
            onChange={e => handleChange(input.field, 'boolean', e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor={input.field} className="text-ash-200 text-sm">
            {input.label}
            {input.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        </div>
      )
    }

    return (
      <div key={input.field}>
        <label className="block text-ash-300 text-sm mb-1">
          {input.label}
          {input.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <input
          type={input.type === 'number' ? 'number' : 'text'}
          value={formData[input.field] ?? ''}
          onChange={e => handleChange(input.field, input.type, e.target.value)}
          required={input.required}
          className="glass-input w-full px-4 py-2 rounded-lg"
        />
      </div>
    )
  }

  return (
    <AppShell onNavigate={onNavigate} currentPage="scenarios">
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-ash-400 hover:text-ash-100 text-sm transition-colors"
          >
            ← Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-ash-50 tracking-tight">{scenario.display_name}</h2>
            <p className="text-ash-400 text-sm mt-1">{scenario.scenario_type}</p>
          </div>
        </div>

        {loading && <p className="text-ash-300">Loading inputs...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="text-ash-50 font-semibold">Scenario Inputs</h3>

              {inputs.length === 0 && (
                <p className="text-ash-300 text-sm">This scenario has no inputs — just hit Run.</p>
              )}

              {inputs.sort((a, b) => a.order - b.order).map(input => renderField(input))}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-6 py-2 rounded-lg text-sm"
                >
                  {submitting ? 'Running...' : 'Run Scenario'}
                </button>
              </div>
            </form>

            {result && (
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-ash-50 font-semibold">Result</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    result.success ? 'badge-pass' : 'badge-fail'
                  }`}>
                    {result.success ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <div className="space-y-2">
                  {result.steps?.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/[0.04] rounded-lg px-4 py-3"
                    >
                      <div>
                        <p className="text-ash-50 text-sm font-medium">{step.name}</p>
                        {step.message && (
                          <p className="text-ash-400 text-xs mt-0.5">{step.message}</p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        step.outcome === 'pass' ? 'badge-pass' : 'badge-fail'
                      }`}>
                        {step.outcome.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default RunScenario
