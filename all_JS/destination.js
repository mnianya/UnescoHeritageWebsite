window.addEventListener("load", async () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
    }, {});

     const loader = document.getElementById("svgLoader");
    const main = document.querySelector(".main");

    main.style.display = "flex";
    setTimeout(() => {
        main.style.opacity = "1"; 
    }, 10);


    const userLogin = cookies.userLogin;
     const registrationLink = document.querySelector(".registration a");

    if (userLogin && userLogin.trim() !== "") {
        registrationLink.textContent = userLogin;
        registrationLink.href = "/all_HTML/profile.html";
    }

    const monumentName = cookies["selectedMonument"];

    if (!monumentName) {
        console.error("Памятник не найден в cookies");
        return;
    }

    try {
        console.log("Запрашиваю памятник:", monumentName);

        const response = await fetch(
            `https://localhost:7156/api/MonumentDetails/${encodeURIComponent(monumentName)}`
        );

        if (!response.ok) throw new Error("Ошибка загрузки памятника");

        const data = await response.json();
        console.log("Получено:", data);


        document.querySelector(".nameofdestin").textContent = data.name;
        document.querySelector(".shortdesc").textContent = data.shortDescription;

        const photosContainer = document.querySelector(".photoss");
        const leftArrow = document.querySelector(".arleft");
        const rightArrow = document.querySelector(".arright");

        const photos = data.photos; 

        if (!photos || photos.length === 0) return;

        const headerBg = document.querySelector("#header .back-pic");
        headerBg.style.backgroundImage = `url('${photos[0]}')`;
        document.querySelector('.footer-photo')
        .style.backgroundImage = `url('${photos[0]}')`;

        let startIndex = 1; 
        const visibleCount = 3;

        function renderSlider() {
            photosContainer.innerHTML = "";
            const endIndex = Math.min(startIndex + visibleCount, photos.length);
            for (let i = startIndex; i < endIndex; i++) {
                const img = document.createElement("img");
                img.src = photos[i];
                img.classList.add("photo");
                photosContainer.appendChild(img);
            }

            leftArrow.classList.toggle("disabled", startIndex === 1);
            rightArrow.classList.toggle("disabled", startIndex + visibleCount >= photos.length);
        }

        renderSlider();

        leftArrow.addEventListener("click", () => {
            if (startIndex > 1) {
                startIndex--;
                renderSlider();
            }
        });

        rightArrow.addEventListener("click", () => {
            if (startIndex + visibleCount < photos.length) {
                startIndex++;
                renderSlider();
            }
        });

        const histBlock = document.querySelector(".histotydesc");
        histBlock.innerHTML = "";
        data.history.split('\n').forEach(p => {
            if (p.trim() !== "") {
                const tag = document.createElement("p");
                tag.textContent = p.trim();
                histBlock.appendChild(tag);
            }
        });

        const recomContainer = document.querySelector(".recomdesc");

        const text = data.visitRecommendations;

        const blocks = {
          bestTime: "",
          ticketInfo: "",
          mustSee: [],
          advice: []
        };

        const lines = text.split(/\r?\n|\.\s*/).map(l => l.trim()).filter(Boolean);

        let currentBlock = null;

        lines.forEach(line => {
          if (line.match(/Лучшее время/i)) {
            currentBlock = 'bestTime';
            blocks[currentBlock] = line.replace(/Лучшее время:?\s*/i, '');
          } else if (line.match(/Билет/i)) {
            currentBlock = 'ticketInfo';
            blocks[currentBlock] = line.replace(/Билет:?\s*/i, '');
          } else if (line.match(/Обязательно посмотреть/i)) {
            currentBlock = 'mustSee';
          } else if (line.match(/Советы/i)) {
            currentBlock = 'advice';
          } else {
            if (currentBlock === 'mustSee' || currentBlock === 'advice') {
              line.split(/[:.]\s*/).forEach(item => {
                const trimmed = item.trim();
                if (trimmed) blocks[currentBlock].push(trimmed);
              });
            } else if (currentBlock) {
              blocks[currentBlock] += (blocks[currentBlock] ? ". " : "") + line;
            }
          }
        });

        recomContainer.innerHTML = `
          <p><strong>Лучшее время:</strong> ${blocks.bestTime}</p>
          <p><strong>Билеты:</strong> ${blocks.ticketInfo}</p>

          <p><strong>Что посмотреть:</strong></p>
          <ul>
            ${blocks.mustSee.map(item => `<li> ${item}</li>`).join('')}
          </ul>

          <p><strong>Советы:</strong></p>
          <ul>
            ${blocks.advice.map(item => `<li> ${item}</li>`).join('')}
          </ul>
        `;

        const unescoLink = document.querySelector(".linkunesco");
        unescoLink.href = data.unescoLink;
        unescoLink.target = "_blank"; 
        unescoLink.textContent = "Открыть страницу ЮНЕСКО";


        updateRatingInfo(data.reviews);

        function updateRatingInfo(reviews) {
            if (!reviews || reviews.length === 0) {
                document.querySelector(".countofrating").textContent =
                    "Средний рейтинг: нет оценок";
                document.querySelector(".counfrew").textContent =
                    "Всего: 0 отзывов";
                return;
            }

            const count = reviews.length;
            const sumRatings = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
            const average = (sumRatings / count).toFixed(1);

            document.querySelector(".countofrating").textContent =
                `Средний рейтинг: ${average}`;
            document.querySelector(".counfrew").textContent =
                `Всего: ${count} отзыва`;
        }

        const photoDiv = document.querySelector(".photoofuser");

        async function loadUserPhoto() {
            if (!userLogin) {
                photoDiv.style.backgroundImage = `url('/all_pictures/default.png')`;
                return;
            }

            try {
                const responses = await fetch(
                    `https://localhost:7156/api/User/${encodeURIComponent(userLogin)}`
                );

                if (!responses.ok) throw new Error("Пользователь не найден");

                const user = await responses.json();

                if (user.photoUrl && user.photoUrl.trim() !== "") {
                    photoDiv.style.backgroundImage = `url('${user.photoUrl}')`;
                } else {
                    photoDiv.style.backgroundImage = `url('/all_pictures/default.png')`;
                }
            } catch (error) {
                console.error(error);
                photoDiv.style.backgroundImage = `url('/all_pictures/default.png')`;
            }
        }

        loadUserPhoto();

        const stars = document.querySelectorAll(".stars .star");
        const pinButton = document.querySelector(".pins");
        const fileInput = document.getElementById("reviewPhoto");
        const previewContainer = document.querySelector(".photo-preview-container");
        let selectedRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener("click", () => {
                selectedRating = index + 1;

                stars.forEach((s, i) => {
                    s.classList.toggle("active", i < selectedRating);
                });
            });
        });

        pinButton.addEventListener("click", () => {
            fileInput.click();
        });

        let selectedPhotos = [];

        fileInput.addEventListener("change", (e) => {
            const files = Array.from(e.target.files);

            files.forEach((file) => {
                if (selectedPhotos.length < 3) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        selectedPhotos.push(reader.result);
                        renderPhotos();
                    };
                    reader.readAsDataURL(file);
                }
            });

            fileInput.value = "";
        });

        function renderPhotos() {
            previewContainer.innerHTML = "";

            selectedPhotos.forEach((photo, index) => {
                const div = document.createElement("div");
                div.classList.add("photo-preview");

                div.innerHTML = `
                    <img src="${photo}">
                    <div class="remove-btn" data-index="${index}">×</div>
                `;

                previewContainer.appendChild(div);
        });

        if (selectedPhotos.length > 0) {
            previewContainer.style.display = "flex";
            previewContainer.style.margin = "10px 0";
        } else {
            previewContainer.style.display = "none";
            previewContainer.style.margin = "0";
        }

        if (selectedPhotos.length >= 1) {
            pinButton.classList.add("disabled");
        } else {
            pinButton.classList.remove("disabled");
        }

        document.querySelectorAll(".remove-btn").forEach(btn =>
            btn.addEventListener("click", (e) => {
                const idx = e.target.dataset.index;
                selectedPhotos.splice(idx, 1);
                renderPhotos();
            })
        );
}

        const sendBtn = document.querySelector(".send");
        const textArea = document.querySelector(".inputofrew");

        sendBtn.addEventListener("click", async () => {

            const cookies = document.cookie.split(";").reduce((acc, c) => {
                let [k, v] = c.trim().split("=");
                acc[k] = decodeURIComponent(v);
                return acc;
            }, {});

            const userLogin = cookies.userLogin;
            const monumentName = cookies["selectedMonument"];
            const comment = textArea.value.trim();

            if (!userLogin || userLogin.trim() === "") {
                window.location.href = "/all_HTML/registrationform.html";
                return;
            }

            if (selectedRating < 1) {
                alert("Поставьте хотя бы одну звезду");
                return;
            }

            if (comment.length < 1) {
                alert("Напишите хотя бы одно слово");
                return;
            }

            if (selectedPhotos.length < 1) {
                alert("Добавьте минимум 1 фотографию");
                return;
            }

            const reviewData = {
                userLogin: userLogin,
                monumentName: monumentName,
                rating: selectedRating,
                comment: comment,
                photos: selectedPhotos // ⚡ уже Base64!
                
            };

            console.log(selectedPhotos[0]);

            console.log("Отправляю отзыв:", reviewData);

            try {
                const response = await fetch("https://localhost:7156/api/Reviews/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reviewData)
                });

                if (!response.ok) throw new Error("Ошибка сервера");

                const newReview = {
                    userLogin,
                    rating: selectedRating,
                    comment,
                    publishDate: new Date().toISOString(),
                    reviewPhoto: selectedPhotos[0],
                    userPhoto: document.querySelector(".photoofuser").style.backgroundImage
                        .replace('url("','')
                        .replace('")','')
                };

                reviews.unshift(newReview);

                currentIndex = 0;
                renderReviews();

                updateRatingInfo(reviews);

                document.querySelector(".counfrew").textContent =
                    `Всего: ${reviews.length} отзыв(ов)`;
                document.querySelector(".countofrating").textContent =
                    `Средний рейтинг: ${(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)}`;

                selectedPhotos = [];
                selectedRating = 0;
                textArea.value = "";
                renderPhotos();
                stars.forEach(s => s.classList.remove("active"));

            } catch (error) {
                console.error(error);
                alert("❌ Не удалось отправить отзыв 😢");
            }
        });

        const reviews = data.reviews; 
        const listContainer = document.querySelector('.listofrew');
        const totalReviewsEl = document.querySelector('.totalReviews');
        const leftArrows = document.querySelector('.arrows .left img');
        const rightArrows = document.querySelector('.arrows .right img');

        let currentIndex = 0;
        const visibleCounts = 2;

        function formatDate(dateStr) {
            const months = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
            const date = new Date(dateStr);
            return `${date.getDate()} ${months[date.getMonth()]}`;
        }

        function renderReviews() {
            listContainer.innerHTML = ''; 

             if (!reviews || reviews.length === 0) {
                listContainer.style.display = 'none';              
                leftArrows.style.display = 'none';                
                rightArrows.style.display = 'none';
                return;
            }

                 if (reviews.length === 1) {
                    leftArrows.style.display = 'none';
                    rightArrows.style.display = 'none';
                } else {
                    leftArrows.style.display = 'block';
                    rightArrows.style.display = 'block';
                }
                            

            const sliceReviews = reviews.slice(currentIndex, currentIndex + visibleCounts);

            sliceReviews.forEach(review => {
                const item = document.createElement('div');
                item.className = 'itemofrew';

                const pictures = document.createElement('div');
                pictures.className = 'pictures';
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photoofrew';
                photoDiv.style.backgroundImage = `url(${review.reviewPhoto})`;
                photoDiv.style.width = '187px';
                photoDiv.style.height = '122px';
                photoDiv.style.cursor = 'pointer';
                pictures.style.display = 'flex';
                pictures.style.justifyContent = 'center';
                pictures.appendChild(photoDiv);
                item.appendChild(pictures);

                photoDiv.addEventListener('click', () => {
                    const byteString = atob(review.reviewPhoto.split(',')[1]);
                    const mimeString = review.reviewPhoto.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                    const blob = new Blob([ab], { type: mimeString });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                });

                const info = document.createElement('div');
                info.className = 'info_rew';

                const head = document.createElement('div');
                head.className = 'head_ofrew';

                const userInfo = document.createElement('div');
                userInfo.className = 'info_user';

                const photouser = document.createElement('div');
                photouser.className = 'photouser';
                photouser.style.backgroundImage = review.userPhoto ? `url(${review.userPhoto})` : `url(/all_pictures/default.png)`;
                photouser.style.width = '32px';
                photouser.style.height = '32px';

                const loginuser = document.createElement('p');
                loginuser.className = 'loginuser';
                if (review.userLogin === userLogin) {
                    loginuser.textContent = `Вы`;
                    loginuser.classList.add("current-user");
                } else {
                    loginuser.textContent = review.userLogin;
                }

                const datarew = document.createElement('p');
                datarew.className = 'datarew';
                datarew.textContent = formatDate(review.publishDate);

                userInfo.appendChild(photouser);
                userInfo.appendChild(loginuser);
                userInfo.appendChild(datarew);

                const rating = document.createElement('div');
                rating.className = 'rating';
                for (let i = 0; i < 5; i++) {
            const star = document.createElement('img');
            star.src = '/all_pictures/star.svg'; // один SVG
            star.className = 'ra';
            if (i < review.rating) star.classList.add('active'); // жёлтая
            rating.appendChild(star);
        }


                head.appendChild(userInfo);
                head.appendChild(rating);

                const text = document.createElement('p');
                text.className = 'textofrew';
                text.textContent = review.comment;

                info.appendChild(head);
                info.appendChild(text);

                item.appendChild(info);
                listContainer.appendChild(item);
            });

            leftArrows.style.opacity = currentIndex === 0 ? 0.3 : 1;
            leftArrows.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

            rightArrows.style.opacity = currentIndex + visibleCounts >= reviews.length ? 0.3 : 1;
            rightArrows.style.pointerEvents = currentIndex + visibleCounts >= reviews.length ? 'none' : 'auto';
        }

        rightArrows.addEventListener('click', () => {
            if (currentIndex + visibleCounts < reviews.length) {
                currentIndex += visibleCounts;
                renderReviews();
            }
        });

        leftArrows.addEventListener('click', () => {
            if (currentIndex - visibleCounts >= 0) {
                currentIndex -= visibleCounts; 
                renderReviews();
            }
        });

        renderReviews();

        const logo = document.getElementById('logo');
        logo.addEventListener('click', () => {
            window.location.href = '/all_HTML/main.html'; 
        });

        document.querySelectorAll('.item-of-navigation').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 

                const text = link.textContent?.trim();
                let targetSection = null;

                switch(text){
                    case "Фотографии":
                        targetSection = document.querySelector('.photos');
                        break;
                    case "История":
                        targetSection = document.querySelector('.history');
                        break;
                    case "Рекомендации к посещению":
                        targetSection = document.querySelector('.recomendation');
                        break;
                    case "Ссылка на ЮНЕСКО":
                        targetSection = document.querySelector('.linktounesco');
                        break;
                    case "Отзывы":
                        targetSection = document.querySelector('.reviews');
                        break;
                }

                if(targetSection){
                    const yOffset = -60;
                    const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });


    }
    catch (err) {
        console.error("Ошибка:", err);
    }

     const favouriteBtn = document.querySelector(".favourite");
    const heartImg = favouriteBtn.querySelector(".pic");

    let favorites = [];
    try {
        const response = await fetch(`https://localhost:7156/api/Favorites/user?userLogin=${encodeURIComponent(userLogin)}`);
        if (response.ok) favorites = await response.json(); 
    } catch (err) {
        console.error("Ошибка при загрузке избранного", err);
    }

    heartImg.src = favorites.includes(monumentName) ? "/all_pictures/full_heart.png" : "/all_pictures/heart.png";

favouriteBtn.addEventListener("click", async () => {

    if (!userLogin || userLogin.trim() === "") {
        window.location.href = "/all_HTML/registrationform.html";
        return;
    }

    const isFav = heartImg.src.includes("full_heart.png");

    if (!isFav) {
        await fetch(
            `https://localhost:7156/api/Favorites/addByName?userLogin=${encodeURIComponent(userLogin)}&monumentName=${encodeURIComponent(monumentName)}`,
            { method: "POST" }
        );

        heartImg.src = "/all_pictures/full_heart.png";
        favorites.push(monumentName);
    } else {
        await fetch(
            `https://localhost:7156/api/Favorites/removeByName?userLogin=${encodeURIComponent(userLogin)}&monumentName=${encodeURIComponent(monumentName)}`,
            { method: "DELETE" }
        );

        heartImg.src = "/all_pictures/heart.png";
        favorites = favorites.filter(name => name !== monumentName);
    }
});
});



window.addEventListener("load", async () => {
    const loader = document.getElementById("svgLoader");
    const main = document.querySelector(".main");

    main.style.display = "none";
    main.style.opacity = "0";

    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = decodeURIComponent(value || "");
        return acc;
    }, {});

    const userLogin = cookies.userLogin;
    const registrationLink = document.querySelector(".registration a");
    if (userLogin && userLogin.trim() !== "") {
        registrationLink.textContent = userLogin;
        registrationLink.href = "/all_HTML/profile.html";
    }

    const monumentName = cookies["selectedMonument"];
    if (!monumentName) return;

    try {
        const response = await fetch(
            `https://localhost:7156/api/MonumentDetails/${encodeURIComponent(monumentName)}`
        );
        const data = await response.json();

    } catch (error) {
        console.error(error);
    }

    loader.style.transition = "opacity 2s ease";
    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
        main.style.display = "flex";
        requestAnimationFrame(() => main.style.opacity = "1");
    }, 2000);
});

