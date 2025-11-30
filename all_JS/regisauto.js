document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll("img");

    images.forEach(img => {
        img.addEventListener("dragstart", (e) => {
            e.preventDefault();
        });
    });

    const registrationForm = document.querySelectorAll(".input-section")[0];
    const loginForm = document.querySelectorAll(".input-section")[1];

    const toLoginLink = registrationForm.querySelector(".transition-to-link"); 
    const toRegisterLink = loginForm.querySelector(".transition-to-link");

    toLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        registrationForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });

    toRegisterLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.add("hidden");
        registrationForm.classList.remove("hidden");
    });

    const apiUrl = "https://localhost:7156/api/User"; 

    const regButton = registrationForm.querySelector(".submit-button");

    regButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const loginInput = document.getElementById("regLogin");
        const emailInput = document.getElementById("regEmail");
        const passwordInput = document.getElementById("regPassword");

        const login = loginInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        [loginInput, emailInput, passwordInput].forEach(input => {
            input.style.borderColor = "";
            const errorText = input.nextElementSibling;
            if (errorText && errorText.classList.contains("error-text")) {
                errorText.remove();
            }
        });

        let hasError = false;

        if (!login) { showError(loginInput, "Поле логин не может быть пустым"); hasError = true; }
        if (!email) { showError(emailInput, "Поле email не может быть пустым"); hasError = true; }
        if (!password) { showError(passwordInput, "Поле пароль не может быть пустым"); hasError = true; }

        if (login && !/^[a-zA-Zа-яА-Я0-9_]{4,}$/.test(login)) {
            showError(loginInput, "Минимум 4 символа, только буквы, цифры и _");
            hasError = true;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(emailInput, "Введите корректный email");
            hasError = true;
        }

        if (password && !/^[a-zA-Zа-яА-Я0-9]{8,}$/.test(password)) {
            showError(passwordInput, "Минимум 8 символов, только буквы и цифры");
            hasError = true;
        }

        if (hasError) return;

        const data = { login, email, password };

        try {
            const response = await fetch(apiUrl + "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                loginInput.value = "";
                emailInput.value = "";
                passwordInput.value = "";

                document.cookie = `userLogin=${login}; path=/; max-age=86400; SameSite=Lax`;
                window.location.href = "/all_HTML/main.html";
            } else {
                if (!response.ok) {
                    if (result.errors) {
                        if (result.errors.email) showError(emailInput, result.errors.email);
                        if (result.errors.login) showError(loginInput, result.errors.login);
                    } else if (result.message) {
                        alert(result.message);
                    }
                    return;
                }
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка подключения к серверу");
        }
    });

    function showError(input, message) {
        input.style.borderColor = "red";

        const error = document.createElement("p");
        error.classList.add("error-text");
        error.style.color = "red";
        error.style.fontSize = "12px";
        error.textContent = message;

        input.insertAdjacentElement("afterend", error);
    }

    const loginButton = loginForm.querySelector(".submit-button");

    loginButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const loginInput = document.getElementById("loginLogin");
        const passwordInput = document.getElementById("loginPassword");

        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        [loginInput, passwordInput].forEach(input => {
            input.style.borderColor = "";
            const errorText = input.nextElementSibling;
            if (errorText && errorText.classList.contains("error-text")) {
                errorText.remove();
            }
        });

        let hasError = false;

        if (!login) { showError(loginInput, "Поле логин не может быть пустым"); hasError = true; }
        if (!password) { showError(passwordInput, "Поле пароль не может быть пустым"); hasError = true; }

        if (login && !/^[a-zA-Zа-яА-Я0-9_]{4,}$/.test(login)) {
            showError(loginInput, "Минимум 4 символа");
            hasError = true;
        }

        if (password && !/^[a-zA-Zа-яА-Я0-9]{8,}$/.test(password)) {
            showError(passwordInput, "Минимум 8 символов");
            hasError = true;
        }

        if (hasError) return;

        if (login === "admin" && password === "adminadmin") {
            window.location.href = "/all_HTML/admin.html";
            return;
        }

        const data = { login, password };

        try {
            const response = await fetch(apiUrl + "/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                loginInput.value = "";
                passwordInput.value = "";

                document.cookie = `userLogin=${login}; path=/; max-age=86400; SameSite=Lax`;
                window.location.href = "/all_HTML/main.html"; 
            } else {
                if (result.errors) {
                    if (result.errors.login) showError(loginInput, result.errors.login);
                    if (result.errors.password) showError(passwordInput, result.errors.password);
                } else if (result.message) {
                    alert(result.message);
                }
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка подключения к серверу");
        }
    });

    const passwordInput = document.getElementById('regPassword');
    const eyeIcon = document.querySelector('.eye');

    eyeIcon.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';  
            eyeIcon.src = '/all_pictures/openeye.png'; 
        } else {
            passwordInput.type = 'password'; 
            eyeIcon.src = '/all_pictures/closeeye.png'; 
        }
    });

    const loginunppa = document.getElementById('loginPassword');
    const eyeIcons = document.querySelector('.eyes');

    eyeIcons.addEventListener('click', () => {
        if (loginunppa.type === 'password') {
            loginunppa.type = 'text'; 
            eyeIcons.src = '/all_pictures/openeye.png'; 
        } else {
            loginunppa.type = 'password'; 
            eyeIcons.src = '/all_pictures/closeeye.png';
        }
    });
});
