# HospitalDB Full-Stack App

Services:
- MySQL 8 (with schema, seed, procedures, triggers, views)
- Node.js/Express API
- React + Vite frontend (Nginx for prod)

## Run with Docker

```bash
docker compose up --build
```

- DB: localhost:3306 (root/password)
- API: http://localhost:4000/health
- Web: http://localhost:5173

## Local dev (optional)

- Start DB with Docker compose
- API: `cd backend && npm install && npm start`
- Web: `cd frontend && npm install && npm run dev` (proxies /api to 4000)
