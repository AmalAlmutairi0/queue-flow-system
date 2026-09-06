const API_URL = "http://localhost:5000/api/queue";

async function getTickets() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function addTicketToBackend(ticketData) {
    try {
        const response = await fetch(`${API_URL}/ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticketData)
        });
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function updateTicketStatusOnBackend(id, status) {
    try {
        const response = await fetch(`${API_URL}/ticket/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: status })
        });
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getCounter() {
    const data = localStorage.getItem("queueCounter");
    return data ? JSON.parse(data) : {};
}

function saveCounters(counters) {
    localStorage.setItem("queueCounter", JSON.stringify(counters));
}