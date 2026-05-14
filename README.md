# Testing Platform — Scenario-Driven Workflow Simulation & Integration Testing Platform

## What This Is

This is NOT an API mocking tool or a request/response testing platform.

This is a **scenario-driven workflow simulation and integration testing platform** for developers and QA teams. The platform simulates real business workflows — like a loan approval process, a payment flow, or an order fulfilment chain — step by step, with realistic success and failure behavior.

The goal is to shift testing from "does this endpoint return 200" to "does my business process actually work end to end."

---

## Prerequisites

- **Python 3.14+**
- **Docker Desktop** — for running the PostgreSQL database
- **VS Code** (recommended) with the Python extension

---

## Architecture

Built using Clean Architecture principles. Dependencies flow inward only.

```
infrastructure/     → Database, auth, dependencies, repository
adapters/           → Controllers (route handlers), schemas
application/        → Use cases (orchestration)
domain/             → Entities (core business logic, no external dependencies)
```

---

## Current Status

### Done
- Clean architecture foundation
- PostgreSQL database running in Docker
- Scenario engine — steps execute in order, stop at first failure
- Generic scenario registry — supports any scenario type without code changes
- Full scenario CRUD via API — create and run scenarios dynamically
- JWT authentication — register and login
- Protected endpoints — all scenario endpoints require a valid token

### In Progress
- Domain and Organization model — multi-tenant workspace isolation
- Role-based access control — admin, developer, QA, viewer roles

### Planned
- Personal and organization workspaces
- Frontend — developer UI and QA interface
- GitHub and Google SSO
- AI-assisted workflow extraction from existing codebases

---

## How to Run

**1. Start the database**

Make sure Docker Desktop is running, then start the container:
```
docker start testing-platform-db
```

**2. Activate virtual environment**
```
venv\Scripts\Activate.ps1
```

**3. Install dependencies**
```
pip install -r requirements.txt
```

**4. Start the server**
```
uvicorn main:app --reload
```

**5. Open Swagger UI**
```
http://localhost:8000/docs
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT token | No |

### Scenarios
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/scenarios` | List all scenarios | Yes |
| POST | `/scenarios` | Create a new scenario with steps | Yes |
| GET | `/scenarios/{scenario_type}?scenario_name=` | Run a scenario | Yes |

---

## Example — Create a Scenario

`POST /scenarios`

```json
{
  "scenario_type": "payment",
  "scenario_name": "insufficient_funds",
  "display_name": "Insufficient Funds",
  "steps": [
    {"name": "Check Funds", "success": false, "message": "Insufficient funds", "order": 1},
    {"name": "Authorize Card", "success": true, "message": "Card authorized", "order": 2},
    {"name": "Process Payment", "success": true, "message": "Payment processed", "order": 3}
  ]
}
```

---

## Example Responses

**Success:**
```json
{
  "success": true,
  "message": "Scenario Payment Success executed successfully."
}
```

**Failure:**
```json
{
  "success": false,
  "failed_step": "Check Funds",
  "reason": "Insufficient funds"
}
```

**Unauthorized:**
```json
{
  "detail": "Not authenticated"
}
```
