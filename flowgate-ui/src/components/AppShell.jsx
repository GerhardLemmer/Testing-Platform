import { useApp } from "../context/AppContext";

function AppShell({ children }){
    const { keycloak, selectedDomain, setSelectedDomain } = useApp()
    const username = keycloak.tokenParsed?.preferred_username

    return(
        <div className="min-h-screen flex">
            <aside className="w-64 glass-sidebar flex flex-col shrink-0">
                <div className="px-6 py-5 border-b border-white/[0.07]">
                    <h1 className="text-ash-50 text-xl font-bold tracking-tight">Flowgate</h1>
                    {selectedDomain && (
                        <p className="text-ash-300 text-sm mt-1 truncate">{selectedDomain.name}</p>
                    )}
                </div>

                <nav className="flex-1 px-4 py-4">
                    <p className="text-ash-400 text-xs uppercase tracking-wider mb-2 px-3">Navigation</p>
                    <button
                        onClick={() => setSelectedDomain(null)}
                        className="w-full text-left px-3 py-2 rounded-lg text-ash-200 hover:bg-white/[0.07] hover:text-ash-50 text-sm transition-colors"
                    >
                        Change Domain
                    </button>
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
