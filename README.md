NOTE: "Developed independently as a personal project. Contributions made during personal downtime outside of core work responsibilities."

# Flowgate

Scenario-Driven Workflow Simulation & Integration Testing Platform.

Flowgate simulates real business workflows — loan approvals, payment flows, order fulfilment chains — step by step, with rule-based success and failure behavior. Developers define workflows and business rules through a UI. QA teams run and validate them without writing code.

> **Status: Paused at v0.1**
> Flowgate reached a working v0.1 with auth, scenario execution, multi-tenancy, and a full UI in place. Development is intentionally paused — not abandoned. The next project applies the architecture and patterns learned here to a microservices stack in C# with Docker and Kubernetes. Flowgate informed that decision.

---

## What Was Built

This project went from zero to a functioning platform with:

- **Keycloak authentication** — full OIDC integration, token-based auth end to end
- **Multi-tenancy** — personal and organisation domains, domain-level access control on all endpoints
- **Organisation management** — create orgs, manage members, GitHub-style invite system
- **Scenario engine** — rule-based dynamic response generation with conditional logic
- **Full scenario CRUD** — scenarios with nested steps, rules, and typed input fields
- **Input validation** — declared input schemas, validated at execution time with descriptive 422 errors
- **Run history** — every scenario execution recorded and retrievable
- **Clean Architecture backend** — domain, application, adapters, and infrastructure layers kept separate; repository pattern throughout
- **React frontend** — login, domain selector, scenario list, scenario builder, run execution
- **Glassmorphism UI** — animated dark glass design with drifting light orbs and noise grain

---

## What Was Learned

| Area | What It Taught |
|---|---|
| Clean Architecture | How to structure a real backend so business logic doesn't depend on FastAPI, the database, or anything external — and why that matters when things change |
| Repository Pattern | How to abstract data access so use cases don't care whether data comes from Postgres, a cache, or a mock |
| Keycloak + OIDC | How token-based auth actually works end to end — not just calling a login endpoint, but validating JWTs, scoping access, and wiring it through a real frontend |
| Multi-tenancy | How to design domain-level access control that applies consistently across every route without repeating logic |
| FastAPI | Dependency injection, Pydantic validation, async patterns, and how a well-structured Python API actually feels to build |
| React + Vite | Component-driven UI, context-based state management, and how a detached frontend talks to an API-first backend |
| Domain modeling | How to think about a problem in terms of entities, rules, and behavior — not just database tables and endpoints |

---

## Architecture

```
flowgate-ui (React + Vite + Tailwind)
      |
Flowgate-backend (FastAPI)
      |
  ┌───┴───┐
  │       │
Keycloak  PostgreSQL
(Docker)  (Docker)
```

**Backend structure (Clean Architecture):**
```
Flowgate-backend/
├── domain/           → entities, value objects, business rules
├── application/      → use cases, orchestration
├── adapters/         → FastAPI routes, Pydantic schemas
└── infrastructure/   → repositories, database, auth, dependencies
```

---

## Repository Structure

```
Testing-Platform/
├── Flowgate-backend/    → Python + FastAPI backend
├── flowgate-ui/         → React + Tailwind frontend
├── HANDOFF.md           → final session state
├── HOME_SETUP.md        → fresh machine setup guide
└── README.md
```

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.14 + FastAPI |
| Auth | Keycloak (Docker) |
| Database | PostgreSQL (Docker) |
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 |

---

## Running the Project

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

## Further Reading

- [Backend README](Flowgate-backend/README.md)
- [Frontend README](flowgate-ui/README.md)
