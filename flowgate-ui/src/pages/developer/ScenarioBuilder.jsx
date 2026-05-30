import { useEffect, useState } from 'react'
import { getScenarios, createScenario } from '../../api/api.js'
import { useApp } from '../../context/AppContext.jsx'
import AppShell from '../../components/AppShell.jsx'

const OPERATORS = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains']
const INPUT_TYPES = ['text', 'number', 'boolean']
const OUTCOMES = ['pass', 'fail']

function emptyRule() {
  return { field: '', operator: 'eq', value: '', outcome: 'fail', message: '' }
}

function emptyStep() {
  return { name: '', default_outcome: 'pass', rules: [emptyRule()] }
}

function emptyForm() {
  return {
    scenario_type: '',
    scenario_name: '',
    display_name: '',
    steps: [emptyStep()],
    inputs: []
  }
}

function RuleRow({ rule, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-[1fr_100px_1fr_90px_1fr_32px] gap-2 items-center">
      <input
        className="glass-input px-3 py-1.5 rounded-lg text-sm"
        placeholder="field"
        value={rule.field}
        onChange={e => onChange({ ...rule, field: e.target.value })}
      />
      <select
        className="glass-input px-2 py-1.5 rounded-lg text-sm"
        value={rule.operator}
        onChange={e => onChange({ ...rule, operator: e.target.value })}
      >
        {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
      </select>
      <input
        className="glass-input px-3 py-1.5 rounded-lg text-sm"
        placeholder="value"
        value={rule.value}
        onChange={e => onChange({ ...rule, value: e.target.value })}
      />
      <select
        className="glass-input px-2 py-1.5 rounded-lg text-sm"
        value={rule.outcome}
        onChange={e => onChange({ ...rule, outcome: e.target.value })}
      >
        {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <input
        className="glass-input px-3 py-1.5 rounded-lg text-sm"
        placeholder="message"
        value={rule.message}
        onChange={e => onChange({ ...rule, message: e.target.value })}
      />
      <button
        type="button"
        onClick={onRemove}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-ash-400 hover:text-red-400 hover:bg-red-400/10 transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}

function StepCard({ step, index, onChange, onRemove, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? true)

  function updateRule(ruleIndex, updated) {
    const rules = step.rules.map((r, i) => i === ruleIndex ? updated : r)
    onChange({ ...step, rules })
  }

  function addRule() {
    onChange({ ...step, rules: [...step.rules, emptyRule()] })
  }

  function removeRule(ruleIndex) {
    onChange({ ...step, rules: step.rules.filter((_, i) => i !== ruleIndex) })
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-white/[0.04] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="text-ash-500 text-xs font-mono">#{index + 1}</span>
          <span className="text-ash-50 text-sm font-medium">
            {step.name || <span className="text-ash-500 italic">Unnamed step</span>}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            step.default_outcome === 'pass' ? 'badge-pass' : 'badge-fail'
          }`}>
            default: {step.default_outcome}
          </span>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onRemove() }}
            className="text-ash-500 hover:text-red-400 transition-colors text-lg leading-none"
          >
            ×
          </button>
          <span className="text-ash-500 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06]">
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-ash-400 text-xs mb-1">Step Name</label>
              <input
                className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                placeholder="e.g. Credit Score Check"
                value={step.name}
                onChange={e => onChange({ ...step, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-ash-400 text-xs mb-1">Default Outcome</label>
              <select
                className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                value={step.default_outcome}
                onChange={e => onChange({ ...step, default_outcome: e.target.value })}
              >
                {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-ash-400 text-xs">Rules</label>
              <span className="text-ash-500 text-xs">field · operator · value · outcome · message</span>
            </div>
            <div className="space-y-2">
              {step.rules.map((rule, ri) => (
                <RuleRow
                  key={ri}
                  rule={rule}
                  onChange={updated => updateRule(ri, updated)}
                  onRemove={() => removeRule(ri)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addRule}
              className="mt-2 btn-ghost px-3 py-1.5 rounded-lg text-xs"
            >
              + Add Rule
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function InputRow({ input, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-[1fr_100px_1fr_80px_32px] gap-2 items-center">
      <input
        className="glass-input px-3 py-1.5 rounded-lg text-sm"
        placeholder="field name"
        value={input.field}
        onChange={e => onChange({ ...input, field: e.target.value })}
      />
      <select
        className="glass-input px-2 py-1.5 rounded-lg text-sm"
        value={input.type}
        onChange={e => onChange({ ...input, type: e.target.value })}
      >
        {INPUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input
        className="glass-input px-3 py-1.5 rounded-lg text-sm"
        placeholder="label"
        value={input.label}
        onChange={e => onChange({ ...input, label: e.target.value })}
      />
      <button
        type="button"
        onClick={() => onChange({ ...input, required: !input.required })}
        className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
          input.required ? 'btn-primary' : 'btn-ghost'
        }`}
      >
        {input.required ? 'Required' : 'Optional'}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-ash-400 hover:text-red-400 hover:bg-red-400/10 transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}

function ScenarioEditor({ domainId, onSaved }) {
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function updateStep(index, updated) {
    setForm(f => ({ ...f, steps: f.steps.map((s, i) => i === index ? updated : s) }))
  }

  function addStep() {
    setForm(f => ({ ...f, steps: [...f.steps, emptyStep()] }))
  }

  function removeStep(index) {
    setForm(f => ({ ...f, steps: f.steps.filter((_, i) => i !== index) }))
  }

  function updateInput(index, updated) {
    setForm(f => ({ ...f, inputs: f.inputs.map((inp, i) => i === index ? updated : inp) }))
  }

  function addInput() {
    setForm(f => ({ ...f, inputs: [...f.inputs, { field: '', type: 'text', label: '', required: true }] }))
  }

  function removeInput(index) {
    setForm(f => ({ ...f, inputs: f.inputs.filter((_, i) => i !== index) }))
  }

  async function handleSave() {
    setError(null)
    setSuccess(false)
    if (!form.display_name.trim() || !form.scenario_type.trim() || !form.scenario_name.trim()) {
      setError('Scenario name, type and display name are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        domain_id: domainId,
        scenario_type: form.scenario_type.trim(),
        scenario_name: form.scenario_name.trim(),
        display_name: form.display_name.trim(),
        steps: form.steps.map((s, i) => ({
          name: s.name,
          order: i + 1,
          default_outcome: s.default_outcome,
          rules: s.rules.map((r, ri) => ({ ...r, order: ri + 1 }))
        })),
        inputs: form.inputs.map((inp, i) => ({ ...inp, order: i + 1 }))
      }
      await createScenario(payload)
      setSuccess(true)
      setForm(emptyForm())
      onSaved()
    } catch {
      setError('Failed to save scenario')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Scenario Details */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="text-ash-50 font-semibold text-sm uppercase tracking-wider">Scenario Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-ash-400 text-xs mb-1">Display Name</label>
            <input
              className="glass-input w-full px-3 py-2 rounded-lg text-sm"
              placeholder="e.g. Credit Check"
              value={form.display_name}
              onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-ash-400 text-xs mb-1">Scenario Type</label>
            <input
              className="glass-input w-full px-3 py-2 rounded-lg text-sm"
              placeholder="e.g. loan"
              value={form.scenario_type}
              onChange={e => setForm(f => ({ ...f, scenario_type: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-ash-400 text-xs mb-1">Scenario Name</label>
            <input
              className="glass-input w-full px-3 py-2 rounded-lg text-sm"
              placeholder="e.g. credit_check"
              value={form.scenario_name}
              onChange={e => setForm(f => ({ ...f, scenario_name: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-ash-50 font-semibold text-sm uppercase tracking-wider">Steps</h3>
          <button type="button" onClick={addStep} className="btn-ghost px-3 py-1.5 rounded-lg text-xs">
            + Add Step
          </button>
        </div>
        {form.steps.map((step, i) => (
          <StepCard
            key={i}
            step={step}
            index={i}
            onChange={updated => updateStep(i, updated)}
            onRemove={() => removeStep(i)}
            defaultOpen={i === 0}
          />
        ))}
        {form.steps.length === 0 && (
          <p className="text-ash-500 text-sm text-center py-6">No steps yet — add one above</p>
        )}
      </div>

      {/* Inputs */}
      <div className="glass-card rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-ash-50 font-semibold text-sm uppercase tracking-wider">Input Fields</h3>
          <button type="button" onClick={addInput} className="btn-ghost px-3 py-1.5 rounded-lg text-xs">
            + Add Input
          </button>
        </div>
        {form.inputs.length === 0 && (
          <p className="text-ash-500 text-sm">No input fields — this scenario will run without user inputs</p>
        )}
        {form.inputs.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_100px_1fr_80px_32px] gap-2 px-1">
              {['Field', 'Type', 'Label', 'Required', ''].map(h => (
                <span key={h} className="text-ash-500 text-xs">{h}</span>
              ))}
            </div>
            {form.inputs.map((inp, i) => (
              <InputRow
                key={i}
                input={inp}
                onChange={updated => updateInput(i, updated)}
                onRemove={() => removeInput(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-6 py-2.5 rounded-lg text-sm"
        >
          {saving ? 'Saving...' : 'Save Scenario'}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">Scenario saved successfully</p>}
      </div>
    </div>
  )
}

function ScenarioBuilder({ onNavigate }) {
  const { selectedDomain } = useApp()
  const [scenarios, setScenarios] = useState([])
  const [view, setView] = useState('new')

  function loadScenarios() {
    getScenarios(selectedDomain.id).then(setScenarios).catch(() => {})
  }

  useEffect(() => { loadScenarios() }, [selectedDomain.id])

  return (
    <AppShell onNavigate={onNavigate} currentPage="builder">
      <div className="flex gap-6 h-full">

        {/* Left panel — scenario list */}
        <div className="w-64 shrink-0 space-y-3">
          <button
            onClick={() => setView('new')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              view === 'new'
                ? 'btn-primary'
                : 'btn-ghost'
            }`}
          >
            + New Scenario
          </button>

          {scenarios.length > 0 && (
            <div>
              <p className="text-ash-500 text-xs uppercase tracking-wider mb-2 px-1">Existing</p>
              <div className="space-y-2">
                {scenarios.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setView(s.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      view === s.id
                        ? 'glass-card border-white/20'
                        : 'glass-card glass-card-hover'
                    }`}
                  >
                    <p className="text-ash-50 text-sm font-medium truncate">{s.display_name}</p>
                    <p className="text-ash-400 text-xs mt-0.5">{s.scenario_type}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel — editor */}
        <div className="flex-1 overflow-auto">
          {view === 'new' ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-ash-50 tracking-tight">New Scenario</h2>
                <p className="text-ash-400 text-sm mt-1">{selectedDomain.name}</p>
              </div>
              <ScenarioEditor domainId={selectedDomain.id} onSaved={loadScenarios} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-ash-500">Scenario editing coming soon</p>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}

export default ScenarioBuilder
