import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell'
import { getInvites, respondToInvite } from '../api/api'
import { useApp } from '../context/AppContext'

function Invites({ onNavigate }) {
    const { refreshInviteCount } = useApp()
    const [invites, setInvites] = useState([])
    const [loading, setLoading] = useState(true)
    const [responding, setResponding] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        getInvites()
            .then(setInvites)
            .catch(() => setError('Failed to load invites.'))
            .finally(() => setLoading(false))
    }, [])

    async function handleRespond(inviteId, status) {
        setResponding(inviteId)
        try {
            const updated = await respondToInvite(inviteId, status)
            setInvites(prev => prev.map(i => i.id === inviteId ? updated : i))
            refreshInviteCount()
        } catch {
            setError('Failed to update invite.')
        } finally {
            setResponding(null)
        }
    }

    const pending = invites.filter(i => i.status === 'pending')
    const resolved = invites.filter(i => i.status !== 'pending')

    return (
        <AppShell onNavigate={onNavigate} currentPage="invites">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-ash-50 mb-1">Invites</h2>
                <p className="text-ash-200 text-sm mb-8">Organisation invitations sent to your account.</p>

                {error && (
                    <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-ash-400 text-sm">Loading...</p>
                ) : (
                    <>
                        {pending.length === 0 && resolved.length === 0 && (
                            <div className="glass-card px-6 py-10 text-center">
                                <p className="text-ash-400 text-sm">No invites yet.</p>
                            </div>
                        )}

                        {pending.length > 0 && (
                            <div className="mb-8">
                                <p className="text-ash-300 text-xs uppercase tracking-widest mb-3">Pending</p>
                                <div className="space-y-3">
                                    {pending.map(invite => (
                                        <div key={invite.id} className="glass-card px-5 py-4 flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-ash-50 text-sm font-medium">{invite.organization_name}</p>
                                                <p className="text-ash-300 text-xs mt-0.5">
                                                    {new Date(invite.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleRespond(invite.id, 'accepted')}
                                                    disabled={responding === invite.id}
                                                    className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRespond(invite.id, 'declined')}
                                                    disabled={responding === invite.id}
                                                    className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-50"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {resolved.length > 0 && (
                            <div>
                                <p className="text-ash-300 text-xs uppercase tracking-widest mb-3">Past</p>
                                <div className="space-y-3">
                                    {resolved.map(invite => (
                                        <div key={invite.id} className="glass-card px-5 py-4 flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-ash-50 text-sm font-medium">{invite.organization_name}</p>
                                                <p className="text-ash-300 text-xs mt-0.5">
                                                    {new Date(invite.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                invite.status === 'accepted'
                                                    ? 'bg-green-500/15 text-green-400'
                                                    : 'bg-red-500/15 text-red-400'
                                            }`}>
                                                {invite.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppShell>
    )
}

export default Invites
