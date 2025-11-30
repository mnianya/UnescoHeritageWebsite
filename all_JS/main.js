window.addEventListener("load", async () =>  {
    const loader = document.getElementById("svgLoader");
    const intro = document.getElementById("intro");
    const flash = document.getElementById("flash");
    const main = document.getElementById("main");

    const lastPlayed = localStorage.getItem("animationPlayedAt");
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    if (lastPlayed && now - parseInt(lastPlayed) < DAY) {
        loader.style.display = "flex";

        intro.classList.add("hidden");
        flash.classList.add("hidden");
        main.classList.remove("hidden");

        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
                main.style.display = "block";
                requestAnimationFrame(() => main.style.opacity = "1");
            }, 1500);
        }, 1000);

        startSlider();
    }
    else {
        loader.style.display = "none";
        intro.classList.remove("hidden");
        main.classList.remove("hidden");

        typeText();

        const originalShowFinalText = showFinalText;
        showFinalText = function () {
            originalShowFinalText();

            const loader = document.getElementById("svgLoader");
            const intro = document.getElementById("intro");
            const main = document.getElementById("main");

            localStorage.setItem("animationPlayedAt", Date.now().toString());

            intro.classList.add("hidden");

            main.style.display = "block";
            requestAnimationFrame(() => {
                main.style.opacity = "1";
            });

            startSlider();
        };
    }

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

    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`https://localhost:7156/api/DailyMonuments?date=${today}`);
        if (!response.ok) throw new Error("Ошибка при получении данных");

        const monuments = await response.json();
        const listContainer = document.getElementById("monumentsList");
        listContainer.innerHTML = "";

        let favorites = [];
        if (userLogin) {
            const favResponse = await fetch(`https://localhost:7156/api/Favorites/user?userLogin=${encodeURIComponent(userLogin)}`);
            if (favResponse.ok) favorites = await favResponse.json(); 
        }

        if (!monuments || monuments.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-collection-message";
    emptyMsg.textContent = "Пока нет коллекции";
    listContainer.appendChild(emptyMsg);
} else {
    monuments.forEach(mon => {
        const imgUrl = mon.photo.startsWith("data:image") 
            ? mon.photo 
            : `data:image/jpeg;base64,${mon.photo}`;

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
                    <p class="citycon">${mon.city}</p>
                    <p class="namecon">${mon.name}</p>
                </div>
            </div>
            <div class="but">
                <img src="${isFavorite ? '/all_pictures/full_heart.png' : '/all_pictures/heart.png'}" alt="" class="butcon">
            </div>
        `;

        listContainer.appendChild(card);
    });
}

        const responses = await fetch("https://localhost:7156/api/Reviews/latest3");
        if (!responses.ok) throw new Error("Ошибка при получении отзывов");
        const reviews = await responses.json(); 

        const reviewsContainer = document.querySelector(".listofrevies");
        reviewsContainer.innerHTML = "";      

        reviews.forEach(rev => {
           const ratingStars = [...Array(5)]
        .map((_, i) => {
          return `<img src="/all_pictures/star.svg" class="star${i < rev.rating ? ' active' : ''}" alt="">`;
        })
        .join('');

          const reviewDiv = document.createElement("div");
          reviewDiv.className = "tipofrew";

          reviewDiv.innerHTML = `
            <div class="imgoftip">
              <img src="${rev.photoUrl || '/all_pictures/pic_rewis.png'}" class="imgofrewis" alt="Фото памятника">
            </div>
            <div class="contentofrew">
              <div class="conetnt-width">
                <a class="linktodest">${rev.monumentName}</a>
                <p class="textofrew">${rev.comment}</p>
                <div class="authorandstars">
                  <div class="infoofperson">
                    <div class="photoofperson" style="background-image: url('${rev.userPhoto || '/all_pictures/default.png'}');"></div>
                    <p class="loginogperson">${(userLogin && rev.userLogin === userLogin) ? "Вы" : rev.userLogin}</p>
                  </div>
                  <div class="reiting">
                     ${ratingStars}
                  </div>
                </div>
              </div>
            </div>
          `;

          reviewsContainer.appendChild(reviewDiv);
        });

        document.querySelectorAll(".linktodest").forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault(); // чтобы ссылка не открывала ничего
                const monumentName = link.textContent?.trim();
                if (monumentName) {
                    document.cookie = `selectedMonument=${encodeURIComponent(monumentName)}; path=/; max-age=${60*60*24*7}`;
                    console.log(`В cookie записан памятник из отзыва: ${monumentName}`);
                    window.location.href = "/all_HTML/destination.html";
                }
            });
        });

        document.querySelectorAll(".cardoflist").forEach(card => {
            card.addEventListener("click", () => {
                const monumentName = card.querySelector(".namecon")?.textContent?.trim();
                if (monumentName) {
                    document.cookie = `selectedMonument=${encodeURIComponent(monumentName)}; path=/; max-age=${60*60*24*7}`;
                    console.log(`В cookie записан памятник из отзыва: ${monumentName}`);
                    window.location.href = "/all_HTML/destination.html";
                }
            });
        });

        document.querySelectorAll(".butcon").forEach(heart => {
            heart.addEventListener("click", async (event) => {
                event.stopPropagation();
                const card = heart.closest(".cardoflist");
                const monumentName = card.querySelector(".namecon")?.textContent?.trim();
                document.cookie = `selectedMonument=${encodeURIComponent(monumentName)}; path=/; max-age=${60*60*24*7}`;

                if (!userLogin) {
                    window.location.href = "/all_HTML/registrationform.html";
                    return;
                }
                if (!monumentName) { alert("Памятник не выбран!"); return; }

                const isFavorite = heart.src.includes("/all_pictures/full_heart.png");
                if (!isFavorite) {
                    await fetch(`https://localhost:7156/api/Favorites/addByName?userLogin=${encodeURIComponent(userLogin)}&monumentName=${encodeURIComponent(monumentName)}`, { method: "POST" });
                    heart.src = "/all_pictures/full_heart.png";
                } else {
                    await fetch(`https://localhost:7156/api/Favorites/removeByName?userLogin=${encodeURIComponent(userLogin)}&monumentName=${encodeURIComponent(monumentName)}`, { method: "DELETE" });
                    heart.src = "/all_pictures/heart.png";
                }
            });
        });

    } catch (error) {
        console.error("Ошибка загрузки памятников дня:", error);
    }

      document.querySelectorAll('.item-of-navigation').forEach(link => {
          link.addEventListener('click', (e) => {

              const text = link.textContent?.trim();

              if (text === "Поиск") return;

              e.preventDefault(); 

              let targetSection = null;

              if(text === "О наследии") targetSection = document.getElementById('what-is-unesco');
              else if(text === "Карта объектов") targetSection = document.querySelector('.mapofdestin');
              else if(text === "Памятники дня") targetSection = document.querySelector('.monofday');
              else if(text === "Ваш след") targetSection = document.querySelector('.rewies');

              if(targetSection){
                  const yOffset = -60;
                  const y = targetSection.getBoundingClientRect().top
                          + window.pageYOffset
                          + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
              }
          });
      });

      const slides = document.querySelectorAll('.bg, .overlay');
      let loadedCount = 0;

      slides.forEach(img => {
          img.addEventListener('load', () => {
              loadedCount++;
              if (loadedCount === slides.length) {
                  document.querySelector('.slider').classList.add('loaded');
              }
          });

          if (img.complete) img.dispatchEvent(new Event('load'));
      });

      document.querySelector('.footer-photo')
      .style.backgroundImage = `url('/all_pictures/foother.png')`;
    
});


const text = "История людей и величие природы переплелись, а время связало их в единое полотно. В этих памятниках живут культура, вера и красота Земли — они хранят силу прошлого и напоминают о том, кем мы стали.";
const typedText = document.getElementById("typed-text");
let i = 0;

function typeText() {
  if (i < text.length) {
    typedText.textContent += text.charAt(i);
    i++;
    setTimeout(typeText, 50);
  } else {
    setTimeout(startFlashAnimation, 1000);
  }
}

function startFlashAnimation() {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("flash").classList.remove("hidden");

  const container = document.getElementById("flash-container");
  const images = [
    "/all_pictures/australia.png",
    "/all_pictures/china.png",
    "/all_pictures/egypt.png",
    "/all_pictures/mans.png",
    "/all_pictures/petra.png",
    "/all_pictures/piza.png",
    "/all_pictures/rome.png",
    "/all_pictures/taj_mahal.png",
    "/all_pictures/waterfall.png",
    "/all_pictures/waterfall2.png"
  ];

  const positions = [
    { top: 50, left: 50 },
    { top: 220, left: 700 },
    { top: 60, left: 1220 },
    { top: 280, left: 250 },
    { top: 400, left: 870 },
    { top: 150, left: 50 },
    { top: 480, left: 500 },
    { top: 450, left: 1300 },
    { top: 150, left: 300 },
    { top: 280, left: 940 },
  ];

  let index = 0;

  function flashStep() {
    if (index >= images.length) {
      setTimeout(showFinalText, 500);
      return;
    }

    const img = document.createElement("img");
    img.src = images[index];
    img.style.top = positions[index].top + "px";
    img.style.left = positions[index].left + "px";
    index++;

    container.appendChild(img);

    requestAnimationFrame(() => {
      img.style.opacity = 1;
      img.style.transform = "scale(1.05)";
    });

    setTimeout(() => {
      img.style.opacity = 0;
      img.style.transform = "scale(1)";
      setTimeout(() => img.remove(), 200);
    }, 200);

    setTimeout(flashStep, 400);
  }

  flashStep();
}

function showFinalText() {
  const flash = document.getElementById("flash");
  const main = document.getElementById("main");
  const typedText = document.getElementById("type-text");

  typedText.style.display = "block";   
  main.classList.remove("hidden"); 
  flash.classList.remove("hidden");
  flash.style.zIndex = "1000";    

  setTimeout(() => {
    flash.style.transition = "transform 1.5s ease";
    flash.style.transform = "translateY(-100%)";
  }, 2000);

  setTimeout(() => {
    flash.style.display = "none";
    startSlider();
    localStorage.setItem("animationPlayed", "true");
  }, 3500);
}


function startSlider() {
  const backLayer = document.querySelector(".back-layer");
  const frontLayer = document.querySelector(".front-layer");
  const dots = Array.from(document.querySelectorAll(".dot"));

  const backSlides = backLayer.querySelectorAll(".bg");
  const frontSlides = frontLayer.querySelectorAll(".overlay");

  const total = Math.min(backSlides.length, frontSlides.length, dots.length);
  if (total === 0) return;

  let current = 0;
  let intervalId = null;
  const INTERVAL = 5000;

  const backFirstClone = backSlides[0].cloneNode(true);
  const frontFirstClone = frontSlides[0].cloneNode(true);

  backLayer.appendChild(backFirstClone);
  frontLayer.appendChild(frontFirstClone);

  let slideCount = total + 1; 

  function updateLayersPosition(index, animate = true) {
    const shift = `translateX(-${index * 100}%)`;
    if (!animate) {
      backLayer.style.transition = "none";
      frontLayer.style.transition = "none";
    } else {
      backLayer.style.transition = "transform 0.8s ease";
      frontLayer.style.transition = "transform 0.8s ease";
    }
    backLayer.style.transform = shift;
    frontLayer.style.transform = shift;
  }

  function updateDots(index) {
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function showSlide(index) {
    updateLayersPosition(index);
    updateDots(index % total); 
    current = index;
  }

  function nextSlide() {
    current++;
    updateLayersPosition(current);
    updateDots(current % total); 
  }

  function handleLoop() {
    if (current === slideCount - 1) {
      current = 0;
      updateLayersPosition(current, false);
      updateDots(current);
    }
  }

  backLayer.addEventListener("transitionend", handleLoop);
  frontLayer.addEventListener("transitionend", handleLoop);

  function start() {
    stop();
    intervalId = setInterval(nextSlide, INTERVAL);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
      start();
    });
  });

  showSlide(0);
  start();

}
