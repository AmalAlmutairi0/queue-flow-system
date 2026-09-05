document.addEventListener("DOMContentLoaded", () => {

    let navToggle = document.querySelector(".nav-toggle");
    let navLinks = document.querySelector(".nav-links");

    let studentBtn = document.querySelector("#btn-student");
    let staffBtn = document.querySelector("#btn-staff");
    let roleBtn = document.querySelectorAll(".role-btn");

    let loginForm = document.querySelector("#login-form");
    let emailLabel = document.querySelector("#email-label");
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");
    let rememberCheck = document.querySelector("#remember");

    let selectedRole = "student";

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    let currentUser = getCurrentUser();
    if (currentUser) {
        if (currentUser.role === "student") {
            window.location.href = "student-queue.html";
        } else if (currentUser.role === "staff") {
            window.location.href = "staff-dashboard.html";
        }
    }

    function switchRole(selectedBtn) {
        roleBtn.forEach((btn) => {
            btn.classList.remove("active");
        });

        selectedBtn.classList.add("active");

        if (selectedBtn === studentBtn) {
            selectedRole = "student";
            emailLabel.textContent = "Student Email";
        } else {
            selectedRole = "staff";
            emailLabel.textContent = "Staff Email";
        }
    }

    studentBtn.addEventListener("click", () => switchRole(studentBtn));
    staffBtn.addEventListener("click", () => switchRole(staffBtn));

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handlelogin();
    });

    function handlelogin() {
        let emailVal = email.value.trim().toLowerCase();
        let passwordVal = password.value.trim();

        if (!emailVal || !passwordVal) {
            alert("Please fill in all required fields.");
            return;
        }

        let users = getUsers();

        let foundUser = users.find(input =>
            input.email.trim().toLowerCase() === emailVal &&
            input.password === passwordVal &&
            input.role === selectedRole
        );

        if (foundUser) {
            saveCurrentUser(foundUser, rememberCheck.checked);

            if (foundUser.role === "student") {
                window.location.href = "student-queue.html";
            } else {
                window.location.href = "staff-dashboard.html";
            }
        } else {
            alert("Invalid credentials or incorrect role selected.");
            password.value = "";
        }
    }
});