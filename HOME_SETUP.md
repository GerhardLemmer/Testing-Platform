# Flowgate — Home Machine Setup Guide

This guide gets the full Flowgate stack running on a fresh Windows machine from scratch.

---

## Prerequisites — Install These First

| Tool | Where to get it |
|------|----------------|
| Git | https://git-scm.com/download/win |
| Python 3.14 | https://www.python.org/downloads/ |
| Node.js (LTS) | https://nodejs.org/en/download |
| Docker Desktop | https://www.docker.com/products/docker-desktop/ |

Make sure Docker Desktop is running before continuing.

---

## Step 1 — Clone the Repo

```powershell
git clone https://github.com/GerhardLemmer/Testing-Platform.git C:\Testing-Platform
cd C:\Testing-Platform
```

---

## Step 2 — Set Up PostgreSQL in Docker

```powershell
docker run -d `
  --name testing-platform-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=flowgate `
  -p 5433:5432 `
  postgres:15
```

---

## Step 3 — Set Up Keycloak in Docker

```powershell
docker run -d `
  --name testing-platform-keycloak `
  -e KEYCLOAK_ADMIN=admin `
  -e KEYCLOAK_ADMIN_PASSWORD=admin `
  -p 8080:8080 `
  quay.io/keycloak/keycloak:24.0.1 start-dev
```

Wait about 30 seconds for Keycloak to start, then open http://localhost:8080 and log in with `admin / admin`.

### Configure Keycloak

**Create the realm:**
1. Click "Create realm"
2. Name it `flowgate`
3. Click Create

**Create the backend client:**
1. Go to Clients → Create client
2. Client ID: `flowgate-backend`
3. Turn ON "Client authentication"
4. Turn ON "Direct access grants"
5. Click Save
6. Go to Credentials tab → copy the client secret — update `.env` if it differs from the value below

**Create the frontend client:**
1. Go to Clients → Create client
2. Client ID: `flowgate-ui`
3. Leave "Client authentication" OFF (public client)
4. Valid redirect URIs: `http://localhost:5173/*`
5. Web origins: `http://localhost:5173`
6. Click Save

**Create roles:**
1. Go to Realm roles → Create role
2. Create these four roles one by one: `admin`, `developer`, `qa`, `viewer`

**Create a test user:**
1. Go to Users → Create user
2. Username: `snoxx`
3. Email: `glemmer94@gmail.com`
4. Click Create
5. Go to Credentials tab → Set password: `Gerhard01%` — turn OFF "Temporary"
6. Go to Role mappings → Assign role → assign `admin`

---

## Step 4 — Set Up the Backend

```powershell
cd C:\Testing-Platform\Flowgate-backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create the `.env` file in `Flowgate-backend\`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/flowgate
KEYCLOAK_URL=http://localhost:8080/
KEYCLOAK_REALM=flowgate
KEYCLOAK_CLIENT_ID=flowgate-backend
KEYCLOAK_CLIENT_SECRET=rdrSE8dziTxCw0ZprAqXiBfwnqEZprza
SECRET_KEY=supersecretkey
```

**Note:** The Keycloak client secret above was generated on the work machine. After setting up Keycloak fresh you will have a new secret — go to Keycloak → Clients → flowgate-backend → Credentials → copy the new secret and update `.env` and the token scripts below.

Create the database tables:

```powershell
python -m infrastructure.create_tables
```

---

## Step 5 — Set Up the Frontend

```powershell
cd C:\Testing-Platform\flowgate-ui
npm install
```

---

## Step 6 — Run Everything

Open three terminals:

**Terminal 1 — Backend:**
```powershell
cd C:\Testing-Platform\Flowgate-backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

**Terminal 2 — Frontend:**
```powershell
cd C:\Testing-Platform\flowgate-ui
npm run dev
```

**Terminal 3 — Docker (if containers are stopped):**
```powershell
docker start testing-platform-db
docker start testing-platform-keycloak
```

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| Keycloak Admin | http://localhost:8080 |

---

## Get a Token (for testing API via PowerShell)

```powershell
$body = @{
    client_id     = "flowgate-backend"
    client_secret = "rdrSE8dziTxCw0ZprAqXiBfwnqEZprza"
    username      = "snoxx"
    password      = "Gerhard01%"
    grant_type    = "password"
}
$token = (Invoke-RestMethod -Uri "http://localhost:8080/realms/flowgate/protocol/openid-connect/token" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded").access_token
```

Then use it:
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/domains" -Headers @{Authorization = "Bearer $token"}
```

---

## Create a Test Scenario (after setup)

```powershell
$scenario = @{
    domain_id      = "PASTE_YOUR_DOMAIN_ID_HERE"
    scenario_type  = "loan_application"
    scenario_name  = "basic_loan"
    display_name   = "Basic Loan Application"
    steps          = @(
        @{
            name            = "Credit Check"
            order           = 1
            default_outcome = "pass"
            rules           = @(
                @{ field = "credit_score"; operator = "lt"; value = "600"; outcome = "fail"; message = "Credit score too low"; order = 1 }
            )
        },
        @{
            name            = "Employment Check"
            order           = 2
            default_outcome = "pass"
            rules           = @(
                @{ field = "is_employed"; operator = "eq"; value = "false"; outcome = "fail"; message = "Applicant must be employed"; order = 1 }
            )
        }
    )
    inputs         = @(
        @{ field = "credit_score"; type = "number"; label = "Credit Score"; required = $true; order = 1 }
        @{ field = "is_employed"; type = "boolean"; label = "Is Employed?"; required = $true; order = 2 }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:8000/scenarios" -Method Post -Headers @{Authorization = "Bearer $token"} -Body $scenario -ContentType "application/json"
```

---

## Troubleshooting

**431 Request Header Too Large in browser**
The `package.json` dev script already includes the fix via `cross-env NODE_OPTIONS=--max-http-header-size=65536`. Just run `npm run dev` normally.

**Keycloak won't start**
Give it 30-60 seconds — it's slow on first boot. Check Docker Desktop logs if it still fails.

**Tables don't exist error**
Run `python -m infrastructure.create_tables` from the backend folder with the venv activated.

**Token script returns 401**
Your Keycloak client secret may differ from the one above. Get the correct one from Keycloak → Clients → flowgate-backend → Credentials.
