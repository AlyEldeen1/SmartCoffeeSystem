# KOFF (Smart Coffee System) — CLAUDE.md

## Project Overview

**KOFF** is a full-stack coffee shop management system built as a grad project. It includes a customer-facing UI, an admin panel, AI-powered recommendations, and inventory tracking. The goal is a functional, well-understood codebase — not just working code, but code the developer can explain and reason about.

### Tech Stack
- **Backend**: Node.js, Express, PostgreSQL (managed via pgAdmin), JWT authentication, bcrypt
- **Frontend**: React (Vite), shadcn/ui (Mira preset), React Hook Form, Zod, React Router
- **Database**: PostgreSQL — 12-table schema (see `DATABASE_ERD.png`)

## Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── app.js                 (Express app setup, routes)
│   │   ├── server.js              (Server entry point)
│   │   ├── config/                (Database & JWT config)
│   │   ├── controllers/           (Route handlers — orchestrate across models)
│   │   ├── models/                (DB queries only — no cross-model logic)
│   │   ├── middleware/            (Auth & CORS middleware)
│   │   └── routes/                (API route definitions)
│   ├── package.json
│   └── eslint.config.mjs
├── Frontend/
│   └── coffee-frontend/
│       ├── src/
│       │   ├── App.jsx
│       │   ├── pages/
│       │   ├── components/
│       │   └── services/
│       ├── package.json
│       └── vite.config.js
└── .github/                        (CI/CD workflows)
```

## Current State

- **Backend**: Auth (register, login, JWT, role middleware) fully working. 12-table DB schema complete, all model files done. Products endpoint complete (reference implementation for conventions). Categories endpoint complete (full CRUD: create, read all, read single, update, delete with FK-safe error handling — no soft-delete/`is_active` toggle, since the FK from `products.category_id` already protects against orphaning).
- **Outstanding**: `updateLoyaltyPoints` still needs to be added to `userModel.js` (belongs to the checkout/order flow, not blocking menu work).
- **Frontend**: Login and Register pages built with React Hook Form + Zod, wired to `/auth/login` and `/auth/register`. Dashboard and Profile pages exist. Menu, Cart, and Admin pages not yet built. A vanilla HTML/CSS/JS mockup (`koff.html`) exists as the visual reference for styling direction.
- Frontend build order: **Login → Menu → Cart → Orders → Admin**. Mobile responsiveness is deferred to a single pass near the end.

## Working Preferences (apply to all work on this project)

- Follow a modular, clean architecture: routes / controllers / services / models stay separated. Models only talk to the DB; controllers orchestrate and validate.
- Keep code simple, readable, and practical — this is a grad project, not a production system to over-engineer.
- Prefer step-by-step implementation over large code dumps. One function or one file at a time, with a chance to review before moving to the next.
- Always explain *why* something is done, not just *how*. Surface design decisions and tradeoffs rather than deciding unilaterally.
- Use RESTful API design.
- Validate inputs and handle errors properly (manual validation, try/catch with 500 fallback, 404 for missing resources).
- Use security best practices: hashed passwords, protected routes via `verifyToken` + `authorizeRoles`.
- Be concise and practical — avoid long theory unless asked.
- Break tasks into clear steps.
- When debugging, find the root cause, not guesses.
- When suggesting improvements, prioritize what matters most for grad-project scope — flag but don't force gold-plating.
- New endpoints should closely follow existing conventions (the products endpoint is the canonical reference).
- `pgAdmin` cell editing is unreliable — always use SQL queries directly in the Query Tool for data updates.
- `localStorage` for JWT is acceptable given the grad-project scope.

## Getting Started

### Backend
```bash
cd Backend
npm install
npm run dev          # nodemon, development
npm start             # production
npm run lint
```

### Frontend
```bash
cd Frontend/coffee-frontend
npm install
npm run dev
npm run build
npm run lint
```

## Environment Variables
- `Backend/.env`: `PORT`, `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, `JWT_SECRET`
- Never commit `.env` — check `.gitignore` matches actual folder casing (`Backend/`, not `backend/`).
