window.addEventListener("DOMContentLoaded", () => {

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

    if (callNextBtn) {
        callNextBtn.addEventListener("click", () => {
            let ticketData = getTickets();
            let current = ticketData.find(ticket => ticket.status === "serving");

            if (current) {
                current.status = "served";
            }

            let nextTicket = ticketData.find(ticket => ticket.status === "waiting");

            if (nextTicket) {
                nextTicket.status = "serving";
            }

            saveTicket(ticketData);
            updateDashboardUI();
        });
    }

    function updateDashboardUI() {
        let ticketData = getTickets();

        let servingTicket = ticketData.find(ticket => ticket.status === "serving");
        let waitingTicket = ticketData.filter(ticket => ticket.status === "waiting");
        let servedTicket = ticketData.filter(ticket => ticket.status === "served");

        if (servingTicket) {
            currServingCard.textContent = servingTicket.id;
            currServingName.textContent = servingTicket.serviceName;
        } else {
            currServingCard.textContent = "None";
            currServingName.textContent = "No Active Service";
        }

        waitingCard.textContent = waitingTicket.length;
        queueCount.textContent = `${waitingTicket.length} Waiting`;
        servedCard.textContent = servedTicket.length;

        queueList.innerHTML = "";

        if (waitingTicket.length === 0) {
            queueList.innerHTML = `<li class="empty-queue">No students waiting in line</li>`;
        } else {
            waitingTicket.forEach((ticket) => {
                let queueListItem = document.createElement("li");
                queueListItem.className = "queue-item";

                queueListItem.innerHTML = `
                    <div class="ticket-info">
                        <span class="ticket-id">${ticket.id}</span>
                        <span class="service-name">${ticket.serviceName}</span>
                    </div>
                `;

                queueList.appendChild(queueListItem);
            });
        }
    }

    window.addEventListener("storage", (e) => {
        if (e.key === "queueTicket") {
            updateDashboardUI();
        }
    });

    updateDashboardUI();
});