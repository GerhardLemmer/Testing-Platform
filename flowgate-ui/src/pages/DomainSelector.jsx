import { useEffect, useState } from 'react'
import { getDomains, getOrganizations, createDomain } from '../api/api.js'
import { useApp } from '../context/AppContext.jsx'

function CreateDomainModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('personal')
  const [orgs, setOrgs] = useState([])
  const [selectedOrg, setSelectedOrg] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOrganizations().then(setOrgs).catch(() => setOrgs([]))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    if (type === 'organization' && !selectedOrg) {
      setError('Please select an organization')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await createDomain(name.trim(), type === 'organization' ? selectedOrg : null)
      onCreated()
    } catch {
      setError('Failed to create domain')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-[2px]">
      <div className="glass-modal rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-ash-50 text-lg font-semibold mb-4">Create Domain</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-ash-300 text-sm mb-1">Domain Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="glass-input w-full px-4 py-2 rounded-lg"
              placeholder="e.g. Loan Processing"
            />
          </div>

          <div>
            <label className="block text-ash-300 text-sm mb-2">Domain Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('personal')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === 'personal'
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => setType('organization')}
                disabled={orgs.length === 0}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === 'organization'
                    ? 'btn-primary'
                    : 'btn-ghost'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Organisation
              </button>
            </div>
            {orgs.length === 0 && (
              <p className="text-ash-400 text-xs mt-1">You are not a member of any organisation</p>
            )}
          </div>

          {type === 'organization' && orgs.length > 0 && (
            <div>
              <label className="block text-ash-300 text-sm mb-1">Organisation</label>
              <select
                value={selectedOrg}
                onChange={e => setSelectedOrg(e.target.value)}
                className="glass-input w-full px-4 py-2 rounded-lg"
              >
                <option value="">Select an organisation...</option>
                {orgs.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-2 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DomainSelector() {
  const { setSelectedDomain } = useApp()
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  function loadDomains() {
    setLoading(true)
    getDomains()
      .then(setDomains)
      .catch(() => setError('Failed to load domains'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadDomains() }, [])

  const personal = domains.filter(d => d.type === 'personal')
  const org = domains.filter(d => d.type === 'organization')

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-ash-300">Loading domains...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen text-ash-50 p-8">
      <div className="max-w-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ash-50 tracking-tight">Flowgate</h1>
            <p className="text-ash-300 mt-1">Select a domain to continue</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary px-4 py-2 rounded-lg text-sm"
          >
            + New Domain
          </button>
        </div>

        {personal.length > 0 && (
          <div className="mb-6">
            <p className="text-ash-400 text-xs uppercase tracking-wider mb-3">Personal</p>
            <div className="grid grid-cols-1 gap-3">
              {personal.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  className="glass-card glass-card-hover text-ash-50 text-left px-6 py-4 rounded-xl transition-all"
                >
                  <p className="font-semibold">{domain.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {org.length > 0 && (
          <div className="mb-6">
            <p className="text-ash-400 text-xs uppercase tracking-wider mb-3">Organisation</p>
            <div className="grid grid-cols-1 gap-3">
              {org.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  className="glass-card glass-card-hover text-ash-50 text-left px-6 py-4 rounded-xl transition-all"
                >
                  <p className="font-semibold">{domain.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {domains.length === 0 && (
          <p className="text-ash-300">No domains found. Create one to get started.</p>
        )}
      </div>

      {showModal && (
        <CreateDomainModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); loadDomains() }}
        />
      )}
    </div>
  )
}

export default DomainSelector
