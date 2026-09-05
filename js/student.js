document.addEventListener("DOMContentLoaded", () => {

    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

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
            window.location.href = "login.html";
        });
    }

    function restoreActiveStudentTicket() {
        if (!currentUser) return;

        let allTickets = typeof getTickets === "function" ? getTickets() : [];
        let myActiveTicket = allTickets.find(ticket =>
            (ticket.studentEmail === currentUser.email || (currentUser.id && ticket.studentId === currentUser.id)) &&
            (ticket.status === "waiting" || ticket.status === "serving")
        );

        if (myActiveTicket) {
            if (sidebarTicketNum) sidebarTicketNum.textContent = myActiveTicket.id;
            if (sidebarTicketName) sidebarTicketName.textContent = myActiveTicket.serviceName;
            if (liveTicketNum) liveTicketNum.textContent = myActiveTicket.id;
            if (liveServiceName) liveServiceName.textContent = myActiveTicket.serviceName;

            showScreen(ticketScreen);
            refreshStudentTicketUI();
        }
    }

    function updateServicesWaitingCount() {
        let allTickets = typeof getTickets === "function" ? getTickets() : [];

        serviceCard.forEach((card) => {
            let prefix = card.dataset.prefix;
            let serviceName = card.dataset.service;

            let waitingTickets = allTickets.filter(ticket => 
                (ticket.prefix === prefix || ticket.serviceName === serviceName) && 
                ticket.status === "waiting"
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

    function showScreen(targetScreen) {
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
                updateServicesWaitingCount();
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

    function refreshStudentTicketUI() {
        updateServicesWaitingCount();

        let activeTicketId = sidebarTicketNum ? sidebarTicketNum.textContent : "";
        if (!activeTicketId || activeTicketId === "—") return;

        let allTickets = typeof getTickets === "function" ? getTickets() : [];
        let myTicket = allTickets.find(ticket => ticket.id === activeTicketId);

        if (!myTicket) return;

        let servingTicket = allTickets.find(ticket => ticket.serviceName === myTicket.serviceName && ticket.status === "serving");

        if (liveNowServing) {
            if (servingTicket) {
                liveNowServing.textContent = servingTicket.id;
            } else {
                liveNowServing.textContent = "None";
            }
        }

        let activeTickets = allTickets.filter(ticket => 
            ticket.serviceName === myTicket.serviceName && 
            (ticket.status === "waiting" || ticket.status === "serving")
        );

        let myIndex = activeTickets.findIndex(ticket => ticket.id === myTicket.id);

        let peopleAhead = 0;
        if (myIndex >= 0) {
            peopleAhead = myIndex;
        }

        if (myTicket.status === "serving") {
            if (liveCount) liveCount.textContent = "0";
            if (liveWaitTime) liveWaitTime.textContent = "It's your turn!";
            if (liveStatusText) liveStatusText.textContent = "Serving";
            if (sidebarTicketStatus) sidebarTicketStatus.textContent = "Serving";

            if (!myTicket.notified) {
                myTicket.notified = true;
                if (typeof saveTicket === "function") saveTicket(allTickets);
                
                if (notificationModal) {
                    notificationModal.classList.add("active");
                }
            }
        } else if (myTicket.status === "waiting") {
            if (liveCount) liveCount.textContent = peopleAhead;
            if (liveWaitTime) liveWaitTime.textContent = `Estimated wait: ~${peopleAhead * 5} mins`;
            if (liveStatusText) liveStatusText.textContent = "Waiting";
            if (sidebarTicketStatus) sidebarTicketStatus.textContent = "Waiting";
        } else if (myTicket.status === "served") {
            if (liveStatusText) liveStatusText.textContent = "Completed";
            if (sidebarTicketStatus) sidebarTicketStatus.textContent = "Completed";
            if (liveWaitTime) liveWaitTime.textContent = "Service completed";
        }

        let progressSegments = document.querySelectorAll(".progress-segments .segment");
        if (progressSegments.length > 0) {
            let activeCount = 1;

            if (myTicket.status === "serving") {
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
        joinQueueBtn.addEventListener("click", () => {
            let selectedCard = getSelectedCard();

            if (selectedCard) {
                let serviceName = selectedCard.dataset.service;
                let prefix = selectedCard.dataset.prefix;
                let counterObject = typeof getCounter === "function" ? getCounter() : {};
                
                counterObject[prefix] = (counterObject[prefix] || 0) + 1;
                let generatedTicket = `${prefix}-${counterObject[prefix]}`;

                if (typeof saveCounters === "function") saveCounters(counterObject);

                let ticketObject = {
                    id: generatedTicket,
                    serviceName: serviceName,
                    prefix: prefix,
                    status: "waiting",
                    notified: false,
                    studentEmail: currentUser.email,
                    studentId: currentUser.id || null
                };

                let allTickets = typeof getTickets === "function" ? getTickets() : [];
                allTickets.push(ticketObject);
                if (typeof saveTicket === "function") saveTicket(allTickets);

                if (ticketName) ticketName.textContent = serviceName;
                if (ticketNumber) ticketNumber.textContent = generatedTicket;
                if (liveTicketNum) liveTicketNum.textContent = generatedTicket;
                if (liveServiceName) liveServiceName.textContent = serviceName;
                if (sidebarTicketNum) sidebarTicketNum.textContent = generatedTicket;
                if (sidebarTicketName) sidebarTicketName.textContent = serviceName;

                refreshStudentTicketUI();

                showScreen(confirmationScreen);
            } else {
                alert("Please select a service first!");
            }
        });
    }

    if (statusViewBtn) {
        statusViewBtn.addEventListener("click", () => {
            showScreen(ticketScreen);
            refreshStudentTicketUI();
        });
    }

    if (backToServicesBtn) {
        backToServicesBtn.addEventListener("click", () => {
            resetTicketData();
            showScreen(servicesScreen);
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
        confirmationCancelBtn.addEventListener("click", () => {
            let activeTicketId = sidebarTicketNum ? sidebarTicketNum.textContent : "";

            if (activeTicketId && activeTicketId !== "—") {
                let allTickets = typeof getTickets === "function" ? getTickets() : [];
                let updatedTickets = allTickets.map(ticket => {
                    if (ticket.id === activeTicketId) {
                        return { ...ticket, status: "cancelled" };
                    }
                    return ticket;
                });

                if (typeof saveTicket === "function") saveTicket(updatedTickets);
            }

            if (cancelDisplay) cancelDisplay.classList.remove("active");
            resetTicketData();
            showScreen(servicesScreen);
        });
    }

    updateServicesWaitingCount();
    restoreActiveStudentTicket();

    window.addEventListener("storage", (event) => {
        if (event.key === "queueTicket") {
            refreshStudentTicketUI();
        }
    });
});