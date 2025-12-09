/* ============================================================
   2.1 ЗМІНА СТИЛЮ НАЗВ ПОДІЙ
   ============================================================ */
const eventNames = document.querySelectorAll(".event-name");
eventNames.forEach(item => {
  item.style.color = "#6a1b9a";
});

/* ============================================================
   2.2 ПОТОЧНА ДАТА У ФУТЕРІ
   ============================================================ */
const footerDate = document.createElement("p");
footerDate.textContent = "Поточна дата: " + new Date().toLocaleDateString("uk-UA");
footerDate.style.marginTop = "8px";
document.querySelector("footer")?.append(footerDate);

/* ============================================================
   2.2 АКОРДЕОН "ПОКАЗАТИ БІЛЬШЕ"
   ============================================================ */
const accordionBtn = document.querySelector("#show-more-btn");
const hiddenText = document.querySelector("#hidden-text");

if (accordionBtn && hiddenText) {
  hiddenText.style.display = "none";
  accordionBtn.addEventListener("click", () => {
    const isHidden = hiddenText.style.display === "none";
    hiddenText.style.display = isHidden ? "block" : "none";
    accordionBtn.textContent = isHidden ? "Показати менше" : "Показати більше";
  });
}

/* ============================================================
   3.1 ЗМІНА ТЕМИ + LOCALSTORAGE
   ============================================================ */
const themeBtn = document.querySelector("#theme-btn");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark-theme") ? "dark" : "light"
    );
  });
}

/* ============================================================
   3.1 АВТОРИЗАЦІЯ (простий логін)
   ============================================================ */
const loginBtn = document.querySelector("#login-btn");

function updateLoginButton() {
  const username = localStorage.getItem("username");
  if (loginBtn) {
    loginBtn.textContent = username ? `Привіт, ${username}` : "Увійти";
  }
}
updateLoginButton();

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const current = localStorage.getItem("username");

    if (current) {
      if (confirm("Вийти з акаунта?")) {
        localStorage.removeItem("username");
        updateLoginButton();
      }
    } else {
      const name = prompt("Введіть ваше імʼя:");
      if (name && name.trim().length >= 3) {
        localStorage.setItem("username", name.trim());
        updateLoginButton();
      } else if (name !== null) {
        alert("Ім'я має містити мінімум 3 символи.");
      }
    }
  });
}

/* ============================================================
   3.2 ПІДСВІТКА МЕНЮ JS-КЛАСОМ
   ============================================================ */
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach(link => {
  link.addEventListener("mouseenter", () => link.classList.add("hovered"));
  link.addEventListener("mouseleave", () => link.classList.remove("hovered"));
});

/* ============================================================
   3.2 ЗМІНА РОЗМІРУ ШРИФТУ КЛАВІШАМИ
   ============================================================ */
let fontSize = 16;
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    fontSize++;
    document.body.style.fontSize = fontSize + "px";
  }
  if (e.key === "ArrowDown") {
    fontSize--;
    document.body.style.fontSize = fontSize + "px";
  }
});

/* ============================================================
   4.1 / 4.2 ВАЛІДАЦІЯ ФОРМИ
   ============================================================ */
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const messageInput = form.querySelector("#message");
    const resultBlock = document.querySelector("#form-result");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    nameInput.style.borderColor = "#ccc";
    emailInput.style.borderColor = "#ccc";
    messageInput.style.borderColor = "#ccc";
    resultBlock.innerHTML = "";

    let valid = true;

    if (name.length < 3) {
      valid = false;
      nameInput.style.borderColor = "red";
      resultBlock.innerHTML += "<p style='color:red;'>Ім'я має містити мінімум 3 символи.</p>";
    }

    if (!email.includes("@") || !email.includes(".")) {
      valid = false;
      emailInput.style.borderColor = "red";
      resultBlock.innerHTML += "<p style='color:red;'>Некоректний email.</p>";
    }

    if (message.length < 10) {
      valid = false;
      messageInput.style.borderColor = "red";
      resultBlock.innerHTML += "<p style='color:red;'>Повідомлення має містити мінімум 10 символів.</p>";
    }

    if (!valid) return;

    resultBlock.innerHTML = "<p style='color:green;'>Форма успішно надіслана!</p>";
    form.reset();
  });
}

/* ============================================================
   5.1 "ПОЧАТИ" — email-підписка (без слова "імітація")
   ============================================================ */
const startBtn = document.querySelector("#start-btn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const email = prompt("Введіть ваш email, щоб отримувати новини про події:");
    if (!email) return;

    if (!email.includes("@") || !email.includes(".")) {
      alert("Введіть коректний email.");
      return;
    }

    localStorage.setItem("subscriptionEmail", email);
    alert("Дякуємо! Ви підписані на оновлення.");
  });
}

/* ============================================================
   5.2 ДЕТАЛІ ПОДІЇ (кнопка "Деталі")
   ============================================================ */
const detailButtons = document.querySelectorAll(".details-btn");
detailButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".event-item, .card");
    const details = parent?.querySelector(".event-details");
    if (!details) return;

    const isHidden = details.style.display === "none" || details.style.display === "";
    details.style.display = isHidden ? "block" : "none";
    btn.textContent = isHidden ? "Сховати деталі" : "Деталі";
  });
});

/* ============================================================
   LOCALSTORAGE ДЛЯ "МОЇ ПОДІЇ"
   ============================================================ */
function getMyEvents() {
  try {
    const data = localStorage.getItem("myEvents");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveMyEvents(events) {
  localStorage.setItem("myEvents", JSON.stringify(events));
}

/* ============================================================
   🔧 АВТОФІКС — додаємо ID старим подіям
   ============================================================ */
(function autoFixEvents() {
  let events = getMyEvents();
  let changed = false;

  events = events.map(ev => {
    if (typeof ev !== "object" || ev === null) return ev;

    if (!ev.id) {
      ev.id = Date.now() + Math.floor(Math.random() * 10000);
      changed = true;
    }

    return ev;
  });

  if (changed) {
    console.log("Автофікс: додано відсутні ID для подій.");
    saveMyEvents(events);
  }
})();

/* ============================================================
   5.3 ДОДАВАННЯ ПОДІЙ У "Мої події"
   ============================================================ */
const addToMyButtons = document.querySelectorAll(".add-to-my-btn");
addToMyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".event-item, .card");
    if (!parent) return;

    const title = parent.querySelector(".event-name")?.textContent || "Подія";
    const meta = parent.querySelector(".event-meta")?.textContent || "";

    const events = getMyEvents();
    events.push({ id: Date.now(), title, meta });
    saveMyEvents(events);

    alert("Подію додано у 'Мої події'.");
  });
});

/* ============================================================
   5.4 ВІДОБРАЖЕННЯ + ВИДАЛЕННЯ З "Мої події"
   ============================================================ */
const myEventsList = document.querySelector("#my-events-list");
if (myEventsList) {

  function renderMyEvents() {
    const events = getMyEvents();

    if (events.length === 0) {
      myEventsList.innerHTML = "<p>Поки що у вас немає збережених подій.</p>";
      return;
    }

    myEventsList.innerHTML = "";
    events.forEach(ev => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3 class="event-name">${ev.title}</h3>
        <p class="event-meta">${ev.meta}</p>
        <button class="btn-outline delete-event-btn" data-id="${ev.id}">Видалити</button>
      `;
      myEventsList.append(card);
    });

    document.querySelectorAll(".delete-event-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);

        const events = getMyEvents().filter(ev => ev.id !== id);
        saveMyEvents(events);

        renderMyEvents();
      });
    });
  }

  renderMyEvents();
}
