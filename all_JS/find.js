const registrationLink = document.querySelector(".registration a");
const cookies = document.cookie.split(";").reduce((acc, c) => {
    const [key, value] = c.trim().split("=");
    if (key && value) acc[key] = decodeURIComponent(value);
    return acc;
}, {});
const userLogin = cookies.userLogin;

if (userLogin && userLogin.trim() !== "") {
    registrationLink.textContent = userLogin;
    registrationLink.href = "/all_HTML/profile.html";
}

        const logo = document.getElementById('logo');
        logo.addEventListener('click', () => {
            window.location.href = '/all_HTML/main.html'; 
        });


document.querySelector('.footer-photo')
  .style.backgroundImage = `url('/all_pictures/findhead.png')`;

const countries = ['Австралия','Австрия','Азербайджан','Албания','Алжир','Ангола','Андорра',
   'Антигуа и Барбуда','Аргентина','Армения','Афганистан','Багамские Острова',
   'Бангладеш','Барбадос','Бахрейн','Беларусь','Белиз','Бельгия','Бенин',
   'Болгария','Боливия','Босния и Герцеговина','Ботсвана','Бразилия',
   'Бруней-Даруссалам','Буркина-Фасо','Бурунди','Бутан','Вануату','Ватикан',
   'Великобритания','Венгрия','Венесуэла','Вьетнам','Габон','Гаити','Гайана',
   'Гамбия','Гана','Гватемала','Гвинея','Гвинея-Бисау','Германия','Гондурас',
   'Греция','Грузия','Дания','Демократическая Республика Конго','Джибути',
   'Доминика','Доминиканская Республика','Египет','Замбия','Зимбабве','Израиль',
   'Индия','Индонезия','Иордания','Ирак','Иран','Ирландия','Исландия','Испания',
   'Италия','Йемен','Кабо-Верде','Казахстан','Камбоджа','Камерун','Канада','Катар',
   'Кения','Кипр','Кирибати','Китай','Колумбия','Коморы','Конго','Коста-Рика',
   'Кот-д’Ивуар','Куба','Кувейт','Кыргызстан','Лаос','Латвия','Лесото','Ливан',
   'Ливия','Литва','Лихтенштейн','Люксембург','Маврикий','Мавритания','Мадагаскар',
   'Македония','Малави','Малайзия','Мали','Мальдивы','Мальта','Марокко',
   'Маршалловы Острова','Мексика','Мозамбик','Молдавия','Монако','Монголия',
   'Мьянма','Намибия','Непал','Нигер','Нигерия','Нидерланды','Никарагуа',
   'Новая Зеландия','Норвегия','ОАЭ','Оман','Пакистан','Палау','Панама',
   'Папуа — Новая Гвинея','Парагвай','Перу','Польша','Португалия',
   'Республика Корея','Республика Конго','Республика Молдова','Россия','Руанда',
   'Румыния','Саудовская Аравия','Северная Корея','Северная Македония','Сейшелы',
   'Сенегал','Сент-Китс и Невис','Сент-Люсия','Сербия','Сингапур','Сирия',
   'Словакия','Словения','Соломоновы Острова','Судан','Суринам','США',
   'Таджикистан','Таиланд','Танзания','Того','Тунис','Туркменистан','Турция',
   'Уганда','Узбекистан','Украина','Уругвай','Фиджи','Филиппины','Финляндия',
   'Франция','Хорватия','ЦАР','Чад','Чехия','Чили','Швейцария','Швеция',
   'Шри-Ланка','Эквадор','Эритрея','Эстония','Эфиопия','ЮАР','Южная Корея',
   'Ямайка','Япония']; // ← ТВОЙ СПИСОК СТРАН
const searchInput = document.getElementById("countrySearch");
const countryList = document.getElementById("countryList");
const categorySelect = document.getElementById("category");
const findButton = document.querySelector(".find");
const listContainer = document.querySelector(".destinations_list");

async function loadFilteredMonuments() {
const countryName = searchInput.value.trim();
    const categoryName = categorySelect.value;

    let filterText = [];
    if (countryName) filterText.push(`Страна: ${countryName}`);
    if (categoryName) filterText.push(`Категория: ${categoryName}`);

    let url = "https://localhost:7156/api/MonumentDetails/filtered?";

    if (countryName) url += `countryName=${encodeURIComponent(countryName)}&`;
    if (categoryName) url += `categoryName=${encodeURIComponent(categoryName)}&`;

    const response = await fetch(url);
    const monuments = await response.json();

    listContainer.innerHTML = "";

    const filterInfo = document.querySelector(".current-filters");

    if (filterText.length > 0) {
        filterInfo.textContent = filterText.join(" | ");
        filterInfo.classList.remove("hidden");
    } else {
        filterInfo.classList.add("hidden");
    }

    searchInput.value = "";
    categorySelect.value = "";

    if (!response.ok || monuments.length === 0) {
        const msg = document.createElement("p");
        msg.className = "empty-collection-message";
        msg.textContent = "Ничего не найдено";
        listContainer.appendChild(msg);
        return;
    }

    let favorites = [];
    if (userLogin) {
        const favResponse = await fetch(`https://localhost:7156/api/Favorites/user?userLogin=${encodeURIComponent(userLogin)}`);
        if (favResponse.ok) favorites = await favResponse.json();
    }

    if (!monuments || monuments.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "empty-collection-message";
        emptyMsg.textContent = "Ничего не найдено";
        listContainer.appendChild(emptyMsg);
        return;
    }

    monuments.forEach(mon => {
        const imgUrl = mon.photoUrl || "/all_pictures/default.png";
        const isFavorite = favorites.includes(mon.name);

        const card = document.createElement("div");
        card.className = "cardoflist";
        card.style.backgroundImage = `url('${imgUrl}')`;
        card.style.backgroundRepeat = "no-repeat";
        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";

        card.innerHTML = `
            <div class="contentofcard">
                <div class="names">
                    <p class="citycon">${mon.city ?? ""}</p>
                    <p class="namecon">${mon.name}</p>
                </div>
            </div>
            <div class="but">
                <img src="${isFavorite ? '/all_pictures/full_heart.png' : '/all_pictures/heart.png'}" 
                     class="butcon">
            </div>
        `;

        listContainer.appendChild(card);
    });

    addCardEvents();
}

function addCardEvents() {
    document.querySelectorAll(".cardoflist").forEach(card => {
        card.addEventListener("click", () => {
            const name = card.querySelector(".namecon").textContent.trim();
            document.cookie = `selectedMonument=${encodeURIComponent(name)}; path=/; max-age=${60*60*24*7}`;
            window.location.href = "/all_HTML/destination.html";
        });
    });

    document.querySelectorAll(".butcon").forEach(heart => {
        heart.addEventListener("click", async (e) => {
            e.stopPropagation();
            const card = heart.closest(".cardoflist");
            const name = card.querySelector(".namecon").textContent.trim();

            if (!userLogin) {
                window.location.href = "/all_HTML/registrationform.html";
                return;
            }

            const isFavorite = heart.src.includes("full_heart");
            const url = isFavorite ?
                `https://localhost:7156/api/Favorites/removeByName?userLogin=${encodeURIComponent(userLogin)}&monumentName=${encodeURIComponent(name)}` :
                `https://localhost:7156/api/Favorites/addByName?userLogin=${encodeURIComponent(userLogin)}&monumentName=${encodeURIComponent(name)}`;

            await fetch(url, { method: isFavorite ? "DELETE" : "POST" });
            heart.src = isFavorite ? "/all_pictures/heart.png" : "/all_pictures/full_heart.png";
        });
    });
}

searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    countryList.innerHTML = "";

    const filtered = countries.filter(c => c.toLowerCase().includes(value));
    countryList.classList.toggle("hidden", filtered.length === 0);

    filtered.forEach(country => {
        const li = document.createElement("li");
        li.textContent = country;
        li.addEventListener("click", () => {
            searchInput.value = country;
            countryList.classList.add("hidden");
        });
        countryList.appendChild(li);
    });
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".country_dropdown")) {
        countryList.classList.add("hidden");
    }
});


findButton.addEventListener("click", loadFilteredMonuments);
