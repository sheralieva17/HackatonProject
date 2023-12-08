document.addEventListener("DOMContentLoaded", function () {
  const API = "http://localhost:8080/products";
  let data = [];
  const addProductModal = document.getElementById("addProductModal");
  const sectionProducts = document.querySelector(".sectionProducts");
  const inpName = document.getElementById("inpName");
  const inpPrice = document.getElementById("inpPrice");
  const inpImage = document.getElementById("inpImage");
  const inpAddress = document.getElementById("inpAddress");
  const btnAdd = document.querySelector(".btnAdd");
  const slides = document.querySelectorAll(".slide");
  const details = document.querySelector(".details");
  // Находите иконку сердечка
  const favouritedIcon = document.getElementById("favourited");

  let currentSlide = 0;
  let currentPage = 1;
  let countPage = 1;
  //Кнопки для пагинации
  let prevBtn = document.querySelector(".prevBtn");
  let nextBtn = document.querySelector(".nextBtn");
  let searchValue = "";
  const prevButton = document.querySelector(".prev-slide");
  const nextButton = document.querySelector(".next-slide");

  const addCartButtons = document.querySelectorAll(
    ".detailsCard button.detailsCard"
  );

  //!Main pagination=======================================
  // Скрыть все слайды
  function hideSlides() {
    slides.forEach((slide) => {
      slide.style.display = "none"; // Устанавливаем стиль display в "none" для каждого слайда, скрывая их
    });
  }
  // Показать текущий слайд
  function showSlide(index) {
    hideSlides(); // Сначала скрываем все слайды
    slides[index].style.display = "flex"; // Затем показываем текущий слайд, устанавливая стиль display в "flex"
  }

  // Переключение на предыдущий слайд
  function prevSlide() {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1; // Проверяем, если текущий слайд первый, то устанавливаем currentSlide на последний слайд, иначе уменьшаем на 1
    showSlide(currentSlide); // Показываем предыдущий слайд
  }

  // Переключение на следующий слайд
  function nextSlide() {
    currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1; // Проверяем, если текущий слайд последний, то устанавливаем currentSlide на первый слайд, иначе увеличиваем на 1
    showSlide(currentSlide); // Показываем следующий слайд
  }

  // События кнопок для переключения слайдов
  prevButton.addEventListener("click", prevSlide); // Добавляем обработчик события "click" на кнопку prevButton, чтобы переключаться на предыдущий слайд при клике
  nextButton.addEventListener("click", nextSlide); // Добавляем обработчик события "click" на кнопку nextButton, чтобы переключаться на следующий слайд при клике

  // Показать первый слайд при загрузке страницы
  showSlide(currentSlide);
  // Получаем ссылку на элементы DOM
  let closeBtn = document.getElementsByClassName("close")[0]; // Получаем первый элемент с классом "close"
  let addBtn = document.querySelector(".addBtn"); // Получаем элемент с классом "addBtn"
  let modal = document.querySelector("#addProductModal"); // Получаем элемент с id "addProductModal"

  // Открываем модальное окно при клике на кнопку "Добавить продукт"
  btnAdd.onclick = function () {
    modal.style.display = "block"; // Устанавливаем стиль отображения "block", чтобы показать модальное окно
  };

  // Закрываем модальное окно при клике на кнопку "Закрыть" (иконка X)
  closeBtn.onclick = function () {
    modal.style.display = "none"; // Устанавливаем стиль отображения "none", чтобы скрыть модальное окно
  };

  // Закрываем модальное окно при клике вне его области
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none"; // Если клик был вне модального окна, скрываем его
    }
  };

  // Добавляем обработчик события "click" на кнопку "Добавить"
  addBtn.addEventListener("click", () => {
    // Проверяем, заполнены ли все поля
    if (
      !inpName.value.trim() ||
      !inpPrice.value.trim() ||
      !inpImage.value.trim() ||
      !inpAddress.value.trim()
    ) {
      alert("Заполните все поля"); // Выводим сообщение, если не все поля заполнены
      return;
    }

    // Создаем новый объект с данными из инпутов
    let newProduct = {
      productName: inpName.value,
      productPrice: inpPrice.value,
      productImage: inpImage.value,
      productAddres: inpAddress.value,
    };

    creatProducts(newProduct); // Вызываем функцию для создания нового продукта
    readProducts(); // Вызываем функцию для чтения продуктов (возможно, это обновление списка продуктов)
  });
  //!====================CREATE=====================
  // Асинхронная функция для создания нового продукта
  async function creatProducts(product) {
    try {
      // Отправляем POST-запрос на сервер с данными о продукте
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8", // Устанавливаем заголовки запроса
        },
        body: JSON.stringify(product), // Преобразуем объект продукта в формат JSON и отправляем его в теле запроса
      });

      // Проверяем, успешно ли выполнен запрос
      if (!response.ok) {
        throw new Error("Ошибка при создании продукта"); // Выбрасываем ошибку, если запрос завершился неудачно
      }

      // Если запрос завершился успешно, очищаем значения полей ввода и скрываем модальное окно
      inpName.value = "";
      inpPrice.value = "";
      inpImage.value = "";
      inpAddress.value = "";
      modal.style.display = "none";

      // Вызываем функцию для обновления отображения продуктов после успешного создания нового продукта
      readProducts();
    } catch (error) {
      console.error("Ошибка:", error); // В случае ошибки выводим сообщение об ошибке в консоль
    }
  }
  //!==================READ====================================
  // Асинхронная функция для получения списка продуктов
  async function readProducts() {
    try {
      const response = await fetch(
        `${API}?q=${searchValue}&_page=${currentPage}&_limit=4`
      ); // Отправляем GET-запрос на сервер для получения списка продуктов с определенной пагинацией и параметрами поиска

      const data = await response.json(); // Получаем данные в формате JSON из ответа сервера

      // Очищаем содержимое элемента .sectionProducts перед добавлением новых продуктов
      sectionProducts.innerHTML = "";

      // Добавляем продукты на страницу
      data.forEach((item) => {
        sectionProducts.innerHTML += `
          <!-- Вывод информации о каждом продукте -->
          <div class="detailsCard card" style="width: 19rem">
            <img
              id="${item.id}"
              src="${item.productImage}"
              alt=""
              class="card-img-top detailsCard"
              style="height: 280px"
            />
  
            <div class="card-body">
            <button class="add-to-favorites" id="${item.id}">
            <img src="./images/heart.png" alt="" class="heart-icon" id="${item.id}">
          </button>
          
          <h5 class="card-title">${item.productName}</h5>
          <p class="card-text">${item.productPrice}</p>
          <span class="card-text">${item.productAddres}</span>

          <!-- Кнопки "Удалить", "Изменить", "Подробнее", "Добавить в корзину" -->
          <div>
            <button class="btn btn-outline-danger btnDelete" id="${item.id}">Delete</button>
            <button class="btn btn-outline-warning btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
            <button class="detailsCard btn btn btn-outline-warning">Details</button>
            <button class="detailsCard btn ">Add cart</button>
          </div>
        </div>
      </div>
    `;
      });

      pageFunc(); // Вызываем функцию для управления пагинацией
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error); // Выводим ошибку в консоль, если есть проблемы при получении продуктов
    }
  }

  readProducts(); // Вызываем функцию для отображения продуктов сразу после ее определения

  //!REGISTRATION==================================================
  const registrationIcon = document.getElementById("registrationIcon"); // Получаем ссылку на элемент с id "registrationIcon"
  const registrationModal = document.getElementById("registrationModal"); // Получаем ссылку на элемент с id "registrationModal"
  const closeBtn3 = document.querySelector(".close3"); // Получаем ссылку на первый элемент с классом "close3"

  // Обработчик события для кнопки закрытия модального окна
  closeBtn3.addEventListener("click", function () {
    closeRegistrationModal(); // Вызываем функцию для закрытия модального окна
  });

  // Обработчик события для иконки регистрации
  registrationIcon.addEventListener("click", function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки
    alert("Registration logic goes here!"); // Выводим сообщение с логикой регистрации (здесь можно добавить реальную логику)
  });

  // Функция для открытия модального окна регистрации
  function openRegistrationModal() {
    registrationModal.style.display = "block"; // Устанавливаем стиль отображения "block", чтобы показать модальное окно
  }

  // Функция для закрытия модального окна регистрации
  function closeRegistrationModal() {
    registrationModal.style.display = "none"; // Устанавливаем стиль отображения "none", чтобы скрыть модальное окно
  }

  // Обработчик события для открытия модального окна регистрации при клике на иконку регистрации
  registrationIcon.addEventListener("click", function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки
    openRegistrationModal(); // Вызываем функцию для открытия модального окна
  });

  const registrationForm = document.getElementById("registrationForm"); // Получаем ссылку на элемент с id "registrationForm"
  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию

    // Получаем значения из полей формы
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Сохраняем данные в локальное хранилище браузера
    localStorage.setItem("name", name);
    localStorage.setItem("address", address);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);

    closeRegistrationModal(); // Закрываем модальное окно после сохранения данных
  });

  //!================DELETE===============
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnDelete")) {
      // Проверяем, было ли нажатие на элемент с классом "btnDelete"
      let del_id = e.target.id; // Получаем id элемента, на который было совершено нажатие (id товара для удаления)

      fetch(`${API}/${del_id}`, {
        // Выполняем запрос к серверу для удаления товара по его id
        method: "DELETE", // Используем метод DELETE для удаления
      })
        .then(() => {
          readProducts(); // После успешного удаления товара, обновляем отображение списка продуктов
        })
        .catch((error) => {
          console.error("Ошибка при удалении:", error); // В случае возникновения ошибки выводим сообщение об ошибке в консоль
        });
    }
  });

  //!==============EDIT===================
  // Получаем ссылки на элементы DOM
  const editInpName = document.querySelector("#editInpName"); // Поле ввода для имени продукта при редактировании
  const editInpPrice = document.querySelector("#editInpPrice"); // Поле ввода для цены продукта при редактировании
  const editInpImage = document.querySelector("#editInpImage"); // Поле ввода для изображения продукта при редактировании
  const editInpAddress = document.querySelector("#editInpAddress"); // Поле ввода для адреса продукта при редактировании
  const editBtnSave = document.getElementById("editBtnSave"); // Кнопка "Сохранить изменения" при редактировании
  const editProductModal = document.getElementById("editProductModal"); // Модальное окно для редактирования продукта
  const editCloseBtn = editProductModal.querySelector(".close"); // Кнопка "Закрыть" в модальном окне редактирования

  // Обработчик события для кнопки "Редактировать" каждого продукта
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnEdit")) {
      // Проверяем, было ли нажатие на кнопку "Редактировать"
      const edit_id = e.target.id; // Получаем id продукта, который нужно редактировать

      // Получаем данные о продукте для редактирования
      fetch(`${API}/${edit_id}`)
        .then((res) => {
          return res.json(); // Преобразуем полученный ответ в формат JSON
        })
        .then((data) => {
          // Заполняем поля в модальном окне данными о продукте для редактирования
          editInpName.value = data.productName;
          editInpPrice.value = data.productPrice;
          editInpImage.value = data.productImage;
          editInpAddress.value = data.productAddress;
          editBtnSave.setAttribute("data-id", data.id); // Устанавливаем data-id для сохранения id редактируемого продукта
          editProductModal.style.display = "block"; // Отображаем модальное окно редактирования
        })
        .catch((error) => {
          console.error("Ошибка при загрузке данных:", error); // Обработка ошибки при получении данных для редактирования
        });
    }
  });

  // Обработчик события для кнопки "Закрыть" в модальном окне редактирования
  editCloseBtn.addEventListener("click", function () {
    editProductModal.style.display = "none"; // Скрываем модальное окно редактирования при клике на кнопку "Закрыть"
  });

  // Обработчик события для кнопки "Сохранить изменения" в модальном окне редактирования
  editBtnSave.addEventListener("click", function () {
    let id = editBtnSave.getAttribute("data-id"); // Получаем id редактируемого продукта
    let editedProduct = {
      productName: editInpName.value,
      productPrice: editInpPrice.value,
      productImage: editInpImage.value,
      productAddress: editInpAddress.value,
    };

    editProduct(editedProduct, id); // Вызываем функцию для редактирования продукта
    editProductModal.style.display = "none"; // Скрываем модальное окно после сохранения изменений
  });

  // Функция для редактирования продукта
  async function editProduct(editedProduct, id) {
    try {
      let res = await fetch(`${API}/${id}`, {
        method: "PATCH", // Используем метод PATCH для обновления данных продукта
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(editedProduct), // Отправляем данные для обновления в формате JSON
      });

      if (!res.ok) {
        throw new Error("Failed to edit the product"); // В случае неудачи выбрасываем ошибку
      }

      readProducts(); // Обновляем отображение продуктов после успешного редактирования
    } catch (error) {
      console.error("Error:", error); // Выводим сообщение об ошибке в случае возникновения ошибки
    }
  }

  readProducts(); // Вызываем функцию для начального отображения продуктов при загрузке страницы

  //!====================PAGINATION=======================
  function pageFunc() {
    fetch(`${API}?q=${searchValue}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // Рассчитываем количество страниц путем деления общего количества элементов на количество элементов на странице
        countPage = Math.ceil(data.length / 4); // Предполагается, что на каждой странице отображается по 4 элемента
      });
  }
  
  // Обработчик события для кнопки "Предыдущая страница"
  prevBtn.addEventListener("click", () => {
    // Проверяем, если текущая страница <= 1, то выходим из функции
    if (currentPage <= 1) return;
    currentPage--; // Уменьшаем номер текущей страницы
    readProducts(); // Обновляем отображение продуктов на новой странице
  });
  
  // Обработчик события для кнопки "Следующая страница"
  nextBtn.addEventListener("click", () => {
    // Проверяем, если текущая страница >= общему количеству страниц, то выходим из функции
    if (currentPage >= countPage) return;
    currentPage++; // Увеличиваем номер текущей страницы
    readProducts(); // Обновляем отображение продуктов на новой странице
  });
  

  //!======================Search========================
  // Получаем ссылки на элементы DOM
const searchIcon = document.getElementById("SearchIcon"); // Иконка поиска
const searchInput = document.getElementById("searchInput"); // Поле ввода для поиска

// Добавляем обработчик события при клике на иконку поиска
searchIcon.addEventListener("click", function () {
  searchInput.classList.toggle("active"); // При клике на иконку поиска переключаем класс "active" у поля ввода
});

// Добавляем обработчик события при вводе символов в поле поиска
searchInput.addEventListener("keyup", function () {
  searchValue = searchInput.value.toLowerCase(); // Приводим значение в поле поиска к нижнему регистру и сохраняем в переменную searchValue
});

// Добавляем обработчик события при вводе данных в поле поиска
searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value.trim(); // Обновляем переменную searchValue при вводе данных в поле поиска
  currentPage = 1; // Сбрасываем значение текущей страницы при начале нового поиска
  readProducts(); // Вызываем функцию для отображения продуктов на основе нового поискового запроса
});

  //!==========details=====================

  // Добавляем обработчик для родительского элемента, делегируем события от кнопок "Details"
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("detailsCard")) {
      const productId = event.target.id;
      // Вызываем функцию, которая показывает детали для выбранного продукта
      showProductDetails(productId);
    }
  });
  function displayDetails(data) {
    const detailsContainer = document.getElementById("detailsModalBody");

    if (data) {
      detailsContainer.innerHTML = `
      <div class="detailsCard card" style="width: 19rem">
      <img
        id="${data.id}"
        src="${data.productImage}"
        alt=""
        class="card-img-top detailsCard"
        style="height: 280px"
      />
      <div class="card-body">
        <h5 class="card-title">${data.productName}</h5>
        <p class="card-text">${data.productPrice}</p>
        <span class="card-text">${data.productAddress}</span>
        <div>
      `;

      document.getElementById("detailsModal").style.display = "block";
    } else {
      console.error("Details not available");
    }
  }

  // Функция для закрытия модального окна с деталями
  function closeModal() {
    document.getElementById("detailsModal").style.display = "none";
  }

  // Добавляем обработчик для родительского элемента, делегируем события от кнопок "Details"
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("detailsCard")) {
      const productId = event.target.id;
      // Вызываем функцию, которая показывает детали для выбранного продукта
      showProductDetails(productId);
    }
  });

  // Функция, которая отображает детали для выбранного продукта
  async function showProductDetails(productId) {
    try {
      const response = await fetch(`${API}/${productId}`);
      const data = await response.json();

      // Отобразить детали продукта в модальном окне или другом месте на странице
      displayDetails(data);
      console.log("Details for product:", data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }

  //!===========favorites===========
  // Обработчик события клика на кнопку "add-to-favorites"
  document.querySelectorAll(".add-to-favorites").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.id; // Получаем ID продукта из атрибута кнопки
      addToFavorites(productId); // Добавляем продукт в избранное
    });
  });

  function addToFavorites(productId) {
    let favorites = localStorage.getItem("favorites");

    if (!favorites) {
      favorites = [];
    } else {
      favorites = JSON.parse(favorites);
    }

    if (!favorites.includes(productId)) {
      favorites.push(productId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  // Функция для отображения избранных продуктов в модальном окне
  // Function to display favorite products
  function displayFavoritesModal() {
    const favorites = getFavorites(); // Retrieve favorite products from localStorage

    const favoritesListElement = document.getElementById("favoritesList"); // Assuming you have an element with this ID to display favorites

    // Clear the content before adding new information
    favoritesListElement.innerHTML = "";

    favorites.forEach((productId) => {
      // Assuming sectionProducts is defined and contains product information
      if (sectionProducts.hasOwnProperty(productId)) {
        const productData = sectionProducts[productId];

        if (productData) {
          const productHTML = `
            <div class="product">
              <h3>${productData.productName}</h3>
              <p>Price: ${productData.productPrice}</p>
              <img src="${productData.productImage}" alt="${productData.productName}" />
              <p>Address: ${productData.productAddress}</p>
            </div>
          `;

          favoritesListElement.innerHTML += productHTML;
        }
      }
    });

    console.log("Избранные продукты:", favorites);
  }

  // This section should be triggered by some user action, e.g., a click on a button to show favorites
  // For instance, assume there's a button or an element with the ID "showFavoritesButton"
  const showFavoritesButton = document.getElementById("favorites");
  showFavoritesButton.addEventListener("click", displayFavoritesModal);

  // Function to retrieve favorites from localStorage
  function getFavorites() {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  }

  //!=========================BASKET==============================
  // Выбор соответствующих элементов
  //   const basketIcon = document.getElementById("basket");
  //   const cartTab = document.querySelector(".cartTab");
  // Обработчик событий для отображения/скрытия корзины при клике на иконку корзины
  //   basketIcon.addEventListener("click", () => {
  //     cartTab.style.display = cartTab.style.display === "none" ? "block" : "none";
  //   });

  // Функция для добавления товаров в корзину
  //   function addToCart(product) {
  // Используем информацию о товаре, переданную в качестве аргумента функции
  // const { id: productId, name: productName, price: productPrice } = product;

  // Создание нового элемента товара в корзине
  //     const cartItem = document.createElement("div");
  //     cartItem.classList.add("cart-item");
  //     cartItem.innerHTML = `
  //     <p>${productName} - $${productPrice}</p>
  //     <button class="remove-from-cart" data-id="${productId}">Удалить</button>
  //   `;

  // Добавление элемента товара в корзину
  // const listCart = document.querySelector(".listCart");
  // listCart.appendChild(cartItem);

  // Добавление обработчика событий для удаления товара из корзины при нажатии на кнопку "Удалить"
  //     const removeFromCartButtons =
  //       document.querySelectorAll(".remove-from-cart");
  //     removeFromCartButtons.forEach((button) => {
  //       button.addEventListener("click", () => {
  //         button.parentElement.remove();
  //       });
  //     });
  //   }

  // Обработчик событий для добавления товаров в корзину при нажатии на кнопку "Add cart"
  //   addCartButtons.forEach((button) => {
  // button.addEventListener("click", () => {
  // Получение информации о товаре из родительского элемента кнопки или атрибутов данных
  //   const productElement = button.closest(".detailsCard");
  //   const productId = productElement.dataset.productId; // Предположим, что id товара хранится в dataset
  //   const productName =
  // productElement.querySelector(".product-name").innerText; // Предположим, что имя товара находится в элементе с классом .product-name
  //   const productPrice = parseFloat(
  // productElement
  //   .querySelector(".product-price")
  //   .innerText.replace("$", "")
  //   ); // Предположим, что цена товара находится в элементе с классом .product-price

  //       const productDetails = {
  //         id: productId,
  //         name: productName,
  //         price: productPrice,
  //       };

  //       addToCart(productDetails);
  //     });
  //   });

  // Обработчик событий для отображения/скрытия корзины при клике на иконку корзины
  //   basketIcon.addEventListener("click", () => {
  //     cartTab.classList.toggle("show-cart"); // Переключение видимости корзины
  //   });

  // Обработчик событий для закрытия корзины при нажатии на кнопку "CLOSE"
  //   const closeButton = document.querySelector(".closed");
  //   closeButton.addEventListener("click", () => {
  //     cartTab.classList.remove("show-cart");
  //   });

  // Обработчик событий для оформления заказа (вы можете добавить свою логику оформления заказа здесь)
  //   const checkoutButton = document.querySelector(".checkOut");
  //   checkoutButton.addEventListener("click", () => {
  // Реализуйте ваш процесс оформления заказа
  //   });
  //! Получение ссылок на элементы навигации
  const homeLink = document.querySelector('a[href="#home"]');
  const shopLink = document.querySelector('a[href="#shop"]');

  // Добавление обработчиков событий для ссылок
  homeLink.addEventListener("click", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки (переход по ссылке)

    // Прокручиваем страницу к секции Home
    document.querySelector("#home").scrollIntoView({
      behavior: "smooth", // Добавляем плавную прокрутку
    });
  });

  shopLink.addEventListener("click", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки (переход по ссылке)

    // Прокручиваем страницу к секции Shop
    document.querySelector("#shop").scrollIntoView({
      behavior: "smooth", // Добавляем плавную прокрутку
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const sectionId = this.getAttribute("href");
      document.querySelector(sectionId).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const sectionId = this.getAttribute("href");
      document.querySelector(sectionId).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
  //!===================contact us==========
  const contactForm = document.getElementById("contact");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    // Получаем ссылки на поля формы
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const messageField = document.getElementById("message");

    // Получаем значения из полей формы
    const username = usernameField.value;
    const password = passwordField.value;
    const message = messageField.value;

    // Сохраняем данные в localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localStorage.setItem("message", message);

    // Очистка содержимого формы
    usernameField.value = ""; // Очистка поля "Username"
    passwordField.value = ""; // Очистка поля "Password"
    messageField.value = ""; // Очистка поля "Message"
  });
});
