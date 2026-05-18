import { useEffect, useState } from 'react'
import { getDomains } from '../api/api.js'
import { useApp } from '../context/AppContext.jsx'

function DomainSelector() {
  const { setSelectedDomain } = useApp()
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDomains()
      .then(setDomains)
      .catch(() => setError('Failed to load domains'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-shamrock-950 flex items-center justify-center">
      <p className="text-shamrock-300">Loading domains...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-shamrock-950 flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-shamrock-950 text-shamrock-50 p-8">
      <h1 className="text-3xl font-bold text-shamrock-50 mb-2">Flowgate</h1>
      <p className="text-shamrock-300 mb-8">Select a domain to continue</p>

      {domains.length === 0 ? (
        <p className="text-shamrock-400">No domains found. Ask an admin to create one.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-xl">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain)}
              className="bg-shamrock-800 hover:bg-shamrock-700 text-shamrock-50 text-left px-6 py-4 rounded-lg transition-colors"
            >
              <p className="font-semibold text-lg">{domain.name}</p>
              <p className="text-shamrock-300 text-sm">
                {domain.organization_id ? 'Organisation domain' : 'Personal domain'}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DomainSelector
