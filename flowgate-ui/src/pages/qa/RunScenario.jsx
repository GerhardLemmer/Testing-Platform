import { useEffect, useState } from 'react'
import { getScenarioInputs, runScenario } from '../../api/api.js'
import { useApp } from '../../context/AppContext.jsx'
import AppShell from '../../components/AppShell.jsx'

function RunScenario({ scenario, onBack }) {
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
            className="w-4 h-4 accent-chateau-green-500"
          />
          <label htmlFor={input.field} className="text-cherry-pie-100 text-sm">
            {input.label}
            {input.required && <span className="text-red-300 ml-1">*</span>}
          </label>
        </div>
      )
    }

    return (
      <div key={input.field}>
        <label className="block text-cherry-pie-100 text-sm mb-1">
          {input.label}
          {input.required && <span className="text-red-300 ml-1">*</span>}
        </label>
        <input
          type={input.type === 'number' ? 'number' : 'text'}
          value={formData[input.field] ?? ''}
          onChange={e => handleChange(input.field, input.type, e.target.value)}
          required={input.required}
          className="w-full bg-cherry-pie-500 text-cherry-pie-50 px-4 py-2 rounded-lg border border-cherry-pie-500 focus:outline-none focus:border-chateau-green-500 placeholder-cherry-pie-300"
        />
      </div>
    )
  }

  return (
    <AppShell>
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-cherry-pie-200 hover:text-cherry-pie-50 text-sm transition-colors"
          >
            ← Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-cherry-pie-50">{scenario.display_name}</h2>
            <p className="text-cherry-pie-100 text-sm mt-1">{scenario.scenario_type}</p>
          </div>
        </div>

        {loading && <p className="text-cherry-pie-100">Loading inputs...</p>}
        {error && <p className="text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-cherry-pie-400 rounded-lg p-6 space-y-4">
              <h3 className="text-cherry-pie-50 font-semibold mb-2">Scenario Inputs</h3>

              {inputs.length === 0 && (
                <p className="text-cherry-pie-100 text-sm">This scenario has no inputs — just hit Run.</p>
              )}

              {inputs.sort((a, b) => a.order - b.order).map(input => renderField(input))}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-chateau-green-500 hover:bg-chateau-green-400 text-cherry-pie-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Running...' : 'Run Scenario'}
                </button>
              </div>
            </form>

            {result && (
              <div className="bg-cherry-pie-400 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-cherry-pie-50 font-semibold">Result</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    result.success
                      ? 'bg-chateau-green-500 text-cherry-pie-50'
                      : 'bg-red-500 text-cherry-pie-50'
                  }`}>
                    {result.success ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <div className="space-y-2">
                  {result.steps?.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-cherry-pie-500 rounded-lg px-4 py-3"
                    >
                      <div>
                        <p className="text-cherry-pie-50 text-sm font-medium">{step.name}</p>
                        {step.message && (
                          <p className="text-cherry-pie-200 text-xs mt-0.5">{step.message}</p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        step.outcome === 'pass'
                          ? 'bg-chateau-green-500 text-cherry-pie-50'
                          : 'bg-red-500 text-cherry-pie-50'
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
