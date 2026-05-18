# Flowgate — Scenario-Driven Workflow Simulation & Integration Testing Platform

## What This Is

NOT an API mocking tool or a request/response testing platform.

**Flowgate** simulates real business workflows — loan approvals, payment flows, order fulfilment chains — step by step, with rule-based success and failure behavior. Developers define workflows and business rules through a UI. QA teams run and validate them without writing code.

The goal: shift testing from "does this endpoint return 200" to "does my business process actually work end to end."

---

## Prerequisites

- **Python 3.14+**
- **Docker Desktop** — for PostgreSQL and Keycloak

---

## Architecture

Clean Architecture — dependencies flow inward only.

```
infrastructure/     → Database, auth, Keycloak, repository
adapters/           → Controllers (route handlers), schemas
application/        → Use cases (orchestration)
domain/             → Entities (core business logic, no external dependencies)
```

---

## How to Run

**1. Start Docker containers**
```powershell
docker start testing-platform-db
docker start testing-platform-keycloak
```

**2. Activate virtual environment**
```powershell
.\venv\Scripts\Activate.ps1
```

**3. Install dependencies**
```powershell
pip install -r requirements.txt
```

**4. Start the server**
```powershell
uvicorn main:app --reload
```

**5. Open Swagger UI**
```
http://localhost:8000/docs
```

---

## Auth

All endpoints require a Bearer token from Keycloak.

- Keycloak admin console: `http://localhost:8080` (admin/admin)
- Realm: `flowgate`
- Client: `flowgate-backend`
- Test user: `snoxx` (glemmer94@gmail.com) — has `admin` role

Get a token via Keycloak's token endpoint or use Swagger UI to paste it in.

---

## API Endpoints

### Domains
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/domains` | Create a personal or org domain | admin, developer |
| GET | `/domains` | List personal + org domains for current user | all |

### Scenarios
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/scenarios` | List scenarios in user's domains | all |
| POST | `/scenarios` | Create a scenario with steps and rules | admin, developer |
| GET | `/scenarios/{scenario_type}?scenario_name=&domain_id=` | Run a scenario with input data | all |

### Organizations
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/organizations` | Create an organization | all |
| POST | `/organizations/{org_id}/members` | Add a member to an org | org admin |

---

## Data Model

### Domain
A testing environment/workspace. Can be personal (owned by a user) or shared (owned by an organization). Scenarios are fully isolated per domain.

### Scenario
Belongs to a domain. Has a type, name, display name, and an ordered list of steps.

### Step
Belongs to a scenario. Has a `default_outcome` (`pass` or `fail`) and an ordered list of rules.

### StepRule
A condition evaluated against input data at runtime:
- `field` — the input key to check (e.g. `credit_score`)
- `operator` — `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`
- `value` — the threshold to compare against
- `outcome` — `pass` or `fail`
- `message` — returned to the caller explaining the result

Rules are evaluated in order. First match wins. If no rule matches, `default_outcome` applies.

### ScenarioRun
A recorded execution — who ran it, what input data was provided, what the outcome was.

---

## Example — Create a Scenario

`POST /scenarios`

```json
{
  "domain_id": "your-domain-uuid",
  "scenario_type": "loan",
  "scenario_name": "credit_check",
  "display_name": "Credit Check",
  "steps": [
    {
      "name": "Credit Score Evaluation",
      "order": 1,
      "default_outcome": "pass",
      "rules": [
        {
          "field": "credit_score",
          "operator": "lt",
          "value": "600",
          "outcome": "fail",
          "message": "Credit score too low",
          "order": 1
        },
        {
          "field": "credit_score",
          "operator": "gte",
          "value": "600",
          "outcome": "pass",
          "message": "Credit score acceptable",
          "order": 2
        }
      ]
    }
  ]
}
```

## Example — Run a Scenario

`GET /scenarios/loan?scenario_name=credit_check&domain_id=your-domain-uuid`

Input data passed as request body (or query params — TBD with frontend).

**Pass response:**
```json
{
  "success": true,
  "message": "Scenario 'Credit Check' executed successfully."
}
```

**Fail response:**
```json
{
  "success": false,
  "failed_step": "Credit Score Evaluation",
  "reason": "Credit score too low"
}
```

---

## Current Status

### Done
- Clean architecture foundation
- PostgreSQL + Keycloak running in Docker
- Keycloak JWT auth end to end — token validation, auto user creation on first login
- Role-based access control — admin, developer, qa, viewer via Keycloak realm roles
- Multi-tenancy — personal domains and organization shared domains
- Domain scoping — scenarios fully isolated per domain, no cross-user data leakage
- Organization management — create orgs, add members with roles
- Rule-based scenario engine — steps evaluate conditions against runtime input data
- ScenarioRun model — execution history tracking ready

### In Progress
- Frontend — React + Tailwind (planning phase)

### Planned
- Input schema declaration on scenarios (for auto-generated QA forms)
- ScenarioRun recording on every execution
- Developer UI — workflow canvas (React Flow), step + rule editor
- QA UI — scenario cards, input form, live step animation
- AI-assisted workflow extraction from existing codebases
