# Flowgate

Scenario-Driven Workflow Simulation & Integration Testing Platform.

Flowgate simulates real business workflows — loan approvals, payment flows, order fulfilment chains — step by step, with rule-based success and failure behavior. Developers define workflows and business rules through a UI. QA teams run and validate them without writing code.

---

## Repository Structure

```
C:\Testing-Platform\
├── Flowgate-backend\    → Python + FastAPI backend
├── flowgate-ui\         → React + Tailwind frontend
└── README.md            → This file
```

Each subdirectory has its own README with setup and run instructions.

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

## Further Reading

- [Backend README](Flowgate-backend/README.md) — architecture, API endpoints, data model
- [Frontend README](flowgate-ui/README.md) — setup, Keycloak config, planned features
