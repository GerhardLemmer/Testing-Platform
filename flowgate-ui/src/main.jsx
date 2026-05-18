import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import keycloak from './keycloak.js'
import { AppProvider } from './context/AppContext.jsx'

keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256' }).then((authenticated) => {
  if (authenticated) {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <AppProvider keycloak={keycloak}>
          <App />
        </AppProvider>
      </StrictMode>
    )
  }
})
