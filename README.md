# FitSync Backend API

A production-ready REST API for the FitSync social fitness tracking platform. Built with Express.js, MongoDB Atlas, and Socket.io.

## Live API
```
https://fitsync-backend-production-5ffb.up.railway.app/api/health
```

## Tech Stack

- **Runtime** — Node.js 18
- **Framework** — Express.js
- **Database** — MongoDB Atlas + Mongoose ODM
- **Authentication** — JWT (access + refresh token rotation)
- **Real-time** — Socket.io
- **File Uploads** — Multer + Cloudinary
- **Deployment** — Railway

## Features

- JWT authentication with httpOnly cookies and refresh token rotation
- Role-based access control — Athlete and Coach roles
- Workout CRUD with search and filters
- Coach-only workout plan management
- Follow / unfollow social system
- Real-time activity feed via Socket.io
- Profile photo and workout image uploads to Cloudinary
- Paginated API responses

## API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Workouts
```
GET    /api/workouts          — list + search + filters
POST   /api/workouts          — create workout
GET    /api/workouts/:id      — get single workout
PUT    /api/workouts/:id      — update workout
DELETE /api/workouts/:id      — delete workout
```

### Plans (Coach only for create/update/delete)
```
GET    /api/plans             — list all plans
POST   /api/plans             — create plan
GET    /api/plans/:id         — get single plan
PUT    /api/plans/:id         — update plan
DELETE /api/plans/:id         — delete plan
```

### Users
```
GET    /api/users/search      — search users
GET    /api/users/feed        — activity feed
PUT    /api/users/profile     — update profile
GET    /api/users/:id         — get profile
POST   /api/users/:id/follow  — follow user
POST   /api/users/:id/unfollow — unfollow user
```

### Upload
```
POST   /api/upload/avatar          — upload profile photo
POST   /api/upload/workout/:id     — upload workout image
```

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | Join user room |
| `leave` | Client → Server | Leave user room |
| `workout:new` | Server → Client | New workout logged |
| `follow:new` | Server → Client | New follower |
| `feed:update` | Server → Client | Feed update for followers |

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Installation
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/fitsync-backend.git
cd fitsync-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your environment variables

# Seed sample data (optional)
npm run seed

# Start development server
npm run dev
```

### Environment Variables
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fitsync
JWT_SECRET=your_long_random_secret
JWT_REFRESH_SECRET=your_other_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

## Project Structure
```
fitsync-backend/
├── config/
│   ├── db.js              — MongoDB connection
│   └── cloudinary.js      — Cloudinary + Multer setup
├── controllers/
│   ├── auth.controller.js
│   ├── workout.controller.js
│   ├── plan.controller.js
│   ├── user.controller.js
│   └── upload.controller.js
├── middleware/
│   ├── auth.js            — JWT verification
│   └── role.js            — Coach role guard
├── models/
│   ├── User.js
│   ├── Workout.js
│   ├── Plan.js
│   └── Activity.js
├── routes/
│   ├── auth.js
│   ├── workouts.js
│   ├── plans.js
│   ├── users.js
│   └── upload.js
├── socket/
│   └── events.js          — Socket.io handlers
├── seed.js                — Sample data seeder
└── server.js              — Entry point
```

## Sample Data

Run the seeder to populate 20 users, 45+ workouts and 5 plans:
```bash
npm run seed
```

Demo credentials after seeding:
```
Athlete login:  athlete@demo.com  /  demo123
Coach login:    coach@demo.com    /  demo123
```

## Deployment

Deployed on Railway with automatic deploys on every push to main.

Dasun Methmal