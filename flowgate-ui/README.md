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
- Tailwind CSS v4
- keycloak-js + @react-keycloak/web

### Planned
- React Query — API data fetching
- React Flow — workflow canvas (Developer UI)
- Framer Motion — step animations (QA UI)

---

## Tailwind v4

No `tailwind.config.js`. Configuration is in `postcss.config.js`. CSS entry is `@import "tailwindcss"` in `index.css`.

---

## Keycloak Setup

Before auth works, create a client in Keycloak:

1. Go to `http://localhost:8080` (admin/admin)
2. Select realm `flowgate`
3. Create client `flowgate-ui`
4. Set as public client (no secret)
5. Add redirect URI: `http://localhost:5173/*`

---

## Current Status

### Done
- Vite + React scaffold
- Tailwind v4 configured
- keycloak-js and @react-keycloak/web installed

### Up Next
- Keycloak client created in admin console
- `src/keycloak.js` — Keycloak instance
- `src/api.js` — fetch wrapper with Bearer token
- Domain selector page
- Scenario list page
- QA run page with auto-generated input form
