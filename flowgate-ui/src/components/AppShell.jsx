import { useApp } from "../context/AppContext";

function AppShell({ children, onNavigate, currentPage }) {
    const { keycloak, selectedDomain, setSelectedDomain } = useApp()
    const username = keycloak.tokenParsed?.preferred_username
    const roles = keycloak.tokenParsed?.realm_access?.roles ?? []
    const isDeveloper = roles.includes('developer') || roles.includes('admin')

    return(
        <div className="min-h-screen flex">
            <aside className="w-64 glass-sidebar flex flex-col shrink-0">
                <div className="px-6 py-5 border-b border-white/[0.07]">
                    <h1 className="text-ash-50 text-xl font-bold tracking-tight">Flowgate</h1>
                    {selectedDomain && (
                        <p className="text-ash-300 text-sm mt-1 truncate">{selectedDomain.name}</p>
                    )}
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    <p className="text-ash-500 text-xs uppercase tracking-widest mb-3 px-3">Navigation</p>

                    <button
                        onClick={() => onNavigate?.('scenarios')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                            currentPage === 'scenarios' || !currentPage
                                ? 'nav-item-active'
                                : 'text-ash-300 hover:bg-white/[0.06] hover:text-ash-50 border-l-2 border-transparent'
                        }`}
                    >
                        Scenarios
                    </button>

                    {isDeveloper && (
                        <button
                            onClick={() => onNavigate?.('builder')}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                                currentPage === 'builder'
                                    ? 'nav-item-active'
                                    : 'text-ash-300 hover:bg-white/[0.06] hover:text-ash-50 border-l-2 border-transparent'
                            }`}
                        >
                            Builder
                        </button>
                    )}

                    <div className="pt-3 mt-3 border-t border-white/[0.06]">
                        <button
                            onClick={() => setSelectedDomain(null)}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-ash-500 hover:bg-white/[0.05] hover:text-ash-300 text-sm transition-all border-l-2 border-transparent"
                        >
                            Change Domain
                        </button>
                    </div>
                </nav>

                <div className="px-6 py-4 border-t border-white/[0.07]">
                    <p className="text-ash-200 text-sm font-medium">{username}</p>
                    <button
                        onClick={() => keycloak.logout()}
                        className="text-ash-400 hover:text-ash-100 text-sm mt-1 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 text-ash-50 overflow-auto">
                { children }
            </main>
        </div>
    )
}

export default AppShell
