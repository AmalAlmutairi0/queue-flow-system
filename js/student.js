document.addEventListener("DOMContentLoaded", async () => {

    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    let hasNotifiedCurrentTicket = false;

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const logoutBtn = document.querySelector("#logout-btn");

    const servicesScreen = document.querySelector("#services-screen");
    const confirmationScreen = document.querySelector("#confirmation-screen");
    const ticketScreen = document.querySelector("#ticket-screen");

    const stepItems = document.querySelectorAll(".step-item");
    const stepNodeOne = document.querySelector("#step-node-1");
    const stepNodeTwo = document.querySelector("#step-node-2");
    const stepNodeThree = document.querySelector("#step-node-3");

    const sidebarTicketStatus = document.querySelector("#mini-status");
    const sidebarTicketNum = document.querySelector("#mini-ticket-num");
    const sidebarTicketName = document.querySelector("#mini-service-name");

    const serviceCard = document.querySelectorAll(".service-card");
    const joinQueueBtn = document.querySelector("#join-btn");

    const ticketNumber = document.querySelector("#conf-ticket-num");
    const ticketName = document.querySelector("#conf-service-name");
    const statusViewBtn = document.querySelector("#view-status-btn");

    const backToServicesBtn = document.querySelector("#back-to-services-btn");
    const liveTicketNum = document.querySelector("#live-ticket-num");
    const liveCount = document.querySelector("#live-ahead-count");
    const liveWaitTime = document.querySelector("#live-wait-time");
    const liveServiceName = document.querySelector("#live-service-name");
    const liveNowServing = document.querySelector("#live-now-serving");
    const liveStatusText = document.querySelector("#live-status-text");

    const cancelBtn = document.querySelector("#cancel-ticket-btn");
    const cancelDisplay = document.querySelector("#cancel-modal");
    const keepBtn = document.querySelector("#modal-keep-btn");
    const confirmationCancelBtn = document.querySelector("#modal-confirm-cancel-btn");

    const notificationModal = document.querySelector("#notification-modal");
    const dismissNotificationBtn = document.querySelector("#modal-dismiss-btn");

    if (dismissNotificationBtn && notificationModal) {
        dismissNotificationBtn.addEventListener("click", () => {
            notificationModal.classList.remove("active");
            hasNotifiedCurrentTicket = true;
        });
    }

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
            localStorage.removeItem("active_ticket_num");
            window.location.href = "login.html";
        });
    }

    async function restoreActiveStudentTicket() {
        if (!currentUser) return false;


        let savedTicketNum = localStorage.getItem("active_ticket_num");
        let allTickets = typeof getTickets === "function" ? await getTickets() : [];
        let myActiveTicket = null;

        if (savedTicketNum) {
            myActiveTicket = allTickets.find(ticket => (ticket.ticketNumber === savedTicketNum || ticket.id === savedTicketNum));
        }

        if (!myActiveTicket) {
            myActiveTicket = allTickets.find(ticket =>
                (ticket.studentEmail === currentUser.email || (currentUser.id && ticket.studentId === currentUser.id)) &&
                ((ticket.status || "").toLowerCase() !== "cancelled")
            );
        }

        if (myActiveTicket) {
            let ticketId = myActiveTicket.ticketNumber || myActiveTicket.id;
            let service = myActiveTicket.department || myActiveTicket.serviceName;


            localStorage.setItem("active_ticket_num", ticketId);

            if (sidebarTicketNum) sidebarTicketNum.textContent = ticketId;
            if (sidebarTicketName) sidebarTicketName.textContent = service;
            if (liveTicketNum) liveTicketNum.textContent = ticketId;
            if (liveServiceName) liveServiceName.textContent = service;

            await showScreen(ticketScreen);
            await refreshStudentTicketUI();
            return true;
        }

        return false;
    }

    async function updateServicesWaitingCount() {
        let allTickets = typeof getTickets === "function" ? await getTickets() : [];

        serviceCard.forEach((card) => {
            let prefix = card.dataset.prefix;
            let serviceName = card.dataset.service;

            let waitingTickets = allTickets.filter(ticket => 
                (ticket.prefix === prefix || ticket.department === serviceName || ticket.serviceName === serviceName) && 
                (ticket.status || "").toLowerCase() === "waiting"
            );

            let count = waitingTickets.length;
            let personNumElement = card.querySelector(".person-number");
            let waitingTimeElement = card.querySelector(".waiting-time");

            if (personNumElement) {
                personNumElement.textContent = `${count} waiting`;
            }

            if (waitingTimeElement) {
                let estTime = count * 5;
                waitingTimeElement.textContent = count > 0 ? `~${estTime} min wait` : "No wait";
            }
        });
    }

    async function showScreen(targetScreen) {
        if (!targetScreen) return;

        if (servicesScreen) servicesScreen.classList.add("hidden");
        if (confirmationScreen) confirmationScreen.classList.add("hidden");
        if (ticketScreen) ticketScreen.classList.add("hidden");

        targetScreen.classList.remove("hidden");

        stepItems.forEach((item) => {
            item.classList.remove("active");
        });

        switch(targetScreen) {
            case servicesScreen:
                if (stepNodeOne) stepNodeOne.classList.add("active");
                await updateServicesWaitingCount();
                break;
            case confirmationScreen:
                if (stepNodeTwo) stepNodeTwo.classList.add("active");
                if (sidebarTicketStatus) sidebarTicketStatus.textContent = "In Queue";
                break;
            case ticketScreen:
                if (stepNodeThree) stepNodeThree.classList.add("active");
                if (sidebarTicketStatus) sidebarTicketStatus.textContent = "Waiting";
                break;
        }
    }

    function getSelectedCard() {
        return document.querySelector(".service-card.selected");
    }

    async function refreshStudentTicketUI() {
        await updateServicesWaitingCount();

        let activeTicketId = localStorage.getItem("active_ticket_num") || (sidebarTicketNum ? sidebarTicketNum.textContent : "");
        if (!activeTicketId || activeTicketId === "—") return;

        let allTickets = typeof getTickets === "function" ? await getTickets() : [];
        let myTicket = allTickets.find(ticket => (ticket.ticketNumber === activeTicketId || ticket.id === activeTicketId));

        if (!myTicket) return;

        let ticketDepartment = myTicket.department || myTicket.serviceName;
        
        let servingTicket = allTickets.find(ticket => 
            (ticket.department === ticketDepartment || ticket.serviceName === ticketDepartment) && 
            (ticket.status || "").toLowerCase() === "serving"
        );

        if (liveNowServing) {
            liveNowServing.textContent = servingTicket ? (servingTicket.ticketNumber || servingTicket.id) : "None";
        }

        let waitingTickets = allTickets.filter(ticket => 
            (ticket.department === ticketDepartment || ticket.serviceName === ticketDepartment) && 
            (ticket.status || "").toLowerCase() === "waiting"
        );

        let myTicketMongoId = myTicket._id || myTicket.id;
        let myIndex = waitingTickets.findIndex(ticket => (ticket._id === myTicketMongoId || ticket.ticketNumber === myTicket.ticketNumber));
        
        let peopleAhead = myIndex > 0 ? myIndex : 0;
        let currentStatus = (myTicket.status || "").toLowerCase();

        if (currentStatus === "serving") {
            if (liveCount) liveCount.textContent = "0";
            if (liveWaitTime) liveWaitTime.textContent = "It's your turn!";
            if (liveStatusText) liveStatusText.textContent = "Serving";
            if (sidebarTicketStatus) sidebarTicketStatus.textContent = "Serving";

            if (!hasNotifiedCurrentTicket && notificationModal) {
                notificationModal.classList.add("active");
            }
        } else if (currentStatus === "waiting") {
            if (liveCount) liveCount.textContent = peopleAhead;
            if (liveWaitTime) liveWaitTime.textContent = peopleAhead > 0 ? `~${peopleAhead * 5} mins wait` : "You are next!";
            if (liveStatusText) liveStatusText.textContent = "Waiting";
            if (sidebarTicketStatus) sidebarTicketStatus.textContent = "Waiting";
        } else if (currentStatus === "completed" || currentStatus === "served") {
            if (liveCount) liveCount.textContent = "0";
            if (liveStatusText) liveStatusText.textContent = "Completed";
            if (sidebarTicketStatus) sidebarTicketStatus.textContent = "Completed";
            if (liveWaitTime) liveWaitTime.textContent = "Service completed";
        }

        let progressSegments = document.querySelectorAll(".progress-segments .segment");
        if (progressSegments.length > 0) {
            let activeCount = 1;
            if (currentStatus === "serving" || currentStatus === "completed" || currentStatus === "served") {
                activeCount = 5;
            } else if (peopleAhead === 0) {
                activeCount = 4;
            } else if (peopleAhead === 1) {
                activeCount = 3;
            } else if (peopleAhead === 2) {
                activeCount = 2;
            } else {
                activeCount = 1;
            }

            progressSegments.forEach((segment, index) => {
                if (index < activeCount) {
                    segment.classList.add("active");
                } else {
                    segment.classList.remove("active");
                }
            });
        }
    }

    function resetTicketData() {
        let activeCard = getSelectedCard();
        if (activeCard) {
            activeCard.classList.remove("selected");
        }
        hasNotifiedCurrentTicket = false;
        localStorage.removeItem("active_ticket_num");
        if (sidebarTicketNum) sidebarTicketNum.textContent = "—";
        if (sidebarTicketName) sidebarTicketName.textContent = "Pick a service to begin";
        if (sidebarTicketStatus) sidebarTicketStatus.textContent = "Not Started";
    }

    serviceCard.forEach((singleCard) => {
        singleCard.addEventListener("click", () => {
            serviceCard.forEach((card) => {
                card.classList.remove("selected");
            });
            singleCard.classList.add("selected");
        });
    });

    if (joinQueueBtn) {
        joinQueueBtn.addEventListener("click", async () => {
            let selectedCard = getSelectedCard();

            if (selectedCard) {
                let serviceName = selectedCard.dataset.service;
                let prefix = selectedCard.dataset.prefix;
                let counterObject = typeof getCounter === "function" ? getCounter() : {};
                
                counterObject[prefix] = (counterObject[prefix] || 0) + 1;
                let generatedTicket = `${prefix}-${counterObject[prefix]}`;

                if (typeof saveCounters === "function") saveCounters(counterObject);

                let ticketObject = {
                    ticketNumber: generatedTicket,
                    department: serviceName,
                    prefix: prefix,
                    status: "Waiting",
                    notified: false,
                    studentEmail: currentUser.email,
                    studentId: currentUser.id || null
                };

                hasNotifiedCurrentTicket = false;
                localStorage.setItem("active_ticket_num", generatedTicket);

                if (typeof addTicketToBackend === "function") {
                    await addTicketToBackend(ticketObject);
                }

                if (ticketName) ticketName.textContent = serviceName;
                if (ticketNumber) ticketNumber.textContent = generatedTicket;
                if (liveTicketNum) liveTicketNum.textContent = generatedTicket;
                if (liveServiceName) liveServiceName.textContent = serviceName;
                if (sidebarTicketNum) sidebarTicketNum.textContent = generatedTicket;
                if (sidebarTicketName) sidebarTicketName.textContent = serviceName;

                await refreshStudentTicketUI();
                await showScreen(confirmationScreen);
            } else {
                alert("Please select a service first!");
            }
        });
    }

    if (statusViewBtn) {
        statusViewBtn.addEventListener("click", async () => {
            await showScreen(ticketScreen);
            await refreshStudentTicketUI();
        });
    }

    if (backToServicesBtn) {
        backToServicesBtn.addEventListener("click", async () => {
            resetTicketData();
            await showScreen(servicesScreen);
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            if (cancelDisplay) cancelDisplay.classList.add("active");
        });
    }

    if (keepBtn) {
        keepBtn.addEventListener("click", () => {
            if (cancelDisplay) cancelDisplay.classList.remove("active");
        });
    }

    if (confirmationCancelBtn) {
        confirmationCancelBtn.addEventListener("click", async () => {
            if (cancelDisplay) cancelDisplay.classList.remove("active");
            resetTicketData();
            await showScreen(servicesScreen);
        });
    }


    const hasActiveTicket = await restoreActiveStudentTicket();

    if (!hasActiveTicket) {
        await showScreen(servicesScreen);
    }

    setInterval(async () => {
        await refreshStudentTicketUI();
    }, 3000);
});