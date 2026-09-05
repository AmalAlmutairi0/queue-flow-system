document.addEventListener("DOMContentLoaded", () => {

    let navToggle = document.querySelector(".nav-toggle");
    let navLinks = document.querySelector(".nav-links");

    let studentBtn = document.querySelector("#btn-student");
    let staffBtn = document.querySelector("#btn-staff");
    let roleBtn = document.querySelectorAll(".role-btn");

    let studentForm = document.querySelector("#student-form");
    let studentName = document.querySelector("#student-name");
    let studentId = document.querySelector("#student-id");
    let studentEmail = document.querySelector("#student-email");
    let studentPass = document.querySelector("#student-pass");
    let studentTerms = document.querySelector("#student-terms");

    let staffForm = document.querySelector("#staff-form");
    let staffName = document.querySelector("#staff-name");
    let staffEmail = document.querySelector("#staff-email");
    let staffDepartment = document.querySelector("#staff-dept");
    let staffPass = document.querySelector("#staff-pass");
    let staffTerms = document.querySelector("#staff-terms");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    function switchRole(selectedBtn) {
        roleBtn.forEach((btn) => {
            btn.classList.remove("active");
        });

        selectedBtn.classList.add("active");

        if (selectedBtn === studentBtn) {
            studentForm.classList.remove("hidden");
            staffForm.classList.add("hidden");
        } else {
            staffForm.classList.remove("hidden");
            studentForm.classList.add("hidden");
        }
    }

    studentBtn.addEventListener("click", () => switchRole(studentBtn));
    staffBtn.addEventListener("click", () => switchRole(staffBtn));

    studentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handleStudentRegister();
    });

    staffForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handleStaffRegister();
    });

    function handleStudentRegister() {
        if (!studentTerms.checked) {
            alert("Please agree to the terms and conditions before creating your account.");
            return;
        }

        let name = studentName.value.trim();
        let id = studentId.value.trim();
        let email = studentEmail.value.trim().toLowerCase();
        let password = studentPass.value.trim();

        if (!name || !id || !email || !password) {
            alert("Please fill in all required fields.");
            return;
        }

        let users = getUsers();

        let isEmailExists = users.some(user => user.email === email);

        if (isEmailExists) {
            alert("Email is already registered!");
            return;
        }

        let studentObject = {
            role: "student",
            name: name,
            id: id,
            email: email,
            password: password,
        };

        users.push(studentObject);
        saveUsers(users);

        localStorage.setItem("currentUser", JSON.stringify(studentObject));
        studentForm.reset();
        window.location.href = "student-queue.html";
    }

    function handleStaffRegister() {
        if (!staffTerms.checked) {
            alert("Please agree to the terms and conditions before creating your account.");
            return;
        }

        let name = staffName.value.trim();
        let email = staffEmail.value.trim().toLowerCase();
        let password = staffPass.value.trim();
        let department = staffDepartment.value.trim();

        if (!name || !email || !password || !department) {
            alert("Please fill in all required fields.");
            return;
        }

        let users = getUsers();

        let isEmailExists = users.some(user => user.email === email);

        if (isEmailExists) {
            alert("Email is already registered!");
            return;
        }

        let staffObject = {
            role: "staff",
            name: name,
            email: email,
            password: password,
            department: department,
        };

        users.push(staffObject);
        saveUsers(users);

        localStorage.setItem("currentUser", JSON.stringify(staffObject));
        staffForm.reset();
        window.location.href = "staff-dashboard.html";
    }

});