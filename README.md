# Real Estate Leads — Dev Scaffold

This is a local dev scaffold for the Real Estate Lead Generation MVP.
It contains a minimal backend (Node + Express) and a minimal frontend (Next.js).
It also includes Docker Compose to run the backend and a Postgres DB locally.

## Quickstart (without Docker)
- Create a Postgres database and set DATABASE_URL in backend/.env
- Run backend:
  cd backend
  npm install
  node src/server.js
- Run frontend:
  cd frontend
  npm install
  npm run dev

## Quickstart (with Docker Compose)
- Install Docker & Docker Compose
- Copy `.env.example` to `.env` and update values
- Run:
  docker compose up --build
- Backend will be exposed on port 4000, frontend on 3000 (see docker-compose.yml)

