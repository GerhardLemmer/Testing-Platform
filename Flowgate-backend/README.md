# Flowgate — Backend

Scenario-Driven Workflow Simulation & Integration Testing Platform.

NOT an API mocking tool. Flowgate simulates real business workflows — loan approvals, payment flows, order fulfilment chains — step by step, with rule-based success and failure behavior. Developers define workflows and business rules through a UI. QA teams run and validate them without writing code.

---

## Prerequisites

- Python 3.14+
- Docker Desktop (for PostgreSQL and Keycloak)

---

## Architecture

Clean Architecture — dependencies flow inward only.

```
infrastructure/     → Database, auth, Keycloak, repositories
adapters/           → Controllers (route handlers), Pydantic schemas
application/        → Use cases (orchestration)
domain/             → Entities (core business logic, no external dependencies)
```

### Repository Pattern
All database queries are split into focused files under `infrastructure/repositories/`:
- `user_repository.py`
- `organization_repository.py`
- `domain_repository.py`
- `scenario_repository.py`

---

## How to Run

**1. Start Docker containers**
```powershell
docker start testing-platform-db
docker start testing-platform-keycloak
```

**2. Activate virtual environment**
```powershell
cd C:\Testing-Platform\Flowgate-backend
.\venv\Scripts\Activate.ps1
```

**3. Start the server**
```powershell
uvicorn main:app --reload
```

**4. Open Swagger UI**
```
http://localhost:8000/docs
```

---

## Recreate Database Tables
```powershell
python -m infrastructure.create_tables
```
This drops and recreates all tables. Do not run against a database with data you want to keep.

---

## Auth

All endpoints require a Bearer token from Keycloak.

- Keycloak admin console: `http://localhost:8080` (admin/admin)
- Realm: `flowgate`
- Client: `flowgate-backend`
- Test user: `snoxx` — has `admin` role

---

## API Endpoints

### Domains
| Method | Endpoint | Roles |
|--------|----------|-------|
| GET | `/domains` | all |
| POST | `/domains` | admin, developer |

### Scenarios
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/scenarios?domain_id=` | domain_id required |
| POST | `/scenarios` | admin, developer |
| GET | `/scenarios/run/{scenario_type}?scenario_name=&domain_id=` | all |
| GET | `/scenarios/{scenario_id}/inputs` | all |

### Organizations
| Method | Endpoint | Roles |
|--------|----------|-------|
| GET | `/organizations` | all |
| POST | `/organizations` | all |
| POST | `/organizations/{org_id}/members` | org admin |

---

## Data Model

- **Domain** — testing environment/workspace, personal or org-shared
- **Scenario** — belongs to a domain, has type, name, steps, and input schema
- **Step** — ordered, has a `default_outcome` and rules
- **StepRule** — condition evaluated against runtime input (`field`, `operator`, `value`, `outcome`, `message`)
- **ScenarioInput** — declared input fields for a scenario (`field`, `type`, `label`, `required`, `order`)
- **ScenarioRun** — recorded execution (who ran it, input data, outcome, failed step)

### Rule Operators
`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`

First matching rule wins. If no rule matches, `default_outcome` applies.

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
        }
      ]
    }
  ],
  "inputs": [
    {
      "field": "credit_score",
      "type": "number",
      "label": "Credit Score",
      "required": true,
      "order": 1
    }
  ]
}
```

---

## Current Status

### Done
- Keycloak JWT auth end to end
- Role-based access control (admin, developer, qa, viewer)
- Multi-tenancy — personal and org-shared domains with isolation enforced
- Rule-based scenario engine
- ScenarioInput — declared input schema per scenario
- ScenarioRun — execution recorded on every run
- Repository pattern — split into `infrastructure/repositories/`
- `GET /organizations` — list orgs for current user

### Known Issues
- Run endpoint is GET — input_data sent as query params causes booleans to come through as strings
- `execute()` in `domain/entities/scenario.py` does not return a steps array — only overall pass/fail

### Up Next
- Fix run endpoint: change to POST, accept input_data as JSON body
- Fix `execute()` to return full steps array with per-step outcome and message
- Run history endpoint: `GET /scenarios/{id}/runs`
- Input validation on execution against declared ScenarioInput schema
