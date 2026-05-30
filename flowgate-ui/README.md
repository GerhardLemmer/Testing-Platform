# Flowgate — UI

React frontend for the Flowgate platform. Calls the FastAPI backend at `http://localhost:8000` via a Vite proxy. Auth handled by Keycloak — the app redirects to Keycloak login and attaches the JWT to all API requests.

Two interfaces:
- **Developer UI** — build and configure scenarios, steps, rules, and workflows
- **QA UI** — run scenarios, fill auto-generated forms, view step-by-step results

---

## Prerequisites

- Node.js 22 LTS
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
- keycloak-js v26 (direct integration, no wrapper)
- cross-env (dev script sets `--max-http-header-size=65536` for large Keycloak JWT headers)

### Planned
- React Query — API data fetching
- React Flow — workflow canvas (Developer UI)
- Framer Motion — step animations (QA UI)

---

## Tailwind v4

No `tailwind.config.js`. PostCSS plugin is `@tailwindcss/postcss`. Custom palette and component classes defined in `src/index.css` using `@theme`. Use classes like `bg-shamrock-500`, `text-ash-300` etc.

---

## Keycloak

- Realm: `flowgate`
- Client: `flowgate-ui` (public, no secret)
- Redirect URI: `http://localhost:5173/*`
- Auth triggered on app load via `keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256' })`
- `@react-keycloak/web` is NOT used — incompatible with keycloak-js v26
- `keycloak.updateToken(30)` called before every API request in `api.js` to handle token expiry silently

---

## Design System

Dark glassmorphism theme. All classes defined in `src/index.css`.

| Class | Role |
|-------|------|
| `.glass-card` | frosted dark glass card — resists background bleed |
| `.glass-card-hover` | card with hover lift effect |
| `.glass-sidebar` | sidebar — opaque dark base |
| `.glass-modal` | modal overlay |
| `.glass-input` | inputs and selects |
| `.btn-primary` | primary action button (white) |
| `.btn-ghost` | secondary/ghost button |
| `.badge-pass` | green pass badge |
| `.badge-fail` | red fail badge |
| `.nav-item-active` | active sidebar nav item — purple left border + glow |

**Animated background:** three drifting light orbs via `body::before`, `body::after`, `#root::before` (28s / 35s / 42s cycles). Noise grain overlay via `#root::after`.

`<option>` elements inside `.glass-input` selects must have `background-color: #1a1025` — browsers ignore glassmorphism on native option elements.

---

## Current Status

### Done
- Vite + React scaffold
- Tailwind v4 + custom theme
- Keycloak login — full auth flow, token auto-refresh
- AppContext — shared domain + keycloak state
- API client — Bearer token attached, token refreshed before every request
- Domain selector — fetches and displays user domains, create domain modal
- AppShell — sidebar with active nav indicator, domain name, username, logout
- ScenarioList — fetches by domain_id, role-gated Edit button
- RunScenario — auto-generated form from input schema, step-by-step result display
- ScenarioBuilder — create and edit scenarios (steps, rules, input fields)
- Animated glassmorphism UI

### Up Next
- Run history page — list past ScenarioRuns per scenario (`GET /scenarios/{id}/runs` ready)
- Create organisation page
- Notification inbox — org invite accept/decline UI
