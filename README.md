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

### Working
- Keycloak auth end to end
- Domain management (personal + org)
- Rule-based scenario engine
- ScenarioRun history recording
- ScenarioInput schema declaration
- Frontend: login → domain selector → domain selected

### In Progress
- Scenario list page
- QA run page with auto-generated forms
- App layout shell

### Planned
- Developer UI — scenario + workflow builder
- Run history and reporting
- AI-assisted workflow extraction

---

## Further Reading

- [Backend README](Flowgate-backend/README.md)
- [Frontend README](flowgate-ui/README.md)
