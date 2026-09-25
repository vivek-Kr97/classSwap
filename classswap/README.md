# ClassSwap

A controlled class & lab-slot swapping platform for universities. Students request a swap,
the system runs six rule checks, a matching student accepts, faculty approves, and both
timetables update with a full audit trail.

This is a **frontend-only MVP**. All data is mock data held in React state and persisted to
`localStorage`. There is no backend, database, or authentication service.

## Features

- **Role-based demo login** — Student, Faculty and Admin role cards, one click to sign in.
- **Student timetable** — Monday–Friday grid with course, type and batch; swappable slots are
  highlighted and clickable.
- **Create Swap Request** — five-step wizard: current slot → desired slot → reason →
  Rule Checks → summary → Submit for approval.
- **Six Rule Checks** — Clash Check, Same Course, Eligibility, Capacity, Deadline, Mutual Check,
  each shown as a pass/fail status row.
- **Swap Opportunities** — open requests that pass 6/6 checks can be accepted; status moves
  OPEN → MATCHED → PENDING_APPROVAL.
- **Faculty approvals** — pending request cards with all six checks, approve or reject with an
  optional comment. Approval swaps both timetables and writes an Audit Log entry.
- **Admin workspace** — overview cards, the active swap rules, and the Audit Log as a table on
  desktop and cards on mobile.
- **Notifications, history, toasts** — feedback on every action, plus loading, empty and error
  states across the app.

## Tech stack

- React 19 + Vite
- Plain JavaScript / JSX (no TypeScript in app code)
- Tailwind CSS v4 with a semantic design-token system
- TanStack Router (file-based routing)
- lucide-react icons
- React Context API + `useReducer` for state (no Redux)

> Note: this workspace ships TanStack Router instead of React Router. Routing is still
> file-based and role-protected; the route paths are exactly those listed below.

## Project structure

```
src/
  components/
    layout/      AppLayout (protected shell), Sidebar, Header, MobileNav, navigation
    ui/          Button, Card, Badge, StatusBadge, Input, Select, Modal, EmptyState, States
    dashboard/   StatCard, ActivityList, NotificationCard, ClassCard
    timetable/   Timetable, TimetableRow
    swaps/       RuleChecks, SwapStatus, SwapSlots, SwapCard, ApprovalCard, SwapRequestForm
  context/       AuthContext, SwapContext, ToastContext
  data/          users.js, timetable.js, rules.js, swaps.js  (mock data, UI-free)
  pages/         Login, student/*, faculty/*, admin/*
  routes/        file-based route definitions
  services/      api.js, authService.js, swapService.js, timetableService.js
  utils/         ruleEngine.js, status.js, helpers.js
  styles.css     design tokens and base styles
```

## Installation

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Demo accounts

| Role    | Name        | ID     | Details                                    |
| ------- | ----------- | ------ | ------------------------------------------ |
| Student | Ravi Kumar  | STU001 | MCA, semester 3, Batch A                   |
| Student | Priya Sharma| STU002 | MCA, semester 3, Batch B                   |
| Faculty | Dr. Mehta   | FAC001 | DBMS, Networks, Java, Web Technology       |
| Admin   | Admin User  | ADM001 | Rules and audit oversight                  |

### Demo flow

1. Sign in as **Ravi Kumar**, open **My Timetable**, click Networks Lab (Mon 14:00–16:00).
2. Choose Networks Lab Batch B (Wed 10:00–12:00), reason "Family event on Mondays",
   confirm 6/6 Rule Checks, submit. Status: **OPEN**.
3. Sign out, sign in as **Priya Sharma**, open **Swap Requests** and accept it.
   Status: **MATCHED → PENDING_APPROVAL**.
4. Sign in as **Dr. Mehta**, open **Approvals**, review the checks and approve.
   Both timetables update and the status becomes **APPROVED**.
5. Sign in as **Admin User** and open the **Audit Log** to see every step recorded.

Admins and students can reset the demo data at any time from the workspace.

## Architecture

- **Contexts** — `AuthContext` holds the signed-in mock user; `SwapContext` owns timetables,
  swap requests, notifications and the audit log through a reducer; `ToastContext` renders
  feedback messages.
- **Rule engine** — `src/utils/ruleEngine.js` is a pure module with no React or UI imports.
  It exports the six individual checks plus `runAllChecks`, so the same logic can later run
  on a server unchanged.
- **Services** — `src/services/*` wrap all data access behind async functions with a small
  simulated delay. They are the only place mock data is read.
- **Persistence** — state is serialised to `localStorage`, so a refresh keeps the demo intact.

## Future backend integration

Because every read and write already goes through `src/services`, connecting a real API is a
matter of replacing the mock transport in `api.js` with `fetch`/`axios` calls to real
endpoints. Function signatures stay the same, so no page or component needs to change.
Natural next steps: real authentication, a swap-matching service, notification delivery,
and moving the rule engine server-side so checks cannot be bypassed.

## Future scope

- Automatic matching suggestions between compatible students
- Faculty-configurable swap windows and per-course limits
- Email / push notifications
- Attendance and credit-impact checks
- Exportable audit reports for administration
