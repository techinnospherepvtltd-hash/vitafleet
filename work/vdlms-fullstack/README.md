# Vehicle Digital Passport / VDLMS

Full-stack starter application for a Vehicle Digital Life Cycle Management System.

## What Is Included

- Frontend dashboard in plain HTML, CSS, and JavaScript
- Backend REST API in Node.js
- Local JSON database for quick demo and development
- PostgreSQL schema for production database planning
- Seed data covering vehicles, documents, repairs, approvals, insurance, and sold vehicles
- Asset ownership classification: own asset, third-party vendor asset, and government asset

## Run Locally

```bash
npm start
```

Open:

```text
http://127.0.0.1:5000
```

## API Endpoints

- `GET /api/dashboard`
- `GET /api/vehicles`
- `POST /api/vehicles`
- `GET /api/documents`
- `POST /api/documents`
- `GET /api/repairs`
- `POST /api/repairs`
- `GET /api/approvals`
- `GET /api/insurance`
- `GET /api/sold-vehicles`
- `GET /api/alerts`
- `GET /api/timeline/:vehicleId`

## Production Direction

For production, replace the local JSON storage with PostgreSQL using `database/schema.sql`.

Recommended stack evolution:

- Backend: Node.js/NestJS or Express
- Database: PostgreSQL
- ORM: Prisma
- Storage: S3-compatible document storage
- Background jobs: Redis/BullMQ
- Authentication: role-based login, SSO-ready
