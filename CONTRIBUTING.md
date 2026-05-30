# Contributing to Flowgate

Thanks for your interest in contributing. Flowgate is currently a personal project in active development, but contributions are welcome.

---

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the backend and frontend using the instructions in the [README](README.md)
4. Create a branch for your change: `git checkout -b feature/your-feature-name`

---

## Development Setup

You'll need:
- Python 3.14+
- Node.js LTS
- Docker Desktop (for PostgreSQL and Keycloak)

See the root [README](README.md) for full setup instructions.

---

## Making Changes

- Keep changes focused — one feature or fix per pull request
- Follow the existing code style (Python: no type annotations on internal functions, FastAPI patterns; React: functional components, Tailwind utility classes)
- Backend logic belongs in `domain/` or `application/` — keep controllers thin
- Do not commit `.env` files, secrets, or credentials

---

## Submitting a Pull Request

1. Make sure the backend starts without errors (`uvicorn main:app --reload`)
2. Make sure the frontend starts without errors (`npm run dev`)
3. Write a clear PR description — what changed and why
4. Open the pull request against the `main` branch

---

## Reporting Issues

Open a GitHub issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behaviour
- Relevant logs or screenshots if applicable
