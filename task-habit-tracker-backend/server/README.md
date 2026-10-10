# Task & Habit Tracker — Backend

Node.js + Express + MongoDB (Mongoose) REST API for the Task & Habit Tracker app.

## Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env with your MongoDB Atlas URI and a strong JWT_SECRET
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Folder Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # register/login/logout/me/forgot/reset
│   ├── taskController.js     # task CRUD + search/filter/sort/paginate
│   └── habitController.js    # habit CRUD + check-in + history
├── middleware/
│   ├── authMiddleware.js     # JWT protect()
│   ├── errorMiddleware.js    # notFound + centralized errorHandler
│   └── validateMiddleware.js # express-validator result handler
├── models/
│   ├── User.js
│   ├── Task.js
│   ├── Habit.js
│   └── HabitLog.js
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── habitRoutes.js
├── utils/
│   ├── generateToken.js      # JWT + cookie helper
│   └── streak.js             # streak calculation logic
├── .env.example
├── package.json
└── server.js
```

## API Endpoints

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | name, email, password, confirmPassword |
| POST | /api/auth/login | Public | email, password, rememberMe |
| POST | /api/auth/logout | Private | clears auth cookie |
| GET | /api/auth/me | Private | current user |
| POST | /api/auth/forgot-password | Public | placeholder, logs reset token to console |
| POST | /api/auth/reset-password/:token | Public | placeholder |

### Tasks
| Method | Route | Access | Description |
|---|---|---|---|
| GET | /api/tasks | Private | query: search, priority, completed, sortBy, order, page, limit |
| GET | /api/tasks/:id | Private | single task |
| POST | /api/tasks | Private | create task |
| PUT | /api/tasks/:id | Private | update task |
| DELETE | /api/tasks/:id | Private | delete task |

### Habits
| Method | Route | Access | Description |
|---|---|---|---|
| GET | /api/habits | Private | list habits (?archived=true/false) |
| GET | /api/habits/:id | Private | single habit |
| POST | /api/habits | Private | create habit |
| PUT | /api/habits/:id | Private | update habit |
| DELETE | /api/habits/:id | Private | delete habit + its logs |
| POST | /api/habits/:id/check | Private | toggle today's (or given date's) completion, recalculates streaks |
| GET | /api/habits/:id/history | Private | completion history for calendar heatmap |

## Notes

- JWT is set as an **httpOnly cookie** (`token`) and also returned in the JSON body so
  non-browser/mobile clients can use the `Authorization: Bearer <token>` header instead.
- `NODE_ENV=production` enables `secure` + `sameSite=none` cookies (required for cross-site
  HTTPS deployments, e.g. Vercel frontend + Render backend).
- Password reset is wired up structurally (token generation, hashing, expiry) but does not
  send real emails — plug in Nodemailer/SendGrid/SES in `forgotPassword` when ready.
- Streak calculation (`utils/streak.js`) is recomputed on every check-in and stored on the
  `Habit` document for fast dashboard reads.
