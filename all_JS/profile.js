document.addEventListener("DOMContentLoaded", async () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
    }, {});

    const userLogin = cookies.userLogin;
    if (!userLogin) return;

    const loginInput = document.querySelector(".login");
    const emailInput = document.querySelector(".email");
    const passwordInput = document.querySelector(".password");
    const imageInput = document.querySelector(".image");
    const avatarPreview = document.querySelector(".avatar-preview");

    try {
        const response = await fetch(`https://localhost:7156/api/User/${encodeURIComponent(userLogin)}`);
        if (!response.ok) throw new Error("Ошибка загрузки данных");
        
        const data = await response.json();

        loginInput.value = data.login ?? "";
        emailInput.value = data.email ?? "";
        passwordInput.value = data.password ?? "";

        if (data.photoUrl) {
            avatarPreview.src = data.photoUrl;
            avatarPreview.style.opacity = "1";
            avatarPreview.style.width = "100%";
            avatarPreview.style.height = "100%";
            avatarPreview.style.objectFit = "cover";
        } else {
            avatarPreview.src = "/all_pictures/Rectangle 40.png";
        }

    } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
    }

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                avatarPreview.src = reader.result;
                avatarPreview.style.opacity = "1";
                avatarPreview.style.width = "100%";
                avatarPreview.style.height = "100%";
                avatarPreview.style.objectFit = "cover";
            };
            reader.readAsDataURL(file);
        }
    });

    document.querySelector(".savechanges").addEventListener("click", async () => {
        const loginInput = document.querySelector(".login");
        const emailInput = document.querySelector(".email");
        const passwordInput = document.querySelector(".password");
        const avatarInput = document.querySelector(".image");
        const avatarPreview = document.querySelector(".avatar-preview");

        let photoBase64 = avatarPreview.src;
        
        if (avatarInput.files.length > 0) {
            const file = avatarInput.files[0];
            const reader = new FileReader();
            photoBase64 = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        }

        const updateData = {
            login: cookies.userLogin,       
            newLogin: loginInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            photoUrl: photoBase64
        };

        try {
            const response = await fetch("https://localhost:7156/api/User/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) throw new Error("Ошибка при сохранении");
            const result = await response.json();

            alert(result.message);
            
            if (updateData.newLogin && updateData.newLogin !== cookies.userLogin) {
                document.cookie = `userLogin=${encodeURIComponent(updateData.newLogin)}; path=/;`;
            }

        } catch (err) {
            console.error("Ошибка:", err);
            alert("Не удалось сохранить изменения.");
        }
    });

    const passwordInputs = document.querySelector(".password");
    const eyeIcon = document.querySelector(".eyes");

    eyeIcon.addEventListener("click", () => {
        const isPasswordVisible = passwordInputs.type === "text";

        passwordInputs.type = isPasswordVisible ? "password" : "text";
        eyeIcon.src = isPasswordVisible 
            ? "/all_pictures/closeeye.png"   
            : "/all_pictures/openeye.png";    
    });

    const deleteBtn = document.querySelector(".butdel");

    deleteBtn.addEventListener("click", async () => {
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
        
        const userLogin = cookies.userLogin;
        if (!userLogin) return alert("Пользователь не найден");

        if (!confirm("Вы уверены, что хотите удалить аккаунт?")) return;

        try {
            const response = await fetch(`https://localhost:7156/api/User/${encodeURIComponent(userLogin)}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Ошибка при удалении аккаунта");

            alert("Аккаунт удалён");
            document.cookie = "userLogin=; path=/; max-age=0";
            window.location.href = "/all_HTML/main.html"; 
        } catch (err) {
            console.error(err);
            alert("Не удалось удалить аккаунт");
        }
    });

    const exitBtn = document.querySelector(".butexit");

    exitBtn.addEventListener("click", () => {
        document.cookie = "userLogin=; path=/; max-age=0"; 
        window.location.href = "/all_HTML/main.html"; 
    });
    
    const listContainer = document.querySelector(".listofactivities");
    const leftArrow = document.querySelector(".left");
    const rightArrow = document.querySelector(".right");

    try {
        const response = await fetch(`https://localhost:7156/api/Favorites/user/details?userLogin=${encodeURIComponent(userLogin)}`);
        if (!response.ok) throw new Error("Ошибка при получении избранного");

        let favorites = await response.json(); 

        if (!favorites || favorites.length === 0) {
            listContainer.innerHTML = `<p class="empty-collection-message">Пока нет избранных памятников</p>`;
            leftArrow.style.display = rightArrow.style.display = "none";
            return;
        }

        const pageSize = 4; // 2x2
        let currentPage = 0;

        function renderPage(page) {
            const totalPages = Math.ceil(favorites.length / pageSize);
            if (page >= totalPages) page = totalPages - 1 < 0 ? 0 : totalPages - 1;
            currentPage = page;

            listContainer.innerHTML = "";
            const start = page * pageSize;
            const end = start + pageSize;
            const pageItems = favorites.slice(start, end);

            pageItems.forEach(mon => {
                const imgUrl = (mon.photos && mon.photos.length > 0) ? mon.photos[0].url : '/all_pictures/Rectangle 40.png';

                const card = document.createElement("div");
                card.className = "cardoflist";
                card.style.backgroundImage = `url('${imgUrl}')`;

                card.innerHTML = `
                    <div class="contentofcard">
                        <div class="names">
                            <p class="citycon" style="white-space: nowrap;">${mon.city ?? ""}</p>
                            <p class="namecon">${mon.name ?? ""}</p>
                        </div>
                    </div>
                    <div class="but">
                        <img src="/all_pictures/full_heart.png" alt="" class="butcon">
                    </div>
                `;

                card.addEventListener("click", () => {
                    const monumentName = mon.name;
                    if (!monumentName) return;

                    document.cookie = `selectedMonument=${encodeURIComponent(monumentName)}; path=/; max-age=${24*60*60}`;

                    window.location.href = "/all_HTML/destination.html";
                });

                listContainer.appendChild(card);
            });

            leftArrow.style.opacity = page === 0 ? 0.5 : 1;
            rightArrow.style.opacity = page === totalPages - 1 ? 0.5 : 1;
            leftArrow.style.pointerEvents = page === 0 ? "none" : "auto";
            rightArrow.style.pointerEvents = page === totalPages - 1 ? "none" : "auto";

            if (totalPages <= 1) leftArrow.style.display = rightArrow.style.display = "none";
            else leftArrow.style.display = rightArrow.style.display = "flex";

            document.querySelectorAll(".butcon").forEach(heart => {
                heart.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    const card = heart.closest(".cardoflist");
                    const monumentName = card.querySelector(".namecon")?.textContent?.trim();
                    if (!monumentName) return;

                    const isFav = heart.src.includes("/all_pictures/full_heart.png");
                    if (isFav) {
                        await fetch(`https://localhost:7156/api/Favorites/removeByName?userLogin=${encodeURIComponent(userLogin)}&monumentName=${encodeURIComponent(monumentName)}`, { method: "DELETE" });
                        favorites.splice(favorites.findIndex(f => f.name === monumentName), 1);
                        renderPage(currentPage);
                    }
                });
            });
        }

        renderPage(currentPage);

        leftArrow.addEventListener("click", () => {
            if (currentPage > 0) {
                currentPage--;
                renderPage(currentPage);
            }
        });

        rightArrow.addEventListener("click", () => {
            if (currentPage < Math.ceil(favorites.length / pageSize) - 1) {
                currentPage++;
                renderPage(currentPage);
            }
        });

    } catch (err) {
        console.error(err);
        listContainer.innerHTML = `<p class="empty-collection-message">Ошибка загрузки избранных памятников</p>`;
    }
});
