# Smart Coffee System - AGENTS.md

## Project Overview

**Smart Coffee System** is a full-stack web application for managing coffee orders and operations. Built with Node.js/Express backend and React frontend.

### Tech Stack
- **Backend**: Express.js (Node.js), PostgreSQL, JWT authentication, bcrypt
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Radix UI, React Hook Form
- **Database**: PostgreSQL (see DATABASE_ERD.png for schema)

## Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── app.js                 (Express app setup, routes)
│   │   ├── server.js              (Server entry point)
│   │   ├── config/                (Database & JWT config)  
│   │   ├── controllers/           (Route handlers)
│   │   ├── models/                (Database models)
│   │   ├── middleware/            (Auth & CORS middleware)
│   │   └── routes/                (API route definitions)
│   ├── package.json
│   └── .eslintrc.js
├── Frontend/
│   └── coffee-frontend/
│       ├── src/
│       │   ├── App.jsx            (Main app component)
│       │   ├── pages/             (Page components)
│       │   ├── components/        (Reusable components)
│       │   └── styles/
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
└── .github/                       (CI/CD workflows)
```

## Getting Started

### Backend Setup
```bash
cd Backend
npm install
npm run dev          # Start with nodemon (development)
npm start           # Start production
npm run lint        # Run ESLint
```

Backend runs on `http://localhost:5000` (or configured port)

### Frontend Setup
```bash
cd Frontend/coffee-frontend
npm install
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run lint        # Run ESLint
```

Frontend dev server runs on `http://localhost:5173`

## Key Features Implemented

- ✅ User authentication (register/login)
- ✅ JWT-based authorization
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ CORS configured for frontend/backend communication

## Current Changes (Uncommitted)

- `Backend/src/app.js` - Express setup updates
- `Backend/src/controllers/authController.js` - Auth logic
- `Backend/src/models/userModel.js` - User DB model
- `Frontend/coffee-frontend/src/App.jsx` - Main React component
- `Frontend/coffee-frontend/src/pages/Dashboard.jsx` - Dashboard page

Untracked files: `DATABASE_ERD.png`, `KoffLogo.png`, `koff.html`, `uiux.jpg`

## Important Notes

### Environment Variables
- Create `.env` files in Backend/ and Frontend/ with required variables
- Backend needs: DATABASE_URL, JWT_SECRET, PORT
- Frontend needs: VITE_API_URL (backend URL)

### Database
- Uses PostgreSQL - schema documented in DATABASE_ERD.png
- Connection via `pg` package in Backend
- Models located in `Backend/src/models/`

### API Authentication
- JWT tokens stored in request headers
- Middleware validates tokens before accessing protected routes
- Auth routes: `/auth/register`, `/auth/login`

### Frontend/Backend Communication
- CORS enabled for localhost:5173 (frontend dev server)
- Credentials: true for cookie-based auth if needed
- Use axios for API calls (already in dependencies)

## Code Conventions

- Backend: CommonJS modules (`require`/`module.exports`)
- Frontend: ES modules (`import`/`export`)
- Both use ESLint for code quality
- Tailwind CSS for frontend styling
- React Hook Form for form management

## Debugging Tips

- Backend: Use `npm run dev` with nodemon for automatic restart on file changes
- Frontend: Vite provides fast HMR (Hot Module Replacement)
- Check browser DevTools for frontend issues
- Check server logs for backend errors
- Verify CORS settings if frontend can't reach backend API

## Next Steps / TODOs

- [ ] Add database migrations
- [ ] Complete dashboard functionality
- [ ] Add coffee menu/products CRUD
- [ ] Add order management
- [ ] Add payment integration
- [ ] Add testing (unit/integration tests)
- [ ] Add API documentation (Swagger/OpenAPI)
