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

## Available Scenarios

### Payment — `GET /run-scenario/{scenario_name}`

| Scenario Name        | Fails At         |
|----------------------|------------------|
| `success`            | Does not fail    |
| `insufficient_funds` | Check Funds      |
| `auth_failure`       | Authorize Card   |
| `fraud_detected`     | Fraud Check      |

### Authentication — `GET /auth?scenario_name={scenario_name}`

| Scenario Name         | Fails At             |
|-----------------------|----------------------|
| `success`             | Does not fail        |
| `invalid_credentials` | Verify Password      |
| `account_locked`      | Check Account Status |
| `token_expired`       | Generate Token       |

### Order — `GET /order?scenario_name={scenario_name}`

| Scenario Name     | Fails At          |
|-------------------|-------------------|
| `success`         | Does not fail     |
| `out_of_stock`    | Check Stock       |
| `payment_declined`| Process Payment   |
| `shipping_failure`| Dispatch Order    |
| `order_cancelled` | Assign Warehouse  |

### File Upload — `GET /file-upload?scenario_name={scenario_name}`

| Scenario Name        | Fails At        |
|----------------------|-----------------|
| `success`            | Does not fail   |
| `invalid_format`     | Validate File Type |
| `file_too_large`     | Check File Size |
| `virus_detected`     | Scan for Viruses|
| `processing_timeout` | Process File    |

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

Use any of the endpoints listed in the Available Scenarios section above and enter a scenario name from the corresponding table.

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
