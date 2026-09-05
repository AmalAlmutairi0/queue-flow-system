function getUsers() {
    let users = localStorage.getItem("appUsers");
    if (users) {
        return JSON.parse(users);
    } else {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem("appUsers", JSON.stringify(users));
}

function getCurrentUser() {
    let user = localStorage.getItem("currentUser");
    if (user) {
        return JSON.parse(user);
    }
    user = sessionStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

function saveCurrentUser(user, remember) {
    if (remember) {
        localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
    }
}

function clearCurrentUser() {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
}