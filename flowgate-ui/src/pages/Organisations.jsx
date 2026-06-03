import { useEffect, useState } from 'react'
import { getOrganizations, createOrganization, sendInvite } from '../api/api.js'
import AppShell from '../components/AppShell.jsx'

function Organisations({ onNavigate }) {
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [inviteOrgId, setInviteOrgId] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState(null)
  const [inviteSuccess, setInviteSuccess] = useState(null)

  useEffect(() => {
    fetchOrgs()
  }, [])

  function fetchOrgs() {
    setLoading(true)
    getOrganizations()
      .then(setOrgs)
      .catch(() => setError('Failed to load organisations'))
      .finally(() => setLoading(false))
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!orgName.trim()) return
    setCreating(true)
    setCreateError(null)
    try {
      await createOrganization(orgName.trim())
      setOrgName('')
      setShowForm(false)
      fetchOrgs()
    } catch {
      setCreateError('Failed to create organisation')
    } finally {
      setCreating(false)
    }
  }

  function openInvite(orgId) {
    setInviteOrgId(orgId)
    setInviteEmail('')
    setInviteError(null)
    setInviteSuccess(null)
  }

  function closeInvite() {
    setInviteOrgId(null)
    setInviteEmail('')
    setInviteError(null)
    setInviteSuccess(null)
  }

  async function handleInvite(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true)
    setInviteError(null)
    setInviteSuccess(null)
    try {
      await sendInvite(inviteOrgId, inviteEmail.trim())
      setInviteSuccess(`Invite sent to ${inviteEmail.trim()}`)
      setInviteEmail('')
    } catch {
      setInviteError('Failed to send invite. Check the email is registered.')
    } finally {
      setInviting(false)
    }
  }

  return (
    <AppShell onNavigate={onNavigate} currentPage="organisations">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-ash-50 tracking-tight">Organisations</h2>
            <p className="text-ash-300 text-sm mt-1">Organisations you belong to</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary px-4 py-2 rounded-lg text-sm"
            >
              Create Organisation
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="glass-card rounded-xl px-6 py-5 mb-6">
            <h3 className="text-ash-50 font-semibold mb-4">New Organisation</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder="Organisation name"
                className="glass-input flex-1 px-4 py-2 rounded-lg"
                autoFocus
              />
              <button
                type="submit"
                disabled={creating || !orgName.trim()}
                className="btn-primary px-4 py-2 rounded-lg text-sm"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setOrgName(''); setCreateError(null) }}
                className="btn-ghost px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
            {createError && <p className="text-red-400 text-sm mt-3">{createError}</p>}
          </form>
        )}

        {loading && <p className="text-ash-300">Loading organisations...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && orgs.length === 0 && (
          <p className="text-ash-300">You are not part of any organisation yet.</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {orgs.map(org => (
            <div key={org.id} className="glass-card rounded-xl px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ash-50">{org.name}</p>
                  {org.role && (
                    <p className="text-ash-400 text-sm mt-1 capitalize">{org.role}</p>
                  )}
                </div>
                {inviteOrgId !== org.id && (
                  <button
                    onClick={() => openInvite(org.id)}
                    className="btn-ghost px-3 py-1.5 rounded-lg text-sm"
                  >
                    Invite Member
                  </button>
                )}
              </div>

              {inviteOrgId === org.id && (
                <form onSubmit={handleInvite} className="mt-4 pt-4 border-t border-white/[0.07]">
                  <p className="text-ash-300 text-sm mb-3">Send an invite by email</p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="glass-input flex-1 px-4 py-2 rounded-lg text-sm"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={inviting || !inviteEmail.trim()}
                      className="btn-primary px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      {inviting ? 'Sending...' : 'Send'}
                    </button>
                    <button
                      type="button"
                      onClick={closeInvite}
                      className="btn-ghost px-4 py-2 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                  {inviteError && <p className="text-red-400 text-sm mt-2">{inviteError}</p>}
                  {inviteSuccess && <p className="text-green-400 text-sm mt-2">{inviteSuccess}</p>}
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

export default Organisations
