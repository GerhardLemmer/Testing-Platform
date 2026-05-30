# Flowgate — Home Machine Setup Guide

This guide gets a fresh Windows machine running the full Flowgate stack (Docker + Backend + Frontend).

---

## Prerequisites

Install these first if not already present:

| Tool | Version | Where |
|------|---------|-------|
| Git | latest | https://git-scm.com |
| Python | 3.14 | https://www.python.org/downloads/ |
| Node.js | 22 LTS | https://nodejs.org |
| Docker Desktop | latest | https://www.docker.com/products/docker-desktop |

Make sure Docker Desktop is running before proceeding.

---

## 1. Clone the Repo

```powershell
git clone https://github.com/GerhardLemmer/Testing-Platform.git C:\Testing-Platform
cd C:\Testing-Platform
```

---

## 2. Start Docker Containers

### 2a. Create the PostgreSQL container

```powershell
docker run -d `
  --name testing-platform-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=flowgate `
  -p 5433:5432 `
  postgres:16
```

### 2b. Create the Keycloak container

```powershell
docker run -d `
  --name testing-platform-keycloak `
  -e KEYCLOAK_ADMIN=admin `
  -e KEYCLOAK_ADMIN_PASSWORD=admin `
  -p 8080:8080 `
  quay.io/keycloak/keycloak:24.0.1 `
  start-dev
```

Wait ~30 seconds for Keycloak to start, then verify: http://localhost:8080

> On subsequent sessions just run:
> ```powershell
> docker start testing-platform-db
> docker start testing-platform-keycloak
> ```

---

## 3. Configure Keycloak

Open http://localhost:8080 and log in with **admin / admin**.

### 3a. Create the Realm
- Click **Keycloak** dropdown (top left) → **Create Realm**
- Name: `flowgate`
- **Create**

### 3b. Create the Backend Client
- Sidebar → **Clients** → **Create client**
- Client ID: `flowgate-backend`
- Client authentication: **ON**
- Direct access grants: **ON** (under Authentication Flow)
- Save → go to **Credentials** tab → copy the client secret
- Update the `.env` file with this secret (see step 5)

### 3c. Create the Frontend Client
- **Create client**
- Client ID: `flowgate-ui`
- Client authentication: **OFF** (public client)
- Valid redirect URIs: `http://localhost:5173/*`
- Web origins: `http://localhost:5173`
- Save

### 3d. Create Realm Roles
- Sidebar → **Realm roles** → **Create role** — create all four:
  - `admin`
  - `developer`
  - `qa`
  - `viewer`

### 3e. Create a Test User
- Sidebar → **Users** → **Create new user**
- Username: `snoxx`
- Email: your email
- **Create** → **Credentials** tab → set a password (turn off Temporary)
- **Role mapping** tab → **Assign role** → assign `admin`

### 3f. Enable User Registration (optional)
- Sidebar → **Realm settings** → **Login** tab
- User registration: **ON**

---

## 4. Backend Setup

```powershell
cd C:\Testing-Platform\Flowgate-backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

---

## 5. Create the Backend `.env` File

Create `C:\Testing-Platform\Flowgate-backend\.env` with the following content — fill in the values marked with `<...>`:

```
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/flowgate
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=flowgate
KEYCLOAK_CLIENT_ID=flowgate-backend
KEYCLOAK_CLIENT_SECRET=<paste secret from step 3b>
SECRET_KEY=<generate any long random string>
```

> Generate a SECRET_KEY in PowerShell:
> ```powershell
> -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
> ```

---

## 6. Create Database Tables

```powershell
cd C:\Testing-Platform\Flowgate-backend
.\venv\Scripts\Activate.ps1
python -m infrastructure.create_tables
```

---

## 7. Run the Backend

```powershell
cd C:\Testing-Platform\Flowgate-backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Backend runs at http://localhost:8000  
Swagger docs at http://localhost:8000/docs

---

## 8. Frontend Setup

```powershell
cd C:\Testing-Platform\flowgate-ui
npm install
npm run dev
```

Frontend runs at http://localhost:5173

---

## 9. Verify Everything Works

1. Open http://localhost:5173
2. You should be redirected to the Keycloak login page
3. Log in with the `snoxx` user you created in step 3e
4. You should land on the domain selector screen

---

## Daily Start Sequence

Once set up, each session just needs:

```powershell
# 1. Start Docker containers
docker start testing-platform-db
docker start testing-platform-keycloak

# 2. Start backend (new terminal)
cd C:\Testing-Platform\Flowgate-backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload

# 3. Start frontend (new terminal)
cd C:\Testing-Platform\flowgate-ui
npm run dev
```

---

## Get a Bearer Token (for API testing)

```powershell
$body = @{
    client_id     = "flowgate-backend"
    client_secret = "<your client secret>"
    username      = "snoxx"
    password      = "<your snoxx password>"
    grant_type    = "password"
}
$token = (Invoke-RestMethod -Uri "http://localhost:8080/realms/flowgate/protocol/openid-connect/token" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded").access_token
```

Use it in API calls:
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/domains" -Headers @{ Authorization = "Bearer $token" }
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Keycloak not loading | Wait 30s after `docker start`, it's slow to boot |
| `psycopg` install fails | Ensure Python 3.14 is active; try `pip install psycopg[binary]` manually |
| Vite proxy errors with large headers | Already handled — `package.json` sets `--max-http-header-size=65536` |
| `option` dropdowns show white background | Expected browser behaviour — styled via `option { background-color: #1a1025 }` in CSS |
| Tables missing after clone | Run `python -m infrastructure.create_tables` from the backend folder |
