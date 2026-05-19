import { useApp } from "../context/AppContext";

function AppShell({ children }){
    const { keycloak, selectedDomain, setSelectedDomain } = useApp()
    const username = keycloak.tokenParsed?.preferred_username

    return(
        <div className="min-h-screen bg-cherry-pie-600 flex">
            <aside className="w-64 bg-cherry-pie-400 flex flex-col">
                <div className="px-6 py-5 border-b border-cherry-pie-500">
                    <h1 className="text-cherry-pie-50 text-xl font-bold">Flowgate</h1>
                    {selectedDomain && (
                        <p className="text-cherry-pie-100 text-sm mt-1 truncate">{selectedDomain.name}</p>
                    )}
                </div>

                <nav className="flex-1 px-4 py-4">
                    <p className="text-cherry-pie-200 text-xs uppercase tracking-wider mb-2">Navigation</p>
                    <button
                        onClick={() => setSelectedDomain(null)}
                        className="w-full text-left px-3 py-2 rounded text-cherry-pie-50 hover:bg-cherry-pie-300 text-sm transition-colors"
                    >
                        Change Domain
                    </button>
                </nav>

                <div className="px-6 py-4 border-t border-cherry-pie-500">
                    <p className="text-cherry-pie-50 text-sm">{username}</p>
                    <button
                        onClick={() => keycloak.logout()}
                        className="text-cherry-pie-100 hover:text-cherry-pie-50 text-sm mt-1 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 text-cherry-pie-50">
                { children }
            </main>
        </div>
    )
}

export default AppShell
