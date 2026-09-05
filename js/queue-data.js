const TICKETS_KEY = "queueTicket";
const COUNTERS_KEY = "queueCounter";

function getTickets() {
    const data = localStorage.getItem(TICKETS_KEY);
    return data ? JSON.parse(data) : [];
}

function saveTicket(tickets) {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

function getCounter() {
    const data = localStorage.getItem(COUNTERS_KEY);
    return data ? JSON.parse(data) : {};
}

function saveCounters(counters) {
    localStorage.setItem(COUNTERS_KEY, JSON.stringify(counters));
}