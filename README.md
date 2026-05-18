# AI-Driven Employee Management System 🚀

> **🌐 Live Demo:**
> - **Frontend:** https://employee-management-frontend-a2f1.onrender.com
> - **Backend API:** https://employee-management-backend-f25c.onrender.com

A full-stack MERN application with JWT authentication, CRUD operations, and AI-powered HR recommendations via OpenRouter.

---

## Tech Stack
- **Frontend**: React, Framer Motion, react-markdown
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **AI**: OpenRouter (Meta Llama 4 Scout / DeepSeek)
- **Auth**: JWT + bcryptjs

---

## Local Development

### 1. Clone the repo
```bash
git clone https://github.com/deepanshu0619/AI-Employee-Management-System.git
cd AI-Employee-Management-System
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env        # Fill in your real values
npm install
npm run dev                 # Runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start                   # Runs on http://localhost:3000
```

---

## Deploying to Render

### Backend (Web Service)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas URI |
| `JWT_SECRET` | Your JWT secret |
| `OPENROUTER_API_KEY` | Your OpenRouter key |
| `FRONTEND_URL` | `https://employee-management-frontend-a2f1.onrender.com` |

### Frontend (Static Site)
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

**Environment Variables:**
| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://employee-management-backend-f25c.onrender.com/api` |

**Rewrite Rule:** Source `/*` → Destination `/index.html` → Action `Rewrite`

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |
| GET | `/api/employees` | Get all employees | 🔒 JWT |
| POST | `/api/employees` | Add a new employee | 🔒 JWT |
| PUT | `/api/employees/:id` | Update employee | 🔒 JWT |
| DELETE | `/api/employees/:id` | Delete employee | 🔒 JWT |
| GET | `/api/employees/search` | Search & filter | 🔒 JWT |
| POST | `/api/ai/recommend` | Get AI recommendations | 🔒 JWT |
