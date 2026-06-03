import { useState, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { getDomains, createDomain, getOrganizations } from "../api/api.js"

function DomainPickerOverlay({ onClose }) {
    const { selectedDomain, setSelectedDomain } = useApp()
    const [domains, setDomains] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [newName, setNewName] = useState('')
    const [newType, setNewType] = useState('personal')
    const [orgs, setOrgs] = useState([])
    const [selectedOrg, setSelectedOrg] = useState('')
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState(null)

    useEffect(() => {
        getDomains().then(setDomains).catch(() => {}).finally(() => setLoading(false))
        getOrganizations().then(setOrgs).catch(() => {})
    }, [])

    function pick(domain) {
        setSelectedDomain(domain)
        onClose()
    }

    async function handleCreate(e) {
        e.preventDefault()
        if (!newName.trim()) return
        if (newType === 'organization' && !selectedOrg) { setCreateError('Select an organisation'); return }
        setCreating(true)
        setCreateError(null)
        try {
            await createDomain(newName.trim(), newType === 'organization' ? selectedOrg : null)
            const updated = await getDomains()
            setDomains(updated)
            setShowCreate(false)
            setNewName('')
        } catch {
            setCreateError('Failed to create domain')
        } finally {
            setCreating(false)
        }
    }

    const personal = domains.filter(d => d.type === 'personal')
    const org = domains.filter(d => d.type === 'organization')

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-[3px]" onClick={onClose}>
            <div className="glass-modal rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-ash-50 text-xl font-bold">Select Domain</h2>
                        <p className="text-ash-400 text-sm mt-1">Choose a workspace to continue</p>
                    </div>
                    <button onClick={() => setShowCreate(!showCreate)} className="btn-ghost px-4 py-2 rounded-lg text-sm">
                        {showCreate ? 'Cancel' : '+ New Domain'}
                    </button>
                </div>

                {showCreate && (
                    <form onSubmit={handleCreate} className="mb-6 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-4">
                        <div>
                            <label className="block text-ash-300 text-sm mb-1">Domain Name</label>
                            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="glass-input w-full px-4 py-2 rounded-lg" placeholder="e.g. Loan Processing" autoFocus />
                        </div>
                        <div>
                            <label className="block text-ash-300 text-sm mb-2">Type</label>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setNewType('personal')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${newType === 'personal' ? 'btn-primary' : 'btn-ghost'}`}>Personal</button>
                                <button type="button" onClick={() => setNewType('organization')} disabled={orgs.length === 0} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${newType === 'organization' ? 'btn-primary' : 'btn-ghost'} disabled:opacity-40 disabled:cursor-not-allowed`}>Organisation</button>
                            </div>
                            {orgs.length === 0 && <p className="text-ash-500 text-xs mt-1">You are not a member of any organisation</p>}
                        </div>
                        {newType === 'organization' && orgs.length > 0 && (
                            <select value={selectedOrg} onChange={e => setSelectedOrg(e.target.value)} className="glass-input w-full px-4 py-2 rounded-lg">
                                <option value="" style={{ backgroundColor: '#1a1025' }}>Select an organisation...</option>
                                {orgs.map(o => <option key={o.id} value={o.id} style={{ backgroundColor: '#1a1025' }}>{o.name}</option>)}
                            </select>
                        )}
                        {createError && <p className="text-red-400 text-sm">{createError}</p>}
                        <button type="submit" disabled={creating || !newName.trim()} className="btn-primary w-full py-2 rounded-lg text-sm disabled:opacity-50">
                            {creating ? 'Creating...' : 'Create Domain'}
                        </button>
                    </form>
                )}

                {loading && <p className="text-ash-400 text-sm">Loading...</p>}

                {!loading && domains.length === 0 && !showCreate && (
                    <p className="text-ash-400 text-sm text-center py-6">No domains yet. Create one above.</p>
                )}

                {personal.length > 0 && (
                    <div className="mb-4">
                        <p className="text-ash-300 text-xs uppercase tracking-widest mb-3">Personal</p>
                        <div className="space-y-2">
                            {personal.map(d => (
                                <button key={d.id} onClick={() => pick(d)} className={`w-full text-left px-5 py-3 rounded-xl transition-all glass-card glass-card-hover ${selectedDomain?.id === d.id ? 'border border-purple-500/40' : ''}`}>
                                    <p className="text-ash-50 font-medium">{d.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {org.length > 0 && (
                    <div>
                        <p className="text-ash-300 text-xs uppercase tracking-widest mb-3">Organisation</p>
                        <div className="space-y-2">
                            {org.map(d => (
                                <button key={d.id} onClick={() => pick(d)} className={`w-full text-left px-5 py-3 rounded-xl transition-all glass-card glass-card-hover ${selectedDomain?.id === d.id ? 'border border-purple-500/40' : ''}`}>
                                    <p className="text-ash-50 font-medium">{d.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function DomainSwitcher() {
    const { selectedDomain } = useApp()
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all group"
            >
                <p className="text-ash-300 text-xs uppercase tracking-widest mb-0.5">Domain</p>
                <p className="text-ash-200 text-sm font-medium truncate group-hover:text-ash-50 transition-colors">
                    {selectedDomain
                        ? selectedDomain.name
                        : <span className="text-ash-500 italic text-xs">None — click to select</span>}
                </p>
            </button>
            {open && <DomainPickerOverlay onClose={() => setOpen(false)} />}
        </>
    )
}

function AppShell({ children, onNavigate, currentPage }) {
    const { keycloak, pendingInviteCount } = useApp()
    const username = keycloak.tokenParsed?.preferred_username
    const roles = keycloak.tokenParsed?.realm_access?.roles ?? []
    const isDeveloper = roles.includes('developer') || roles.includes('admin')

    const navItem = (label, page, badge = 0) => (
        <button
            onClick={() => onNavigate?.(page)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                currentPage === page
                    ? 'nav-item-active'
                    : 'text-ash-300 hover:bg-white/[0.06] hover:text-ash-50 border-l-2 border-transparent'
            }`}
        >
            <span>{label}</span>
            {badge > 0 && (
                <span className="bg-purple-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                    {badge}
                </span>
            )}
        </button>
    )

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 glass-sidebar flex flex-col shrink-0">
                <div className="px-4 py-5 border-b border-white/[0.07]">
                    <h1 className="text-ash-50 text-xl font-bold tracking-tight mb-3">Flowgate</h1>
                    <DomainSwitcher />
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    <p className="text-ash-300 text-xs uppercase tracking-widest mb-3 px-3">Navigation</p>
                    {navItem('Scenarios', 'scenarios')}
                    {isDeveloper && navItem('Builder', 'builder')}
                    {navItem('Organisations', 'organisations')}
                    {navItem('Invites', 'invites', pendingInviteCount)}
                </nav>

                <div className="px-6 py-4 border-t border-white/[0.07]">
                    <p className="text-ash-200 text-sm font-medium">{username}</p>
                    <button onClick={() => keycloak.logout()} className="text-ash-400 hover:text-ash-100 text-sm mt-1 transition-colors">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 text-ash-50 overflow-auto">
                {children}
            </main>
        </div>
    )
}

export default AppShell
