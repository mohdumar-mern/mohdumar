# 🌐 Mohd Umar — Full Stack Developer Portfolio

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/Portfolio-Live-brightgreen?style=for-the-badge&logo=vercel)
[![Live Demo](https://img.shields.io/badge/Live-mohdumar.online-cyan?style=for-the-badge&logo=google-chrome)](https://mohdumar.online)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/mohdumar-mern/mohdumar/deploy.yml?branch=master&style=for-the-badge&logo=github-actions&label=CI/CD)](https://github.com/mohdumar-mern/mohdumar/actions)

</div>

---

## 📌 Overview

A **production-grade full-stack portfolio** built with the MERN stack, featuring a cyberpunk/neon-noir aesthetic, complete CI/CD pipeline, automated testing, and PM2 process management.

> Live at → **[mohdumar.online](https://mohdumar.online)**

---

## ⚙️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=flat-square&logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-ioredis-DC382D?style=flat-square&logo=redis)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)

### DevOps & Tools
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=flat-square&logo=github-actions)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render)
![PM2](https://img.shields.io/badge/PM2-Process_Manager-2B037A?style=flat-square&logo=pm2)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=flat-square&logo=jest)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?style=flat-square&logo=vitest)
![ESLint](https://img.shields.io/badge/ESLint-Linting-4B32C3?style=flat-square&logo=eslint)
![Prettier](https://img.shields.io/badge/Prettier-Formatting-F7B93E?style=flat-square&logo=prettier)

---

## 🗂️ Project Structure

```
mohdumar/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── app/             # Redux Store
│   │   ├── components/      # Reusable UI Components
│   │   ├── features/        # Redux Slices
│   │   ├── pages/           # Public Pages
│   │   ├── private/         # Dashboard (Protected)
│   │   ├── routes/          # Protected Routes
│   │   └── test/            # Vitest Test Files
│   ├── .prettierrc
│   └── vite.config.js
│
├── server/                  # Express Backend
│   ├── config/              # DB & Redis Config
│   ├── controllers/         # Route Controllers
│   ├── middlewares/         # Auth, Error, Rate Limit
│   ├── models/              # Mongoose Models
│   ├── routes/              # API Routes
│   ├── tests/               # Jest Test Files
│   ├── utils/               # Helpers (Swagger, Limiter)
│   ├── ecosystem.config.cjs # PM2 Config
│   └── server.js
│
└── .github/
    └── workflows/
        └── deploy.yml       # CI/CD Pipeline
```

---

## 🚀 Features

- **Full CRUD** — Projects, Skills, Services, Profile, Contacts
- **JWT Auth** — Secure admin dashboard with protected routes
- **Rate Limiting** — API protection with express-rate-limit
- **Redis Caching** — Fast response times
- **Swagger Docs** — API documentation at `/api/docs`
- **PWA Ready** — Installable on mobile
- **SEO Optimized** — React Helmet Async
- **Cyberpunk UI** — Neon noir aesthetic with Three.js & Framer Motion

---

## 🔄 CI/CD Pipeline

```
git push master
        ↓
┌─────────────────────────────┐
│         test job            │
│  ✅ Client Format Check     │
│  ✅ Client Lint (ESLint)    │
│  ✅ Client Tests (Vitest)   │
│  ✅ Server Format Check     │
│  ✅ Server Tests (Jest)     │
└──────────────┬──────────────┘
               ↓
    ┌──────────┴──────────┐
    ↓                     ↓
deploy-client         deploy-server
✅ Vercel Deploy      ✅ Render Deploy
```

---

## 🧪 Testing

### Server (Jest + Supertest) — 15 Tests
```
✅ API Health Tests      (6)
✅ Auth Tests            (3)
✅ Protected Route Tests (2)
✅ Validation Tests      (4)
```

### Client (Vitest) — 11 Tests
```
✅ App Render Tests      (1)
✅ Input Component Tests (3)
✅ Redux Store Tests     (7)
```

---

## 📦 Bundle Optimization

| | Before | After |
|--|--|--|
| JS Bundle | 456 kB | 35 kB ✅ |
| Avatar Image | 178 kB | 15 kB ✅ |
| node_modules | 64 MB | 36 MB ✅ |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 24+
- MongoDB Atlas URI
- Redis (local or cloud)

### Clone & Install

```bash
git clone https://github.com/mohdumar-mern/mohdumar.git
cd mohdumar

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Variables

Create `server/.env`:
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:5173
EMAIL_PASS=your_pass
EMAIL_USER=your_email
```

### Run Locally

```bash
# Start backend
cd server
npm run dev

# Start frontend (new terminal)
cd client
npm run dev
```

### Run Tests

```bash
# Server tests
cd server && npm test

# Client tests
cd client && npm test
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | Get all projects | Public |
| GET | `/api/skills` | Get all skills | Public |
| GET | `/api/services` | Get all services | Public |
| GET | `/api/profile` | Get profile | Public |
| POST | `/api/auth/login` | Admin login | Public |
| POST | `/api/projects` | Add project | 🔒 Protected |
| PUT | `/api/projects/:id` | Update project | 🔒 Protected |
| DELETE | `/api/projects/:id` | Delete project | 🔒 Protected |

Full API docs available at `/api/docs` (Swagger UI)

---

## 👨‍💻 Author

**Mohd Umar**
- 🌐 Portfolio: [mohdumar.online](https://mohdumar.online)
- 💼 LinkedIn: [mohd-umar-mern-stack-developer](https://www.linkedin.com/in/mohd-umar-mern-stack-developer/)
- 🐙 GitHub: [mohdumar-mern](https://github.com/mohdumar-mern)
- 📧 Email: uk1941404@gmail.com

---

<div align="center">
  <sub>Built with ❤️ by Mohd Umar</sub>
</div>
