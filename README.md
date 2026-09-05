# Student Queue Management System (Academic Project)

A dynamic web-based Queue Management System engineered to streamline student service workflows and mitigate wait times within campus administration facilities. The application enables students to request virtual service tickets and track queue progress in real-time, while providing administrative staff with dedicated controls to manage queue flow.

---

## Key Features

* **Multi-Role Authentication:** Role-based access control supporting separate workflows for Students and Staff members.
* **Service Queue Allocation:** Dynamic ticket generation based on departmental service prefixes (e.g., Advising, Finance, IT Support).
* **Real-time Queue Tracking:** Live updates reflecting current serving status, active queue length, and estimated waiting times.
* **Session & State Persistence:** Automatic session restoration for active tickets upon page reload using local storage handlers.
* **Staff Service Dashboard:** Comprehensive control panel for staff members to call next tickets, complete requests, and monitor waitlist statistics.
* **Cross-Tab Synchronization:** Synchronized data state across multiple browser tabs utilizing storage event listeners.

---

## Technical Architecture & Tech Stack

The system is built as a lightweight, single-page application (SPA) style modular client-side architecture without external framework dependencies:

* **Frontend Layout & Styling:** HTML5, CSS3 (Flexbox & Responsive Grid Design).
* **Application Logic:** JavaScript (ES6+ native asynchronous patterns & DOM manipulation).
* **Data Persistence:** Client-side Web Storage APIs (`localStorage` for entities and ticket persistence, `sessionStorage` for active session state).

---

## Directory Structure

```text
├── index.html / login.html   # User login interface
├── register.html             # Multi-role account registration interface
├── student-queue.html        # Student dashboard and live tracking view
├── staff-dashboard.html      # Administrative staff management view
├── css/
│   └── styles.css            # System design system and responsive layout styling
└── js/
    ├── auth-utils.js         # Authentication helpers & session storage abstraction
    ├── queue-data.js         # Queue state management, ticket storage & counter state
    ├── login.js              # Login submission handlers & role-based routing
    ├── register.js           # User registration logic & form validation
    ├── student.js            # Live student queue workflow & auto-restore handlers
    └── staff.js              # Staff queue management & UI state controller


[ User / Student ]                   [ Queue System ]                   [ Staff Dashboard ]
        │                                   │                                    │
        ├─── 1. Authenticate / Login ──────►│                                    │
        ├─── 2. Request Service Ticket ────►│                                    │
        │                                   ├─── 3. Allocate Ticket ID ─────────►│
        │                                   │    & Update Department Queue       │
        │                                   │                                    ├── 4. Call Next Ticket
        │◄── 5. Live Queue Status Update ───┼◄───────────────────────────────────┤
        │    (Serving / Active Waiting)     │                                    │
        │                                   │                                    ├── 6. Mark Complete / Skip
        │◄── 7. Ticket Finalization ────────┼◄───────────────────────────────────┤
