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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-cherry-pie-400 rounded-xl p-6 w-full max-w-md shadow-xl border border-cherry-pie-500">
        <h2 className="text-cherry-pie-50 text-lg font-semibold mb-4">Create Domain</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cherry-pie-100 text-sm mb-1">Domain Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-cherry-pie-500 text-cherry-pie-50 px-4 py-2 rounded-lg border border-cherry-pie-500 focus:outline-none focus:border-chateau-green-500 placeholder-cherry-pie-300"
              placeholder="e.g. Loan Processing"
            />
          </div>

          <div>
            <label className="block text-cherry-pie-100 text-sm mb-2">Domain Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('personal')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === 'personal'
                    ? 'bg-chateau-green-500 text-cherry-pie-50'
                    : 'bg-cherry-pie-500 text-cherry-pie-100 hover:bg-cherry-pie-300'
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
                    ? 'bg-chateau-green-500 text-cherry-pie-50'
                    : 'bg-cherry-pie-500 text-cherry-pie-100 hover:bg-cherry-pie-300'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Organisation
              </button>
            </div>
            {orgs.length === 0 && (
              <p className="text-cherry-pie-200 text-xs mt-1">You are not a member of any organisation</p>
            )}
          </div>

          {type === 'organization' && orgs.length > 0 && (
            <div>
              <label className="block text-cherry-pie-100 text-sm mb-1">Organisation</label>
              <select
                value={selectedOrg}
                onChange={e => setSelectedOrg(e.target.value)}
                className="w-full bg-cherry-pie-500 text-cherry-pie-50 px-4 py-2 rounded-lg border border-cherry-pie-500 focus:outline-none focus:border-chateau-green-500"
              >
                <option value="">Select an organisation...</option>
                {orgs.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-cherry-pie-500 text-cherry-pie-100 hover:bg-cherry-pie-300 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-chateau-green-500 hover:bg-chateau-green-400 text-cherry-pie-50 text-sm font-medium transition-colors disabled:opacity-50"
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
    <div className="min-h-screen bg-cherry-pie-600 flex items-center justify-center">
      <p className="text-cherry-pie-100">Loading domains...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-cherry-pie-600 flex items-center justify-center">
      <p className="text-red-300">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-cherry-pie-600 text-cherry-pie-50 p-8">
      <div className="max-w-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cherry-pie-50">Flowgate</h1>
            <p className="text-cherry-pie-100 mt-1">Select a domain to continue</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-chateau-green-500 hover:bg-chateau-green-400 text-cherry-pie-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Domain
          </button>
        </div>

        {personal.length > 0 && (
          <div className="mb-6">
            <p className="text-cherry-pie-200 text-xs uppercase tracking-wider mb-2">Personal</p>
            <div className="grid grid-cols-1 gap-3">
              {personal.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  className="bg-cherry-pie-400 hover:bg-cherry-pie-300 text-cherry-pie-50 text-left px-6 py-4 rounded-lg transition-colors"
                >
                  <p className="font-semibold">{domain.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {org.length > 0 && (
          <div className="mb-6">
            <p className="text-cherry-pie-200 text-xs uppercase tracking-wider mb-2">Organisation</p>
            <div className="grid grid-cols-1 gap-3">
              {org.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  className="bg-cherry-pie-400 hover:bg-cherry-pie-300 text-cherry-pie-50 text-left px-6 py-4 rounded-lg transition-colors"
                >
                  <p className="font-semibold">{domain.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {domains.length === 0 && (
          <p className="text-cherry-pie-100">No domains found. Create one to get started.</p>
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
