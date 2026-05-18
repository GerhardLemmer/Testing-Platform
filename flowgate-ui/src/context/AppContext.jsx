import { createContext, useContext, useState } from "react";

const AppContext = createContext(null)

export function AppProvider({keycloak, children}){
    const [selectedDomain, setSelectedDomain] = useState(null)

    return(
        <AppContext.Provider value = {{keycloak, selectedDomain, setSelectedDomain}}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext)
}