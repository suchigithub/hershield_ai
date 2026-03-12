# 🛡️ HERSHIELD — Full‑Stack Authentication App

A secure, full‑stack authentication platform built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## Features

| Area | Details |
|------|---------|
| Registration | Name, email, phone, password |
| OTP Verification | 6‑digit code sent via mock email/SMS service |
| Login | Email + password, returns JWT tokens |
| Token Management | Access token (15 min) + refresh token (7 days) rotation |
| Logout | Single session or revoke all sessions |
| Profile | View & edit profile (auth‑protected) |
| Security | bcrypt hashing, rate limiting, input sanitization, Helmet headers, httpOnly cookies |

---

## Folder Structure

```
HERSHIELD/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, OTP, refresh, logout
│   │   └── userController.js  # Profile CRUD
│   ├── middleware/
│   │   ├── auth.js            # JWT verification middleware
│   │   ├── rateLimiter.js     # Rate limiter for auth routes
│   │   └── validate.js        # express‑validator error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── RefreshToken.js    # Refresh token store (rotation)
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   └── user.js            # User endpoints
│   ├── services/
│   │   └── otpService.js      # Mock OTP generator / sender
│   ├── utils/
│   │   └── tokenUtils.js      # JWT helpers + token rotation
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js  # React auth state
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Register.js
│   │   │   ├── VerifyOTP.js
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   └── Profile.js
│   │   ├── services/
│   │   │   ├── api.js          # Axios instance + interceptors
│   │   │   └── authService.js  # API wrappers
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a cloud URI (e.g. MongoDB Atlas)

---

## Setup

### 1. Clone & install

```bash
# Backend
cd backend
cp .env.example .env   # then edit secrets
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

#### `backend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/HERSHIELD` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | *(change me)* | Secret for signing access JWTs |
| `REFRESH_TOKEN_SECRET` | *(change me)* | Secret for signing refresh JWTs |
| `ACCESS_TOKEN_EXPIRY` | `15m` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRY` | `7d` | Refresh token lifetime |
| `OTP_EXPIRY_MINUTES` | `10` | OTP valid for N minutes |
| `CLIENT_URL` | `http://localhost:3000` | Frontend origin (CORS) |

#### `frontend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API base URL |

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # uses nodemon

# Terminal 2 — Frontend
cd frontend
npm start          # opens http://localhost:3000
```

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/register` | `{ name, email, phone?, password }` | Register + send OTP |
| POST | `/verify-otp` | `{ email, otp }` | Verify 6‑digit OTP |
| POST | `/resend-otp` | `{ email }` | Resend OTP |
| POST | `/login` | `{ email, password }` | Returns access token + sets refresh cookie |
| POST | `/refresh` | *(cookie)* | Rotate refresh token, get new access token |
| POST | `/logout` | *(cookie)* | Revoke refresh token |
| POST | `/logout-all` | *(Bearer token)* | Revoke all sessions |

### Users (`/api/users`) — *auth required*

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/me` | — | Get current user profile |
| PUT | `/me` | `{ name?, phone? }` | Update profile |
| DELETE | `/me` | — | Delete account |
| GET | `/` | — | List all users (admin only) |

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server status check |

---

## Security Highlights

- **Password hashing** — bcrypt with 12 salt rounds
- **JWT rotation** — refresh tokens are one‑time use; reuse revokes the entire token family
- **httpOnly cookies** — refresh tokens stored in secure, httpOnly, sameSite cookies
- **Rate limiting** — 15 requests / 15 min on auth routes
- **Input sanitization** — `express-mongo-sanitize` prevents NoSQL injection
- **Validation** — `express-validator` on every request body
- **Helmet** — standard security headers
- **CORS** — locked to `CLIENT_URL`

---

## Mock OTP

In development mode, OTPs are printed to the **backend console**:

```
──────────────────────────────────────
[HERSHIELD OTP] Sending OTP to user@example.com
[HERSHIELD OTP] Code: 482917
──────────────────────────────────────
```

Replace `services/otpService.js` with a real provider (SendGrid, Twilio, AWS SES) for production.

---

## Deployment Notes

1. Set `NODE_ENV=production` and use strong, random secrets.
2. Enable `secure: true` on cookies (requires HTTPS).
3. Use a managed MongoDB service (Atlas, DocumentDB).
4. Build the React app (`npm run build`) and serve via a CDN or the Express server.

---

*Built with ❤️ — HERSHIELD*
