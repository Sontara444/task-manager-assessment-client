# 💻 Pro Task Manager - Frontend

The frontend of the Task Management Application, built with **Vite** and **React**. It features a premium glassmorphism UI and secure, encrypted communication with the backend.

---

## 🚀 Key Features
- **AES-256 Decryption**: Automatically decrypts sensitive task data for display while keeping it secure during transit.
- **Session Persistence**: Custom persistent login logic that restores user state on page refresh.
- **Global Search & Filter**: Real-time search combined with complex status and priority filtering.
- **Server-Side Pagination**: Efficient chevrons for navigating large task lists (8 items per page).
- **Protected Routes**: Dedicated `ProtectedRoute` wrapper for secure page access.

## 🏗️ Architecture
- **Framework**: Vite + React
- **Context API**: Centralized `AuthContext` for global session management.
- **Service Layer**: Decoupled `api.js` service with `credentials: 'include'` support.
- **Styling**: Modern Vanilla CSS with glassmorphism effects.

## 🛠️ Setup Instructions
1. Navigate to directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_ENCRYPTION_KEY=12345678901234567890123456789012
   ```
4. Start development server: `npm run dev`

---
# 💻 Pro Task Manager – Frontend

Frontend for the Task Management Application built with **React + Vite**.
Provides a modern UI with secure communication with the backend API.

---

## 🚀 Features

* Protected routes for authenticated pages
* Global search with multi-filter (Status & Priority)
* Dynamic Activity Hub (Task Statistics)
* Overdue task highlighting & tactile micro-animations
* User profile & password management
* Refresh-resilient persistent login sessions
* Premium Glassmorphism UI

---

## 🏗 Architecture

* **Framework:** React + Vite
* **State Management:** Context API (`AuthContext`)
* **Service Layer:** Centralized `api.js` for API requests
* **Routing:** React Router with `ProtectedRoute`
* **Styling:** Vanilla CSS

---

## ⚙ Setup

```bash
cd client
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run development server

```bash
npm run dev
```

---

## 🌐 API Connection

The frontend communicates with the backend API for authentication and task management.

Backend API:

```
https://task-manager-assessment-server.onrender.com
```

## 📝 Credentials for Testing
- **Email**: test@example.com
- **Password**: password123
