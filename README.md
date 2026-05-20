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
| Frontend | React 19 + Vite + Tailwind CSS v4 |

---

## Current Status

### Completed
- Keycloak auth end to end
- Domain management (personal + org) with isolation enforced
- Rule-based scenario engine
- ScenarioRun history recording
- ScenarioInput schema declaration
- Backend repository refactor — split into `repositories/` folder (user, org, domain, scenario)
- `GET /organizations` endpoint
- Frontend app shell (sidebar, nav, logout)
- Frontend domain selector — Personal / Organisation sections + create domain modal
- Frontend scenario list — role-gated Edit button
- Frontend QA run page — auto-rendered form from input schema, pass/fail result

### Planned
- Developer UI — scenario + workflow builder
- Create organisation page
- Run history and reporting
- **Org invite system** — GitHub-style inbox where users receive org/domain invites and can Accept or Decline. Invite button on domain management page searches by username or email and sends a pending invite. Replaces the current direct-add member flow for normal users.
- AI-assisted workflow extraction

---

## Further Reading

- [Backend Handoff](Flowgate-backend/handoff.md)
- [Frontend Handoff](flowgate-ui/handoff.md)
