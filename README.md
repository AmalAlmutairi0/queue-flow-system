# 🚀 QueueFlow – Virtual Queue Management System

A dynamic, full-stack web application designed to streamline student customer flow and eliminate physical waiting lines. **QueueFlow** provides real-time ticket tracking for students and an intuitive service queue control dashboard for staff members.

> 🛠️ **Project Status:** In Active Development (Present)

---

## 🌟 Key Features

### 🎓 Student Portal
* **Service Selection:** Choose from multiple department queues (Academic Advising, Financial Aid, IT Support, Records & Transcripts).
* **Instant Ticket Generation:** Generates prefixed sequential tickets (e.g., `A-012`, `F-005`) with estimated wait times.
* **Real-time Queue Tracking:** Dynamic state management displaying live status updates, current serving numbers, and people ahead in line.
* **Session Persistence:** Integrated local state management (`localStorage`) and backend APIs ensuring ticket state continuity across page refreshes.
* **Interactive Turn Notifications:** Modal notifications alerting students immediately when their turn arrives.
* **Self-Service Cancellation:** Ability to safely cancel or exit a queue spot with confirmation dialogs.

### 💼 Staff & Admin Portal
* **Queue Control Center:** Manage active queues per service line.
* **Status Lifecycle Management:** Update ticket states through `Waiting` ➔ `Serving` ➔ `Completed` / `Cancelled`.
* **Live Counter Synchronization:** Prevent ticket collisions and handle real-time ticket generation logic server-side.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom CSS Variables, Flexbox, CSS Grid), Vanilla JavaScript (ES6+), FontAwesome Icons.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB.
* **State & Persistence:** LocalStorage API, RESTful APIs, Fetch API.

---

## 📂 Project Architecture

```text
├── css/
│   ├── global.css          # Global variables, typography, and base layout
│   ├── landing.css         # Styling for the main landing page
│   ├── login.css           # Authentication page styling
│   ├── register.css        # Student registration page styling
│   ├── staff.css           # Staff dashboard controls & layout styles
│   └── student.css         # Student portal and queue modal styling
│
├── js/
│   ├── auth-utils.js       # Session handling and auth helper functions
│   ├── login.js            # Login form submission and validation logic
│   ├── queue-data.js       # Backend API calls and data fetching handlers
│   ├── register.js         # Student registration form handlers
│   ├── staff.js            # Staff queue management and status actions
│   └── student.js          # Student ticket state, polling, and UI handlers
│
├── server/
│   ├── models/             # Database schemas (e.g., User, Ticket models)
│   ├── node_modules/       # Node.js server dependencies
│   └── server.js           # Main Express server entry point
│
├── index.html              # System landing page
├── login.html              # User login page
├── register.html           # Account registration page
├── staff-dashboard.html    # Staff management dashboard
└── student-queue.html      # Student queue interactive portal

🚀 Getting Started
1. Clone the repository:
git clone [https://github.com/AmalAlmutairi0/queue-flow-system.git](https://github.com/AmalAlmutairi0/queue-flow-system.git)

2. Open the project:
Simply launch student-queue.html or index.html in your browser (or use a Live Server extension in VS Code).

3. Backend Setup:
Ensure your API server inside the server/ folder is running to support getTickets(), addTicketToBackend(), and counter synchronization endpoints.
