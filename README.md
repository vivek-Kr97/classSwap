# 🎓 ClassSwap — University Slot Swapping Platform

This project consists of two main parts:
1. **Backend** (`/backend`): Express.js REST API + Mongoose (MongoDB) + TypeScript.
2. **Frontend** (`/classswap`): React Web Application + Vite + Tailwind CSS.

---

## 🚀 Quick Start Guide

### 1. Backend (`/backend`)

Open a terminal and run the following commands:

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
yarn install   # or npm install

# 3. Seed the database with demo data
yarn seed      # or npm run seed

# 4. Start the backend development server
yarn dev       # or npm run dev
```

> **Note:** The backend server will run on `http://localhost:5000`. Ensure your local MongoDB instance is running (or configured in `backend/.env`).

---

### 2. Frontend (`/classswap`)

Open a **second terminal** and run the following commands:

```bash
# 1. Navigate to the frontend directory
cd classswap

# 2. Install dependencies
bun install    # or yarn install / npm install

# 3. Start the frontend development server
bun dev        # or yarn dev / npm run dev
```

> **Note:** The frontend application will run on `http://localhost:8080`.

---

## 🔑 Pre-configured Test Accounts (Seed Data)

After running `yarn seed`, you can sign in using any of the following demo credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@paruluniversity.ac.in` | `Admin@123` |
| **Faculty Member** | `mehta@paruluniversity.ac.in` | `Faculty@123` |
| **Student (Batch A)** | `ravi.kumar@paruluniversity.ac.in` | `Student@123` |
| **Student (Batch B)** | `priya.sharma@paruluniversity.ac.in` | `Student@123` |

---

## 🛠️ Project Structure

```text
.
├── backend/            # Express API, Mongoose Models, Controllers & Routes
└── classswap/          # React Web Frontend (UI, TanStack Router & API Services)
```
