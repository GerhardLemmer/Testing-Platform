import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getInvites } from "../api/api.js";

const AppContext = createContext(null)

export function AppProvider({ keycloak, children }) {
    const [selectedDomain, setSelectedDomain] = useState(null)
    const [pendingInviteCount, setPendingInviteCount] = useState(0)

    const refreshInviteCount = useCallback(() => {
        getInvites()
            .then(invites => setPendingInviteCount(invites.filter(i => i.status === 'pending').length))
            .catch(() => {})
    }, [])

    useEffect(() => {
        refreshInviteCount()
    }, [refreshInviteCount])

    return (
        <AppContext.Provider value={{ keycloak, selectedDomain, setSelectedDomain, pendingInviteCount, refreshInviteCount }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext)
}
