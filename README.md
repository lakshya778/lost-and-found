Readme · MD
Lost & Found
A full-stack web app where people on a campus/community can post items they've lost or found, claim items, and get notified when something happens to their post. Built as a MERN (MongoDB, Express, React, Node) project.

Live demo: https://lost-and-found-eight-pearl.vercel.app

Note: the backend is hosted on Render's free tier, which "sleeps" after periods of inactivity. The very first request after a while may take 30–50 seconds to respond while it wakes up — this is a free-hosting limitation, not a bug.

Table of Contents
What it does
Tech Stack
Why these choices
Project Structure
Features
Setup / Running Locally
Environment Variables
API Overview
Deployment
Known Limitations
What it does
Lost & Found lets users:

Sign up / log in
Post an item as Lost or Found, with a title, description, category, location, date, and an optional photo
Browse and filter/search all posted items
Claim an item someone else posted
Have an admin mark items as Resolved, view stats, and manage all items/users
Get in-app notifications (via a bell icon) when their item is claimed or resolved
Tech Stack
Frontend

React (with Vite)
Tailwind CSS v4
React Router
Axios
Backend

Node.js + Express
MongoDB (via Mongoose), hosted on MongoDB Atlas
JWT for authentication
bcryptjs for password hashing
Multer + Cloudinary for image uploads
Hosting

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
Why these choices
This section is here on purpose — the point isn't just to list technologies, but to explain the reasoning, including things that were tried and changed along the way.

Vite instead of Create React App
Vite was used for the frontend build tool because it gives near-instant dev-server startup and hot reload, which matters a lot when iterating quickly on UI. Create React App is heavier and its tooling is effectively unmaintained at this point, so it wasn't a serious option for a new project.

Tailwind CSS instead of plain CSS / a component library
Tailwind was chosen because it lets styling happen directly in the JSX without constantly switching files or inventing class names, which is faster for a solo developer building many small components (cards, forms, tables). A full component library (like MUI or Bootstrap) was avoided because it tends to look generic and fights you when you want a specific, custom look — Tailwind gives more control with less overhead.

(Side note: this project actually hit a real-world Tailwind v4 migration issue — v4 moved its PostCSS plugin into a separate @tailwindcss/postcss package, which broke the first deployment until it was corrected. That's a good example of the kind of dependency/version issue you run into in real projects, not just tutorials.)

MongoDB instead of a # Lost & Found

A full-stack web app where people on a campus/community can post items they've **lost** or **found**, claim items, and get notified when something happens to their post. Built as a MERN (MongoDB, Express, React, Node) project.

**Live demo:** https://lost-and-found-eight-pearl.vercel.app

> Note: the backend is hosted on Render's free tier, which "sleeps" after periods of inactivity. The very first request after a while may take 30–50 seconds to respond while it wakes up — this is a free-hosting limitation, not a bug.

---

## Table of Contents

- [What it does](#what-it-does)
- [Tech Stack](#tech-stack)
- [Why these choices](#why-these-choices)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup / Running Locally](#setup--running-locally)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## What it does

Lost & Found lets users:
- Sign up / log in
- Post an item as **Lost** or **Found**, with a title, description, category, location, date, and an optional photo
- Browse and filter/search all posted items
- **Claim** an item someone else posted
- Have an **admin** mark items as **Resolved**, view stats, and manage all items/users
- Get **in-app notifications** (via a bell icon) when their item is claimed or resolved

---

## Tech Stack

**Frontend**
- React (with Vite)
- Tailwind CSS v4
- React Router
- Axios

**Backend**
- Node.js + Express
- MongoDB (via Mongoose), hosted on MongoDB Atlas
- JWT for authentication
- bcryptjs for password hashing
- Multer + Cloudinary for image uploads

**Hosting**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Why these choices

This section is here on purpose — the point isn't just to list technologies, but to explain the reasoning, including things that were tried and changed along the way.

### Vite instead of Create React App
Vite was used for the frontend build tool because it gives near-instant dev-server startup and hot reload, which matters a lot when iterating quickly on UI. Create React App is heavier and its tooling is effectively unmaintained at this point, so it wasn't a serious option for a new project.

### Tailwind CSS instead of plain CSS / a component library
Tailwind was chosen because it lets styling happen directly in the JSX without constantly switching files or inventing class names, which is faster for a solo developer building many small components (cards, forms, tables). A full component library (like MUI or Bootstrap) was avoided because it tends to look generic and fights you when you want a specific, custom look — Tailwind gives more control with less overhead.

*(Side note: this project actually hit a real-world Tailwind v4 migration issue — v4 moved its PostCSS plugin into a separate `@tailwindcss/postcss` package, which broke the first deployment until it was corrected. That's a good example of the kind of dependency/version issue you run into in real projects, not just tutorials.)*

### MongoDB instead of a SQL database (PostgreSQL/MySQL)
The data here (items, users, notifications) is naturally document-shaped and doesn't have complex relational joins — an item just references a user, a notification references a user and an item. MongoDB's flexible schema also made it faster to iterate on the data model while features were still being figured out (e.g., adding a `claimedBy` field to items later without a formal migration). A relational database would have added structure that wasn't needed for this scale of app.

### JWT authentication instead of session-based auth
JWT was used because it's stateless — the server doesn't need to store session data, which keeps the backend simpler and works cleanly with a separately-hosted frontend (Vercel) and backend (Render), since there's no shared server memory or sticky sessions to worry about. Session-based auth (with cookies + server-side session store) would have added complexity — a session store (like Redis) — for no real benefit at this scale.

### Cloudinary instead of storing images on the server / in MongoDB
Images (item photos) are uploaded to Cloudinary instead of being saved directly on the backend server or as binary data in MongoDB. Storing files on the server is risky with most free/cheap hosting because the filesystem isn't persistent (a redeploy can wipe it), and storing images as binary data in MongoDB bloats the database and slows down queries. Cloudinary handles storage, resizing, and CDN delivery for free at this scale, so the backend only ever stores a URL string.

### Render instead of Back4app for backend hosting
The backend was originally deployed on Back4app's free tier, but that tier issues a **temporary URL that expires every 60 minutes**, requiring a manual redeploy to get a new one — completely impractical for something like a resume project that a recruiter might open at any time. The backend was migrated to Render's free tier instead, which gives a **permanent URL** that never changes. The trade-off is that Render's free tier "spins down" after inactivity, so the first request after a while is slow — but that's a one-time delay, not a broken link, which is the more important property for something people will click on unpredictably.

### Vercel for the frontend
Vercel was used because it's built specifically for frontend frameworks like Vite/React, deploys automatically on every GitHub push, and its free tier doesn't have the same "expiring URL" problem the backend hit on Back4app.

### Why not a monorepo tool / Next.js
The frontend and backend were kept as two plain folders (`frontend/`, `backend/`) in one repo rather than using a monorepo tool (like Turborepo) or a full-stack framework like Next.js. For a project this size, a monorepo tool would add configuration overhead with no real benefit, and Next.js would blur the line between "frontend" and "backend" in a way that makes it harder to demonstrate a clear separation of concerns — the goal here was to show a classic REST API + separate client, since that's the more universally expected pattern.

---

## Project Structure

```
lost-and-found/
├── backend/
│   ├── config/          # Cloudinary config
│   ├── controllers/      # Route logic (auth, items, admin, notifications)
│   ├── middleware/       # JWT auth middleware, admin check, multer upload
│   ├── models/           # Mongoose schemas: User, Item, Notification
│   ├── routes/            # Express route definitions
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # Navbar, etc.
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Login, Signup, Home, PostItem, ItemDetail, AdminPanel
│   │   └── App.jsx
│   └── vercel.json        # SPA routing config
└── README.md
```

---

## Features

- **Authentication** — signup/login with hashed passwords and JWT-based sessions
- **Item posting** — lost/found items with category, location, date, and optional photo (uploaded to Cloudinary)
- **Browse & filter** — search by title, filter by category/type/location
- **Claim flow** — a user can claim someone else's posted item
- **Admin panel** — view stats (total/open/claimed/resolved items, total users), see all items with delete access, and view all registered users
- **Notifications** — when an item is claimed or resolved, the relevant user(s) get an in-app notification, shown via a bell icon with an unread-count badge and a dropdown list

---

## Setup / Running Locally

**Backend**
```bash
cd backend
npm install
npm start          # or: node server.js
```

**Frontend** (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend running at the URL set in `VITE_API_URL` (see below).

---

## Environment Variables

**Backend `.env`**
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:5000/api
```
(For production, this points to the deployed backend URL instead.)

---

## API Overview

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | — |
| POST | `/api/auth/login` | Log in, returns JWT | — |
| GET | `/api/items` | List items (supports filters) | — |
| POST | `/api/items` | Create an item (with image) | ✅ |
| GET | `/api/items/:id` | Get a single item | — |
| PUT | `/api/items/:id/status` | Claim / resolve an item | ✅ |
| DELETE | `/api/items/:id` | Delete an item | ✅ (owner/admin) |
| GET | `/api/admin/stats` | Dashboard stats | ✅ admin |
| GET | `/api/admin/users` | List all users | ✅ admin |
| GET | `/api/notifications` | Get my notifications | ✅ |
| PUT | `/api/notifications/mark-all-read` | Mark all as read | ✅ |

---

## Deployment

- **Frontend** deploys automatically to Vercel on every push to `main`
- **Backend** deploys automatically to Render on every push to `main`
- **Database**: MongoDB Atlas (cloud-hosted, IP access currently open for simplicity — see limitations below)

---

## Known Limitations

- The backend (Render free tier) sleeps after inactivity, so the first request after a while is slow (~30-50s)
- MongoDB Atlas network access is currently set to allow all IPs (`0.0.0.0/0`), since Render doesn't provide a fixed IP on the free tier. This is acceptable for a demo project but would be tightened in a production setting
- No automated tests yet — this was prioritized as a learning/portfolio project focused on getting a full working stack deployed end-to-endSQL database (PostgreSQL/MySQL)
The data here (items, users, notifications) is naturally document-shaped and doesn't have complex relational joins — an item just references a user, a notification references a user and an item. MongoDB's flexible schema also made it faster to iterate on the data model while features were still being figured out (e.g., adding a claimedBy field to items later without a formal migration). A relational database would have added structure that wasn't needed for this scale of app.

JWT authentication instead of session-based auth
JWT was used because it's stateless — the server doesn't need to store session data, which keeps the backend simpler and works cleanly with a separately-hosted frontend (Vercel) and backend (Render), since there's no shared server memory or sticky sessions to worry about. Session-based auth (with cookies + server-side session store) would have added complexity — a session store (like Redis) — for no real benefit at this scale.

Cloudinary instead of storing images on the server / in MongoDB
Images (item photos) are uploaded to Cloudinary instead of being saved directly on the backend server or as binary data in MongoDB. Storing files on the server is risky with most free/cheap hosting because the filesystem isn't persistent (a redeploy can wipe it), and storing images as binary data in MongoDB bloats the database and slows down queries. Cloudinary handles storage, resizing, and CDN delivery for free at this scale, so the backend only ever stores a URL string.

Render instead of Back4app for backend hosting
The backend was originally deployed on Back4app's free tier, but that tier issues a temporary URL that expires every 60 minutes, requiring a manual redeploy to get a new one — completely impractical for something like a resume project that a recruiter might open at any time. The backend was migrated to Render's free tier instead, which gives a permanent URL that never changes. The trade-off is that Render's free tier "spins down" after inactivity, so the first request after a while is slow — but that's a one-time delay, not a broken link, which is the more important property for something people will click on unpredictably.

Vercel for the frontend
Vercel was used because it's built specifically for frontend frameworks like Vite/React, deploys automatically on every GitHub push, and its free tier doesn't have the same "expiring URL" problem the backend hit on Back4app.

Why not a monorepo tool / Next.js
The frontend and backend were kept as two plain folders (frontend/, backend/) in one repo rather than using a monorepo tool (like Turborepo) or a full-stack framework like Next.js. For a project this size, a monorepo tool would add configuration overhead with no real benefit, and Next.js would blur the line between "frontend" and "backend" in a way that makes it harder to demonstrate a clear separation of concerns — the goal here was to show a classic REST API + separate client, since that's the more universally expected pattern.

Project Structure
lost-and-found/
├── backend/
│   ├── config/          # Cloudinary config
│   ├── controllers/      # Route logic (auth, items, admin, notifications)
│   ├── middleware/       # JWT auth middleware, admin check, multer upload
│   ├── models/           # Mongoose schemas: User, Item, Notification
│   ├── routes/            # Express route definitions
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # Navbar, etc.
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Login, Signup, Home, PostItem, ItemDetail, AdminPanel
│   │   └── App.jsx
│   └── vercel.json        # SPA routing config
└── README.md
Features
Authentication — signup/login with hashed passwords and JWT-based sessions
Item posting — lost/found items with category, location, date, and optional photo (uploaded to Cloudinary)
Browse & filter — search by title, filter by category/type/location
Claim flow — a user can claim someone else's posted item
Admin panel — view stats (total/open/claimed/resolved items, total users), see all items with delete access, and view all registered users
Notifications — when an item is claimed or resolved, the relevant user(s) get an in-app notification, shown via a bell icon with an unread-count badge and a dropdown list
Setup / Running Locally
Backend

bash
cd backend
npm install
npm start          # or: node server.js
Frontend (in a separate terminal)

bash
cd frontend
npm install
npm run dev
The frontend expects the backend running at the URL set in VITE_API_URL (see below).

Environment Variables
Backend .env

MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Frontend .env

VITE_API_URL=http://localhost:5000/api
(For production, this points to the deployed backend URL instead.)

API Overview
Method	Route	Description	Auth
POST	/api/auth/signup	Register a new user	—
POST	/api/auth/login	Log in, returns JWT	—
GET	/api/items	List items (supports filters)	—
POST	/api/items	Create an item (with image)	✅
GET	/api/items/:id	Get a single item	—
PUT	/api/items/:id/status	Claim / resolve an item	✅
DELETE	/api/items/:id	Delete an item	✅ (owner/admin)
GET	/api/admin/stats	Dashboard stats	✅ admin
GET	/api/admin/users	List all users	✅ admin
GET	/api/notifications	Get my notifications	✅
PUT	/api/notifications/mark-all-read	Mark all as read	✅
Deployment
Frontend deploys automatically to Vercel on every push to main
Backend deploys automatically to Render on every push to main
Database: MongoDB Atlas (cloud-hosted, IP access currently open for simplicity — see limitations below)
Known Limitations
The backend (Render free tier) sleeps after inactivity, so the first request after a while is slow (~30-50s)
MongoDB Atlas network access is currently set to allow all IPs (0.0.0.0/0), since Render doesn't provide a fixed IP on the free tier. This is acceptable for a demo project but would be tightened in a production setting
No automated tests yet — this was prioritized as a learning/portfolio project focused on getting a full working stack deployed end-to-end

