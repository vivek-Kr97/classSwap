# ClassSwap Backend API — Complete Implementation

This is the production-ready backend for **ClassSwap**, built with Node.js, Express.js, TypeScript, MongoDB, and Mongoose. It completely replaces frontend demo/mock logic with a full server-side authority model and atomic timetable transactions.

---

## 🚀 Product Principle & Workflow

ClassSwap strictly follows the principle:

**Request → Check → Match → Approve → Update → Audit**

1. **Student creates a swap request** → Backend validates university rules.
2. **Another student accepts the swap** → Backend validates mutual eligibility for both students.
3. **Faculty reviews the request** → Inspects rule checks & adds comments.
4. **Faculty approves or rejects** → On approval, a MongoDB transaction performs an atomic timetable slot exchange.
5. **Timetables are updated** → Derived dynamically from `Enrollment` records.
6. **Notifications are created** → In-app alerts notify participants.
7. **Audit Log records everything** → Every critical action is saved automatically.

---

## 🛠 Tech Stack

* **Runtime**: Node.js, Express.js, TypeScript
* **Database**: MongoDB & Mongoose
* **Auth**: JWT (Access & Refresh tokens) & bcrypt password hashing
* **Validation**: Zod schema validation middleware
* **Security**: Helmet, CORS, express-rate-limit
* **Testing**: Jest & Supertest

---

## 📂 Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── constants/
│   │   ├── roles.ts
│   │   └── swapStatus.ts
│   ├── controllers/
│   │   ├── academic.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── faculty.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── student.controller.ts
│   │   └── swap.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── models/
│   │   ├── auditLog.model.ts
│   │   ├── course.model.ts
│   │   ├── department.model.ts
│   │   ├── enrollment.model.ts
│   │   ├── notification.model.ts
│   │   ├── program.model.ts
│   │   ├── semester.model.ts
│   │   ├── slot.model.ts
│   │   ├── swapRequest.model.ts
│   │   ├── swapRule.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── academic.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── faculty.routes.ts
│   │   ├── index.ts
│   │   ├── notification.routes.ts
│   │   ├── student.routes.ts
│   │   └── swap.routes.ts
│   ├── services/
│   │   ├── academic.service.ts
│   │   ├── admin.service.ts
│   │   ├── auditLog.service.ts
│   │   ├── auth.service.ts
│   │   ├── faculty.service.ts
│   │   ├── notification.service.ts
│   │   ├── student.service.ts
│   │   ├── swap.service.ts
│   │   └── swapRuleEngine.service.ts
│   ├── validators/
│   │   ├── academic.validator.ts
│   │   ├── admin.validator.ts
│   │   ├── auth.validator.ts
│   │   ├── faculty.validator.ts
│   │   └── swap.validator.ts
│   ├── seeds/
│   │   └── seed.ts
│   ├── tests/
│   │   └── classwap.test.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔑 Key Roles & Access Control

* `STUDENT`: Timetable viewing, open swap discovery, request creation, request acceptance & cancellation.
* `FACULTY`: Course assignment viewing, pending swap review for managed courses, approval/rejection with comments.
* `ADMIN`: Full CRUD on academic hierarchy (Departments, Programs, Semesters, Courses, Slots, Enrollments, Rules), audit logs, dashboard stats, conflict checker.

---

## 💻 Commands

### Installation
```bash
npm install
```

### Seeding Demo Data
```bash
npm run seed
```

### Run Server in Development
```bash
npm run dev
```

### Build & Start Production
```bash
npm run build
npm start
```

### Run Test Suite
```bash
npm test
```

---

## 👥 Seed Accounts

* **Admin**: `admin@univ.edu` / `Password123!`
* **Faculty**: `dr.mehta@univ.edu` / `Password123!`
* **Student 1 (Ravi Kumar)**: `ravi.k@univ.edu` / `Password123!` (Batch A)
* **Student 2 (Priya Sharma)**: `priya.s@univ.edu` / `Password123!` (Batch B)

---

## 🎯 End-to-End Demo Flow (Verified via Jest Test Suite)

1. **Ravi Kumar (STU001)** logs in & fetches real timetable from MongoDB (Networks Lab Batch A - Mon 14:00-16:00).
2. **Ravi** selects desired target slot (Networks Lab Batch B - Wed 10:00-12:00) & executes `POST /api/swaps/check`.
3. Backend runs 6 automated rules (Enrollment, Same Course, Clash, Eligibility, Capacity, Deadline).
4. **Ravi** creates `OPEN` swap request (`POST /api/swaps`).
5. **Priya Sharma (STU002)** logs in & sees Ravi's request on swap board (`GET /api/swaps/open`).
6. **Priya** accepts (`POST /api/swaps/:id/accept`). Backend runs mutual checks for both students. Status becomes `PENDING_APPROVAL`.
7. **Dr. Mehta (FAC001)** logs in & views pending request (`GET /api/faculty/swaps/pending`).
8. **Dr. Mehta** approves request (`POST /api/faculty/swaps/:id/approve`).
9. Backend executes MongoDB transaction:
   - Exchanging slot enrollments for Ravi and Priya atomically.
   - Status updated to `APPROVED`.
10. **Ravi's** timetable now shows Networks Lab Batch B (Wed 10:00-12:00).
11. **Priya's** timetable now shows Networks Lab Batch A (Mon 14:00-16:00).
12. **Admin** sees complete Audit Log records for creation, matching, approval, and timetable update.
