# Campus Facility Maintenance Request Management System
> **Enterprise Campus Facility Maintenance Request Management Platform**  
> **Student:** Rimika Jain | **Roll No:** 25WU0101111 | **Batch:** AIMLRhinos'29  
> **Institution:** School of Technology, Woxsen University

---

## 🏛️ Executive Summary

The **Campus Facility Maintenance Request Management System** is an enterprise-grade facility management platform engineered to streamline operational workflows, eliminate manual registers, and monitor service requests across university infrastructure (academic blocks, lecture theatres, engineering labs, hostels, and dining facilities).

Built on **Next.js 14 (App Router)** and **Prisma ORM**, this system provides an industrial minimalist interface rendered in deep obsidian black (`#09090b`) with refined warm pastel status indicators (Peach `#fed7aa`, Sage `#bbf7d0`, Butter `#fef08a`, Rose `#fecdd3`, Sky `#bae6fd`).

---

## ⚙️ Architecture & Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | **Next.js 14 + React 18 + Pure CSS** | High-performance industrial UI with custom typography, responsive grid layouts, and micro-animations. |
| **Backend API** | **Next.js Route Handlers (`src/app/api/`)** | RESTful endpoints with input validation, transactional integrity, and atomic error handling. |
| **ORM & Data Layer**| **Prisma ORM 5.x** | Type-safe entity modeling, relational mapping, and atomic `$transaction` executions. |
| **Data Engine**| **SQLite (Default Dev) / MySQL 8.0 (Production)** | Out-of-the-box zero-dependency instant startup with SQLite `dev.db`, alongside MySQL support via `prisma/schema.mysql.prisma`. |
| **Icons & Design** | **Lucide React + Warm Pastel Design System** | Ergonomic, accessible, and high-density industrial control dashboard. |

---

## 🗄️ Relational Entity Model

The relational data model enforces relational integrity strictly through primary keys, composite keys, foreign key constraints (`ON DELETE RESTRICT`), unique constraints, and check guards.

### The 15 Core Entities:
1. `Building` — Campus physical infrastructure blocks (e.g., Academic Block A, Rhino Hostel 1, Central Library).
2. `Room` — Locations inside buildings categorized by room type (`CLASSROOM`, `LAB`, `OFFICE`, `WASHROOM`, `DORM`).
3. `Asset` — Tagged equipment tracked inside rooms (`AC`, `PROJECTOR`, `SMARTBOARD`, `FURNITURE`, `PLUMBING`).
4. `User` — Requestors across campus with roles (`STUDENT`, `FACULTY`, `ADMIN`, `SUPERVISOR`).
5. `Category` — Maintenance domains (`ELECTRICAL`, `PLUMBING`, `FURNITURE`, `HVAC`, `CIVIL`, `IT_EQUIPMENT`).
6. `Priority` — Service level agreement (SLA) tiers (`LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`) with target resolution hours.
7. `Technician` — Certified tradespeople with hourly billing rates, phone, and specialization.
8. `MaintenanceRequest` — Core complaint ticket with unique tracking code (`REQ-YYYYMMDD-XXXX`), status, and timestamps.
9. `Assignment` — Allocation of work order to technician with assignment timestamp and supervisor notes.
10. `WorkLog` — Atomic work logs recording repair activities, labor hours spent (0.1–24 hrs), and resolution remarks.
11. `Material` — Inventory of spare parts and consumables (filters, bulbs, valves, cables) with unit costs and current stock.
12. `MaterialUsage` — Transaction ledger recording parts consumed per maintenance request.
13. `CostSummary` — Material costs, labor costs (`hours * hourly_rate`), total expenditure, and approval status.
14. `StatusHistory` — Immutable audit trail capturing every state change, previous state, and transition timestamp.
15. `Feedback` — End-user satisfaction survey with star ratings (1–5) and service feedback comments.

---

## 🔒 Enforced Business Rules & Constraints

1. **Unique Tracking Format**: Every maintenance request automatically receives a unique identifier matching regex `^REQ-[0-9]{8}-[0-9]{4}$`.
2. **Technician Workload Ceiling**: A technician cannot be assigned a new request if they already have **3 active tickets** (`ASSIGNED` or `IN_PROGRESS`). This prevents service delays and technician overload.
3. **Strict Status Lifecycle**: State transitions are strictly controlled:
   $$\text{SUBMITTED} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED} \longrightarrow \text{CLOSED}$$
   *(Tickets may be `CANCELLED` only while in `SUBMITTED` or `ASSIGNED` status).*
4. **Atomic Work Completion & Inventory Deduction**: When a technician submits work logs and parts consumed:
   - Executed within an ACID-compliant `prisma.$transaction`.
   - Materials are validated for stock availability; inventory count is atomically decremented.
   - Labor cost is calculated (`Hours × Technician Hourly Rate`).
   - Material cost is calculated (`Quantity × Unit Cost`).
   - Request status transitions to `COMPLETED` and an immutable `StatusHistory` row is inserted.
5. **Mandatory Closure Feedback**: Completed tickets can only be finalized into `CLOSED` after recording verified ratings (1 to 5) and feedback notes.
6. **Non-Negative Value Guards**: Labor hours must satisfy $0.1 \le \text{Hours} \le 24.0$, material quantities $> 0$, and costs $\ge 0$.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or v20.x+
- **npm**

### 2. Instant Local Run
```bash
# Navigate to the source code directory
cd presentation3/source_code

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🐬 Running with MySQL (Optional Production Mode)

1. **Create the Database in MySQL**:
   ```sql
   CREATE DATABASE campus_facility_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Update `.env`**:
   Open `.env` and configure your MySQL credentials:
   ```env
   DATABASE_URL="mysql://root:YourPassword@localhost:3306/campus_facility_db"
   ```

3. **Deploy the Schema**:
   ```bash
   npx prisma db push --schema prisma/schema.mysql.prisma
   ```

4. **Seed the Database**:
   ```bash
   node prisma/seed.js
   ```

5. **Start the Next.js Server**:
   ```bash
   npm run dev
   ```

---

## 👤 Author Credits
- **Author:** Rimika Jain (Roll No: 25WU0101111)
- **Specialization:** B.Tech Artificial Intelligence & Machine Learning (AIMLRhinos'29)
- **Department:** Department of Computer Science & Engineering, School of Technology
- **Institution:** Woxsen University, Hyderabad, Telangana, India
- **Course:** Database Management Systems
