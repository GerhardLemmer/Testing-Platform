NOTE: "Developed independently as a personal project. Contributions made during personal downtime outside of core work responsibilities."

# Flowgate

Scenario-Driven Workflow Simulation & Integration Testing Platform.

Flowgate simulates real business workflows — loan approvals, payment flows, order fulfilment chains — step by step, with rule-based success and failure behavior. Developers define workflows and business rules through a UI. QA teams run and validate them without writing code.

---

## Repository Structure

```
C:\Testing-Platform\
├── Flowgate-backend\    → Python + FastAPI backend
├── flowgate-ui\         → React + Tailwind frontend
├── HANDOFF.md           → session state and what to build next
├── HOME_SETUP.md        → fresh machine setup guide
└── README.md
```

---

## Quick Start

**1. Start Docker containers**
```powershell
docker start testing-platform-db
docker start testing-platform-keycloak
```

**2. Start the backend**
```powershell
cd Flowgate-backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

**3. Start the frontend**
```powershell
cd flowgate-ui
npm run dev
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- Keycloak: `http://localhost:8080`
- Swagger UI: `http://localhost:8000/docs`

---

## Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.14 + FastAPI |
| Auth | Keycloak (Docker) |
| Database | PostgreSQL (Docker) |
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 |

---

## Current Status

### Completed
- Keycloak auth end to end
- Domain management (personal + org) with domain-level access control on all scenario endpoints
- Rule-based scenario engine
- Full scenario CRUD — GET (list + single with nested steps/rules/inputs), POST, PUT, DELETE
- ScenarioInput schema declaration + input validation on execution (422 with missing field list)
- ScenarioRun history recording — `GET /scenarios/{id}/runs`
- Backend repository pattern — split into `infrastructure/repositories/`
- `check_domain_access()` helper — reusable domain membership check in `dependencies.py`
- Frontend: login → domain selector → scenario list → run scenario
- Frontend ScenarioBuilder — create and edit scenarios with steps, rules, and input fields
- Animated glassmorphism UI — three drifting light orbs, noise grain, dark glass cards

### Up Next
- Run history page (frontend) — list past ScenarioRuns per scenario
- Create organisation page (frontend)
- Org invite system (backend + frontend) — GitHub-style inbox, replaces direct-add member flow

### Planned
- AI-assisted workflow extraction

---

## Further Reading

- [Backend README](Flowgate-backend/README.md)
- [Frontend README](flowgate-ui/README.md)
