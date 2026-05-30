# Flowgate — Session Handoff
**Date:** 2026-05-30

---

## What This Project Is

**Flowgate** — Scenario-Driven Workflow Simulation & Integration Testing Platform.

NOT an API testing tool. It simulates real business workflows (e.g. loan approval, payment processing) step by step, with rule-based success/failure behaviour. Backend devs define workflows and business rules through a UI. QA teams run and validate them without writing code.

---

## Repo

- GitHub: https://github.com/GerhardLemmer/Testing-Platform
- Local (work PC): `C:\Testing-Platform\`
- Local (home PC): clone to same path — `C:\Testing-Platform\`

---

## Stack

| Layer | Tech |
|-------|------|
| Backend | Python 3.14 + FastAPI |
| Auth | Keycloak (Docker, port 8080) |
| Database | PostgreSQL (Docker, port 5433) |
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 |

---

## Where Things Live

```
C:\Testing-Platform\
├── Flowgate-backend\       # FastAPI backend
├── flowgate-ui\            # React frontend
├── HANDOFF.md              # this file
└── HOME_SETUP.md           # home machine setup guide
```

---

## What's Built and Working

### Backend
- Keycloak auth end to end — JWT validates, user auto-created in DB on first login
- Full scenario CRUD — create, read, update (delete-and-recreate), delete with cascade
- Step + rule engine — first match wins, default_outcome fallback, operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`
- ScenarioInput model — declare typed input fields per scenario (field, type, label, required, order)
- Input validation on run — required fields checked, returns 422 with missing field list
- ScenarioRun recorded after every execution — triggered_by, input_data, outcome, failed_step, created_at
- Domain scoping — scenarios are scoped to domains, no cross-user data leakage
- Organization management — create orgs, add members with role enforcement
- Repository pattern — split into `infrastructure/repositories/` (user, org, domain, scenario)

### Frontend
- Keycloak login — redirect to Keycloak, returns authenticated with JWT attached to all API calls
- DomainSelector — personal / organisation sections, create domain modal with org picker
- AppShell — sidebar with domain name, username, logout, Change Domain, Builder nav link
- ScenarioList — fetches by domain_id, role-gated Edit button (admin/developer only)
- RunScenario — auto-renders form from input schema, submits, shows pass/fail result with step breakdown
- ScenarioBuilder — left panel lists scenarios, right panel has full create form (details, steps + rules, input fields)

---

## What To Build Next

### Backend
1. **Org invite system** — GitHub-style inbox; users receive invites and Accept/Decline (replaces direct-add member flow)
2. **Domain-level access control** on `GET /scenarios/{id}`, `PUT`, `DELETE` — currently only checks auth, not domain membership

### Frontend (in order)
1. **Scenario edit form** — clicking a scenario in ScenarioBuilder left panel should load it into an editable form. `GET /scenarios/{id}` backend endpoint is ready. Prefill `ScenarioEditor`, wire `PUT /scenarios/{id}` on save.
2. **Run history page** — list past ScenarioRuns for a scenario. `GET /scenarios/{id}/runs` backend endpoint is ready.
3. **Create organisation page**
4. **Notification inbox** — org invite system UI (depends on backend invite system above)

---

## API Endpoints Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /scenarios | all | List scenarios for a domain (`domain_id` query param required) |
| POST | /scenarios | admin, developer | Create scenario with steps, rules, and input schema |
| GET | /scenarios/{id} | all | Get single scenario — nested steps, rules, inputs |
| PUT | /scenarios/{id} | admin, developer | Update scenario (delete-and-recreate steps/rules/inputs) |
| DELETE | /scenarios/{id} | admin, developer | Delete scenario and all related data |
| GET | /scenarios/{id}/inputs | all | Input schema for a scenario |
| GET | /scenarios/{id}/runs | all | Past ScenarioRuns (newest first) |
| POST | /scenarios/run | all | Run a scenario with JSON body, returns full steps array |
| GET | /domains | all | List personal + org domains for current user |
| POST | /domains | admin, developer | Create personal or org domain |
| GET | /organizations | all | List organizations the current user belongs to |
| POST | /organizations | all | Create organization |
| POST | /organizations/{id}/members | org admin | Add member to org |

---

## Database Models

- `User` — id, keycloak_id, email, full_name
- `Organization` — id, name, owner_id
- `OrganizationMember` — id, organization_id, user_id, role
- `Domain` — id, name, user_id (nullable), organization_id (nullable)
- `ScenarioModel` — id, domain_id, scenario_type, scenario_name, display_name
- `StepModel` — id, scenario_id, name, order, default_outcome ("pass"/"fail")
- `StepRule` — id, step_id, field, operator, value, outcome, message, order
- `ScenarioRun` — id, scenario_id, triggered_by, input_data (JSON), outcome, failed_step, created_at
- `ScenarioInput` — id, scenario_id, field, type, label, required, order

---

## Keycloak Config

- Admin console: http://localhost:8080 (admin/admin)
- Realm: `flowgate`
- Client `flowgate-backend`: client auth ON, direct access grants ON
- Client `flowgate-ui`: public client, redirect URI `http://localhost:5173/*`
- Roles: `admin`, `developer`, `qa`, `viewer`
- Test user: `snoxx` — has `admin` role

---

## Design System (Frontend)

Dark glassmorphism theme. Custom palette in `flowgate-ui/src/index.css`.

| Class | Role |
|-------|------|
| `.glass-card` | frosted glass card |
| `.glass-card-hover` | card with hover effect |
| `.glass-sidebar` | sidebar |
| `.glass-modal` | modal overlay |
| `.glass-input` | inputs and selects |
| `.btn-primary` | primary action button |
| `.btn-ghost` | secondary/ghost button |
| `.badge-pass` | green pass badge |
| `.badge-fail` | red fail badge |
| `ash-50` → `ash-500` | text scale (light to muted) |

`<option>` elements inside `.glass-input` selects must have `background-color: #1a1025` — browsers ignore glassmorphism on native option elements.

---

## Important Decisions

- `@react-keycloak/web` is NOT used — incompatible with keycloak-js v26; wired directly via `keycloak.js`
- Vite proxy handles CORS in dev — all API calls go to `/api/...` which proxies to `http://localhost:8000`
- UUIDs are never shown to users
- Frontend has two separate page trees: `pages/qa/` and `pages/developer/`
- `package.json` dev script uses `cross-env NODE_OPTIONS=--max-http-header-size=65536` to handle large Keycloak JWT headers through Vite's proxy
- Tailwind v4 — no `tailwind.config.js`, scanning is automatic via `@source` in `index.css`
