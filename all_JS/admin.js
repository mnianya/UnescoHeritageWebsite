document.addEventListener("DOMContentLoaded", () => {const uploadInput = document.getElementById("uploadPhotos");
const addPhotosBtn = document.querySelector(".addphotos");
const imagesContainer = document.querySelector(".imagesall");
const saveBtn = document.querySelector(".save");

let photos = []; 

addPhotosBtn.addEventListener("click", () => uploadInput.click());

uploadInput.addEventListener("change", () => {
    const files = [...uploadInput.files];

    if (photos.length + files.length > 10) {
        alert("Максимум 10 фото!");
        return;
    }

    files.forEach(file => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            photos.push(base64);

            const preview = document.createElement("div");
            preview.classList.add("photo-preview");
            preview.innerHTML = `
                <img src="${base64}">
                <div class="remove-btn">×</div>
            `;

            preview.querySelector(".remove-btn").addEventListener("click", () => {
                const index = photos.indexOf(base64);
                if (index !== -1) photos.splice(index, 1);
                preview.remove();
                addPhotosBtn.disabled = false;
                addPhotosBtn.classList.remove("disabled");
            });

            imagesContainer.appendChild(preview);

            if (photos.length >= 10) {
                addPhotosBtn.disabled = true;
                addPhotosBtn.classList.add("disabled");
            }
        };
        reader.readAsDataURL(file);
    });

    uploadInput.value = "";
});

function validateForm() {
    const name = document.querySelector(".name").value.trim();
    const country = document.getElementById("countrySearch").value.trim();
    const city = document.querySelector(".city").value.trim();
    const category = document.getElementById("category").value;
    const link = document.querySelector(".link").value.trim();
    const desc = document.querySelector(".descrip").value.trim();
    const rec = document.querySelector(".recomendation").value.trim();
    const history = document.querySelector(".history").value.trim();

    if (!name || !country || !city || !link || !desc || !rec || !history || !category) {
        alert("Заполните все поля!");
        return false;
    }

    if (category === "") {
        alert("Выберите категорию!");
        return false;
    }

    if (photos.length === 0) {
        alert("Добавьте хотя бы одну фотографию!");
        return false;
    }

    return {
        Name: name,
        City: city,
        ShortDescription: desc,
        History: history,
        VisitRecommendations: rec,
        UnescoLink: link,
        CountryName: country,
        CategoryName: category,
        PhotosBase64: photos
    };
}

saveBtn.addEventListener("click", async () => {
    const data = validateForm();
    if (!data) return;

    saveBtn.disabled = true;

    try {
        const response = await fetch("https://localhost:7156/api/MonumentDetails/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Памятник успешно добавлен!");

            document.querySelector(".name").value = "";
            document.getElementById("countrySearch").value = "";
            document.querySelector(".city").value = "";
            document.getElementById("category").selectedIndex = 0;
            document.querySelector(".link").value = "";
            document.querySelector(".descrip").value = "";
            document.querySelector(".recomendation").value = "";
            document.querySelector(".history").value = "";
            imagesContainer.innerHTML = "";
            photos = [];
            addPhotosBtn.disabled = false;
            addPhotosBtn.classList.remove("disabled");
        } else {
            alert(" Ошибка при добавлении памятника");
        }
    } catch (err) {
        alert(" Ошибка соединения с сервером");
    } finally {
        saveBtn.disabled = false;
    }
});

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
   'Ямайка','Япония']; 
    
    const searchInput = document.getElementById("countrySearch");
    const countryList = document.getElementById("countryList");

    // Поиск по странам
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


    document.querySelectorAll('.item-of-navigation').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const text = link.textContent.trim();
            let targetSection = null;

            if(text === "Добавить памятник") 
                targetSection = document.querySelector('.add_dest');
            else if(text === "Изменить памятник") 
                targetSection = document.querySelector('.change_dest');
            else if(text === "Создать коллекцию дня") 
                targetSection = document.querySelector('.add_collec');
            else if(text === "Удалить коллекцию дня") 
                targetSection = document.querySelector('.removecolle');
            else if(text === "Управление отзывами") 
                targetSection = document.querySelector('.rewirs');

            if(targetSection){
                const yOffset = -60;
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    document.querySelector('.footer-photo')
  .style.backgroundImage = `url('/all_pictures/adminfoo.png')`;

// ====== Элементы ======
const monumentSearch = document.getElementById('monumentSearch');
const monumentList = document.getElementById('monumentList');

const inputName = document.getElementById('name');
const inputCity = document.getElementById('city');
const inputCountry = document.getElementById('countrySearchs');
const inputCategory = document.getElementById('categorys');
const inputLink = document.getElementById('link');
const inputDescrip = document.getElementById('desc');
const inputRecomendation = document.getElementById('recom');
const inputHistory = document.getElementById('hist');
const imagesAll = document.getElementById('imageshere');

// ====== Автодополнение ======
monumentSearch.addEventListener('input', async () => {
    const query = monumentSearch.value.trim();
    if (!query) {
        monumentList.innerHTML = '';
        monumentList.classList.add('hidden');
        return;
    }

    try {
        const response = await fetch(`https://localhost:7156/api/MonumentDetails/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        const monuments = data.monuments;

        monumentList.innerHTML = monuments.map(m => `<li data-id="${m.monumentId}">${m.name}</li>`).join('');
        monumentList.classList.remove('hidden');
    } catch (err) {
        console.error('Ошибка поиска памятников:', err);
    }
});

// ====== Выбор памятника ======
monumentList.addEventListener('click', async (e) => {
    if (e.target.tagName === 'LI') {
        const monumentName = e.target.textContent;
        monumentSearch.value = monumentName;
        monumentList.classList.add('hidden');

        try {
            const response = await fetch(`https://localhost:7156/api/MonumentDetails/${encodeURIComponent(monumentName)}`);
            const data = await response.json();

            // ====== Заполняем поля ======
            inputName.value = data.name || '';
            inputCity.value = data.city || '';
            inputCountry.value = data.countryName || '';

            // ====== Категория ======
            if (data.categoryName) {
                Array.from(inputCategory.options).forEach(opt => {
                    opt.selected = (opt.value === data.categoryName);
                });
            } else {
                inputCategory.selectedIndex = 0; // Сбрасываем выбор, если нет категории
            }

            inputLink.value = data.unescoLink || '';
            inputDescrip.value = data.shortDescription || '';
            inputRecomendation.value = data.visitRecommendations || '';
            inputHistory.value = data.history || '';

            // ====== Загружаем фотографии ======
            imagesAll.innerHTML = '';
            if (data.photos && data.photos.length > 0) {
                data.photos.forEach(url => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'photo-preview';

                    const img = document.createElement('img');
                    img.src = url;
                    wrapper.appendChild(img);

                    const removeBtn = document.createElement('div');
                    removeBtn.className = 'remove-btn';
                    removeBtn.textContent = '×';
                    removeBtn.addEventListener('click', () => wrapper.remove());
                    wrapper.appendChild(removeBtn);

                    imagesAll.appendChild(wrapper);
                });
            }

        } catch (err) {
            console.error('Ошибка получения данных памятника:', err);
        }
    }
});

document.addEventListener('click', (e) => {
    if (!monumentSearch.contains(e.target) && !monumentList.contains(e.target)) {
        monumentList.classList.add('hidden');
    }
});

const saveBtnnw = document.querySelector('.saves');

saveBtnnw.addEventListener('click', async () => {
    const name = inputName.value.trim();
    const city = inputCity.value.trim();
    const countryName = inputCountry.value.trim();
    const categoryName = inputCategory.value;
    const link = inputLink.value.trim();
    const shortDescription = inputDescrip.value.trim();
    const visitRecommendations = inputRecomendation.value.trim();
    const history = inputHistory.value.trim();

    // ====== Проверка обязательных полей ======
    if (!name || !city || !countryName || !categoryName || !shortDescription || !history) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    // ====== Фотографии ======
    const photoUrls = Array.from(imagesAll.querySelectorAll('img')).map(img => img.src);
    if (photoUrls.length < 3) {
        alert('Загрузите минимум 3 фотографии.');
        return;
    }

    // ====== Формируем DTO ======
    const dto = {
        name,
        city,
        countryName,
        categoryName,
        unescoLink: link,
        shortDescription,
        visitRecommendations,
        history,
        photosBase64: photoUrls // Можно использовать base64 или url, в зависимости от API
    };

    try {
        const response = await fetch('https://localhost:7156/api/MonumentDetails/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
});

        const data = await response.json();
        if (response.ok) {
            alert('Памятник успешно обновлён!');
            inputName.value = '';
            inputCity.value = '';
            inputCountry.value = '';
            inputCategory.value = '';
            inputLink.value = '';
            inputDescrip.value = '';
            inputRecomendation.value = '';
            inputHistory.value = '';
            imagesAll.innerHTML = '';
            monumentSearch.value = '';
            monumentSearch.dataset.id = '';
        } else {
            alert('Ошибка обновления: ' + data.message);
        }
    } catch (err) {
        console.error('Ошибка при обновлении памятника:', err);
    }
});

const inputs = [
    document.getElementById('monument1'),
    document.getElementById('monument2'),
    document.getElementById('monument3')
];

const dropdowns = [
    document.getElementById('dropdown1'),
    document.getElementById('dropdown2'),
    document.getElementById('dropdown3')
];

inputs.forEach((input, index) => {
    input.addEventListener('input', async () => {
        const query = input.value.trim();
        const dropdown = dropdowns[index];

        if (!query) {
            dropdown.innerHTML = '';
            dropdown.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch(`https://localhost:7156/api/MonumentDetails/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            const monuments = data.monuments;

            // Фильтруем уже выбранные памятники в других input
            const selectedNames = inputs.map(i => i.value.trim()).filter(n => n && n !== query);
            const filtered = monuments.filter(m => !selectedNames.includes(m.name));

            dropdown.innerHTML = filtered.map(m => `<li data-id="${m.monumentId}">${m.name}</li>`).join('');
            dropdown.classList.remove('hidden');
        } catch (err) {
            console.error('Ошибка поиска памятников:', err);
        }
    });

    // Выбор памятника
    dropdowns[index].addEventListener('click', async e => {
        if (e.target.tagName === 'LI') {
            input.value = e.target.textContent;
            dropdowns[index].classList.add('hidden');
        }
    });
});

// Скрытие dropdown при клике вне input
document.addEventListener('click', e => {
    inputs.forEach((input, idx) => {
        if (!input.contains(e.target) && !dropdowns[idx].contains(e.target)) {
            dropdowns[idx].classList.add('hidden');
        }
    });
});


document.querySelector('.saveall').addEventListener('click', async () => {
    const names = inputs.map(input => input.value.trim());
    const date = document.querySelector('.data').value;

    // Проверка заполнения
    if (names.some(n => !n) || !date) {
        alert('Пожалуйста, заполните все поля и дату.');
        return;
    }

    try {
        const response = await fetch('https://localhost:7156/api/DailyMonuments/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ names, date })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Коллекция успешно создана!');
            // Очистка
            inputs.forEach(input => input.value = '');
            document.querySelector('.data').value = '';
            loadCollections();
        } else {
            alert('Ошибка: ' + data.message);
        }
    } catch (err) {
        console.error(err);
    }
});


const table = document.querySelector(".collectremove");
let selectedCollectionId = null;

// ✅ Загрузка коллекций в таблицу
async function loadCollections() {
    try {
        const response = await fetch("https://localhost:7156/api/DailyMonuments/all");
        const collections = await response.json();

        // Удаляем старые строки, кроме заголовков
        table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

        collections.forEach(c => {
            const row = document.createElement("tr");
            row.dataset.id = c.collectionId;

            const [m1, m2, m3] = c.monuments;

            row.innerHTML = `
                <td>${m1 || "-"}</td>
                <td>${m2 || "-"}</td>
                <td>${m3 || "-"}</td>
                <td>${new Date(c.date).toLocaleDateString()}</td>
            `;

            row.addEventListener("click", () => selectRow(row));

            table.appendChild(row);
        });
    } catch (err) {
        console.error("Ошибка загрузки:", err);
    }
}

// ✅ Выбор строки
function selectRow(row) {
    table.querySelectorAll("tr").forEach(tr => tr.classList.remove("selected-row"));
    row.classList.add("selected-row");
    selectedCollectionId = row.dataset.id;
}

// ✅ Удаление коллекции
document.querySelector(".remove").addEventListener("click", async () => {
    if (!selectedCollectionId) {
        alert("Выберите коллекцию для удаления!");
        return;
    }

    if (!confirm("Точно удалить коллекцию?")) return;

    try {
        const response = await fetch(`https://localhost:7156/api/DailyMonuments/${selectedCollectionId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Коллекция удалена!");
            loadCollections();
            selectedCollectionId = null;
        } else {
            alert("Ошибка при удалении");
        }
    } catch (err) {
        console.error("Ошибка удаления:", err);
    }
});

// ✅ Загружаем при старте
loadCollections();

const tables = document.querySelector(".rewiesremove");
let selectedReviewId = null;

async function loadReviews() {
    const response = await fetch("https://localhost:7156/api/Reviews/all");
    const reviews = await response.json();

    console.log(reviews)

    // Удаляем старые строки (кроме заголовков)
    tables.querySelectorAll("tr:not(:first-child)").forEach(tr => tr.remove());

    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.querySelector(".close");

    closeBtn.onclick = () => modal.style.display = "none";
        reviews.forEach(r => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${r.userLogin}</td>
                <td>${r.rating}</td>
                <td>${r.monumentName}</td>
                <td>${r.comment}</td>
            <td>
                    ${
                        r.photoUrls
                            ? `<a href="#" class="photo-link">Фото</a>`
                            : "—"
                    }
                </td>
                <td>${formatDate(r.publishDate)}</td>
            `;

            row.addEventListener("click", () => {
                tables.querySelectorAll("tr").forEach(tr => tr.classList.remove("selected"));
                row.classList.add("selected");
                selectedReviewId = r.reviewId;
            });

            
            
    // ✅ просмотр фото
        const img = row.querySelector(".photo-link");
        if (img) {
            img.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
            modal.style.display = "flex";
        modalImg.src = r.photoUrls;
            });
        }

            tables.appendChild(row);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        let day = date.getDate().toString().padStart(2, "0");
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    loadReviews();

    document.querySelector(".remove_rew").addEventListener("click", async () => {
        if (!selectedReviewId) {
            alert("Выберите отзыв!");
            return;
        }

        const response = await fetch(`https://localhost:7156/api/Reviews/${selectedReviewId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Отзыв удалён!");
            loadReviews(); // обновляем таблицу
            selectedReviewId = null;
        } else {
            alert("Ошибка при удалении");
        }
    });

    document.querySelector(".exit").addEventListener("click", () => {
        // ✅ Очистка куки
        document.cookie = "userLogin=; path=/; max-age=0; SameSite=Lax";

        // ✅ Переход на главную страницу
        window.location.href = "/all_HTML/main.html";
    });
});