# Testing Platform — API Mocking & Scenario Testing

## Prerequisites

Before running this project you will need the following installed:

**Python 3.11**
Download from: https://www.python.org/downloads/

During installation, check **"Add Python to PATH"** — this is required for the commands below to work.

**VS Code** (recommended IDE)
Download from: https://code.visualstudio.com/

After installing VS Code, install the **Python extension** (by Microsoft) from the Extensions panel.

---

A scenario-driven API mocking platform that simulates real-world system behaviour for developers and QA testers.

Instead of relying on actual external services, you define scenarios with steps that succeed or fail exactly as they would in production. The system executes each step in order and stops at the first failure — just like a real system would.

---

## MVP Status

The following is currently working:

- A request hits a mock API endpoint
- A scenario is looked up by name
- Steps execute in order and stop at first failure
- A meaningful response is returned with the result and reason
- Each request is logged to the console

---

## Architecture

Built using Clean Architecture principles. Dependencies flow inward only.

```
infrastructure/     → FastAPI app setup
adapters/           → Controllers (route handlers)
application/        → Use cases (orchestration)
domain/             → Entities (core business logic, no external dependencies)
```

---

## Available Payment Scenarios

| Scenario Name       | Fails At         |
|---------------------|------------------|
| `success`           | Does not fail     |
| `insufficient_funds`| Check Funds      |
| `auth_failure`      | Authorize Card   |
| `fraud_detected`    | Fraud Check      |

---

## How to Run

**1. Set up virtual environment**
```
python -m venv venv
venv\Scripts\activate
```

**2. Install dependencies**
```
python -m pip install -r requirements.txt
```

**3. Start the server**
```
uvicorn main:app --reload
```

**4. Test a scenario**

Open your browser and go to:
```
http://localhost:8000/docs
```

Use the `POST /run-scenario/{scenario_name}` endpoint and enter one of the scenario names from the table above.

---

## Example Response — Auth Failure

```json
{
  "success": false,
  "failed_step": "Authorize Card",
  "reason": "Card declined by issuer"
}
```

## Example Response — Success

```json
{
  "success": true,
  "message": "Scenario Payment Success executed successfully."
}
```
