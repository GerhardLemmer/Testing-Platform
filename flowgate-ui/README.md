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

**Note:** The dev script uses `cross-env NODE_OPTIONS=--max-http-header-size=65536` to handle large Keycloak JWT headers through Vite's proxy. Just run `npm run dev` as normal.

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

## Colour Palette

Two custom palettes defined in `src/index.css` — capped at 700, nothing darker used in components.

| Palette | Purpose |
|---------|---------|
| `cherry-pie` | Backgrounds, surfaces, sidebar, cards, text |
| `chateau-green` | Primary actions only — buttons, active states, pass indicators |

---

## Tailwind v4

No `tailwind.config.js`. PostCSS plugin is `@tailwindcss/postcss`. Custom palettes defined in `src/index.css` using `@theme`.

---

## Keycloak

- Realm: `flowgate`
- Client: `flowgate-ui` (public, no secret)
- Redirect URI: `http://localhost:5173/*`
- Auth triggered on app load via `keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256' })`

---

## App Routing

State-based routing in `App.jsx` — no router library:

```
No domain selected    → DomainSelector
Domain selected       → ScenarioList
Scenario selected     → RunScenario (qa/)
```

---

## Current Status

### Done
- Keycloak login — full auth flow working
- AppContext — shared domain + keycloak state
- API client — Bearer token attached to all requests
- Domain selector — Personal / Organisation sections, create domain modal with org picker
- App shell — sidebar with domain name, username, logout, change domain
- Scenario list — fetches by domain, role-gated Edit button (admin/developer only)
- QA run page — auto-rendered form from input schema, pass/fail result display

### Known Issues
- Run result shows no step breakdown — backend execute() doesn't return steps array
- Boolean inputs sent as query param strings — run endpoint needs to become POST with JSON body
- `createDomain` in api.js has typo: `orginization_id` should be `organization_id`

### Up Next
- Fix run endpoint (POST body) + fix step results display
- Developer pages — create scenario with step + rule builder
- Create organisation page
- Run history page
- Notification inbox — org invite system
