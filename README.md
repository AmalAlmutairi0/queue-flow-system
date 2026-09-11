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
* **Ticket Number Generation:** Sequential, prefixed ticket numbers generated per service (e.g., `A-012`, `F-005`) using a local counter, with centralized server-side counter generation planned (see Roadmap).

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
│   ├── global.css        # Global variables, typography, and base styles
│   └── student.css       # Student interface & modal component styles
├── js/
│   ├── auth-utils.js     # User session management utilities
│   ├── queue-data.js     # Data layer & API call helpers
│   └── student.js        # Student UI logic & queue polling
├── student-queue.html    # Student main portal view
└── README.md             # Project documentation


🚀 Getting Started
Clone the repository:

Bash
git clone [https://github.com/AmalAlmutairi0/queue-flow-system.git](https://github.com/AmalAlmutairi0/queue-flow-system.git)
Open the project:
Simply launch student-queue.html in your browser (or use a Live Server extension in VS Code).

Backend Setup:
Ensure your API server is running to support getTickets(), addTicketToBackend(), and counter synchronization endpoints.

📌 Roadmap
[x] Student Single Page Architecture (SPA)

[x] Local state persistence on page refresh

[x] Ticket progress visualization and real-time status polling

[ ] Centralized server-side ticket counter generation

[ ] WebSocket integration (Socket.io) for real-time live push updates

[ ] Advanced analytical dashboard for staff response time metrics
