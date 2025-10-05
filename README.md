# HospitalDB Full-Stack App

A minimal full-stack app to manage HospitalDB with dropdown-driven forms and list views for tables and SQL views. Includes Dockerized MySQL, Node/Express backend, and React + Vite frontend.

## Prerequisites
- Docker and Docker Compose (recommended), or
- Node.js 20+ and npm

## Quick Start (Docker)
```bash
# In project root
docker compose up -d --build
# DB at 3306, Server at 3000
# Open client separately (below) or add a client service to compose
```

Then run the client locally in another terminal:
```bash
cd client
npm install
npm run dev
# open http://localhost:5173
```

The API is available at `http://localhost:3000/api`.

## Local Dev without Docker
Start MySQL yourself and import `db/init.sql`, then:
```bash
# server
cd server
cp .env.example .env
npm install
npm run dev

# client
cd ../client
npm install
npm run dev
```

## Notes
- Views exposed: `vw_Doctors`, `vw_Appointments`, `vw_Admissions`, `vw_Bills`
- Forms use dropdowns for related entities (departments, doctors, patients, rooms) and filter rooms by availability on admissions.
- For production, add client to Docker Compose or deploy separately.
