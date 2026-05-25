# Security Policy

## Supported Versions

Flowgate is currently in early development. Only the latest version on the `main` branch is supported.

| Version | Supported |
|---------|-----------|
| main    | Yes       |

---

## Reporting a Vulnerability

If you discover a security vulnerability, please do **not** open a public GitHub issue.

Instead, report it privately by emailing: **lemmerg@selectafrica.net**

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes if you have them

You can expect an acknowledgement within 48 hours.

---

## Security Notes for Self-Hosting

If you run Flowgate in any environment beyond local development:

- **Change all default credentials** — Keycloak admin password, client secrets, and database passwords must be changed from the defaults in this repo
- **Never expose Keycloak or PostgreSQL ports publicly** — both should be internal only
- **Rotate the `SECRET_KEY`** in `.env` before deploying
- **Use HTTPS** — the frontend and backend should be served over TLS in any non-local environment
- **Restrict Keycloak redirect URIs** — update allowed redirect URIs in the Keycloak client config to match your actual domain

---

## Planned Security Improvements

As Flowgate matures toward production deployments, the following security hardening is planned:

- **Kubernetes deployment** — workloads will be containerised and orchestrated via Kubernetes, enabling network policies, pod security contexts, and secret management through tools like Kubernetes Secrets or Vault
- **Ingress hardening** — TLS termination, rate limiting, and request size limits enforced at the ingress controller level
- **Content Security Policy (CSP)** — HTTP security headers to prevent XSS and script injection attacks
- **Input sanitisation** — server-side sanitisation layer to guard against injection attacks across all endpoints
- **Secrets management** — migration away from `.env` files toward a dedicated secrets store (e.g. HashiCorp Vault or Kubernetes Secrets)
- **Network segmentation** — database and auth services isolated to internal cluster networking, not reachable from outside
- **Audit logging** — structured logs for all authentication events, role changes, and scenario executions
