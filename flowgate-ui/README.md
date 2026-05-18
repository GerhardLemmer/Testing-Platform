# Flowgate — UI

React frontend for the Flowgate platform. Calls the FastAPI backend at `http://localhost:8000` as an API. Auth handled by Keycloak — the app redirects to Keycloak login and attaches the JWT to all API requests.

Two interfaces:
- **Developer UI** — build and configure scenarios, steps, rules, and workflows
- **QA UI** — run scenarios, fill auto-generated forms, view step-by-step results

---

## Prerequisites

- Node.js LTS
- Flowgate backend running at `http://localhost:8000`
- Keycloak running at `http://localhost:8080`

---

## How to Run

```powershell
cd C:\Testing-Platform\flowgate-ui
npm run dev
```

Opens at `http://localhost:5173`

---

## Stack

- React 19 + Vite 8
- Tailwind CSS v4 + @tailwindcss/postcss
- keycloak-js (direct integration, no wrapper)

### Planned
- React Query — API data fetching
- React Flow — workflow canvas (Developer UI)
- Framer Motion — step animations (QA UI)

---

## Tailwind v4

No `tailwind.config.js`. PostCSS plugin is `@tailwindcss/postcss`. Custom Shamrock color palette defined in `src/index.css` using `@theme`. Use classes like `bg-shamrock-500`, `text-shamrock-300` etc.

---

## Keycloak

- Realm: `flowgate`
- Client: `flowgate-ui` (public, no secret)
- Redirect URI: `http://localhost:5173/*`
- Auth triggered on app load via `keycloak.init({ onLoad: 'login-required' })`

---

## Current Status

### Done
- Vite + React scaffold
- Tailwind v4 + Shamrock theme configured
- Keycloak login — full auth flow working
- AppContext — shared domain + keycloak state
- API client — Bearer token attached to all requests
- Domain selector page — fetches and displays user domains

### Up Next
- App layout shell (sidebar/nav)
- Scenario list page
- QA run page with auto-generated input form
- Developer pages (create domain, create scenario)
