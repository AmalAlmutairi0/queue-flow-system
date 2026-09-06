window.addEventListener("DOMContentLoaded", async () => {

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const logoutBtn = document.querySelector("#logout-btn");

    const currServingCard = document.querySelector("#stat-serving");
    const waitingCard = document.querySelector("#stat-waiting");
    const servedCard = document.querySelector("#stat-served");

    const currServingName = document.querySelector("#current-service-name");
    const callNextBtn = document.querySelector("#call-next-btn");

    const queueCount = document.querySelector("#queue-count");
    const queueList = document.querySelector("#queue-list");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof clearCurrentUser === "function") {
                clearCurrentUser();
            }
            window.location.href = "login.html";
        });
    }

    async function updateDashboardUI() {
        let ticketData = typeof getTickets === "function" ? await getTickets() : [];

        let servingTicket = ticketData.find(ticket => (ticket.status || "").toLowerCase() === "serving");
        let waitingTickets = ticketData.filter(ticket => (ticket.status || "").toLowerCase() === "waiting");
        let servedTickets = ticketData.filter(ticket => 
            (ticket.status || "").toLowerCase() === "completed" || (ticket.status || "").toLowerCase() === "served"
        );

        if (servingTicket) {
            currServingCard.textContent = servingTicket.ticketNumber || servingTicket.id;
            currServingName.textContent = servingTicket.department || servingTicket.serviceName;
        } else {
            currServingCard.textContent = "None";
            currServingName.textContent = "No Active Service";
        }

        waitingCard.textContent = waitingTickets.length;
        queueCount.textContent = `${waitingTickets.length} Waiting`;
        servedCard.textContent = servedTickets.length;

        queueList.innerHTML = "";

        if (waitingTickets.length === 0) {
            queueList.innerHTML = `<li class="empty-queue">No students waiting in line</li>`;
        } else {
            waitingTickets.forEach((ticket) => {
                let queueListItem = document.createElement("li");
                queueListItem.className = "queue-item";

                let tId = ticket.ticketNumber || ticket.id;
                let tName = ticket.department || ticket.serviceName;

                queueListItem.innerHTML = `
                    <div class="ticket-info">
                        <span class="ticket-id">${tId}</span>
                        <span class="service-name">${tName}</span>
                    </div>
                `;

                queueList.appendChild(queueListItem);
            });
        }
    }

    if (callNextBtn) {
        callNextBtn.addEventListener("click", async () => {
            let ticketData = typeof getTickets === "function" ? await getTickets() : [];
            
            let currentServing = ticketData.find(ticket => (ticket.status || "").toLowerCase() === "serving");
            if (currentServing && currentServing._id) {
                await updateTicketStatusOnBackend(currentServing._id, "Completed");
            }

            let nextWaiting = ticketData.find(ticket => (ticket.status || "").toLowerCase() === "waiting");
            if (nextWaiting && nextWaiting._id) {
                await updateTicketStatusOnBackend(nextWaiting._id, "Serving");
            }

            await updateDashboardUI();
        });
    }

    await updateDashboardUI();

    setInterval(async () => {
        await updateDashboardUI();
    }, 3000);
});