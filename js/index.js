document.addEventListener("DOMContentLoaded", function () {
  const API = "http://localhost:8080/products";
  let data = [];
  let btnBuy = document.querySelector(".btnBuy");
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
      slide.style.display = "none";
    });
  }
  // Показать текущий слайд
  function showSlide(index) {
    hideSlides();
    slides[index].style.display = "flex";
  }

  // Переключение на предыдущий слайд
  function prevSlide() {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    showSlide(currentSlide);
  }

  // Переключение на следующий слайд
  function nextSlide() {
    currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    showSlide(currentSlide);
  }

  // События кнопок для переключения слайдов
  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);

  // Показать первый слайд при загрузке страницы
  showSlide(currentSlide);

  let closeBtn = document.getElementsByClassName("close")[0];
  let addBtn = document.querySelector(".addBtn");
  let modal = document.querySelector("#addProductModal");

  // Открываем модальное окно при клике на кнопку "Добавить продукт"
  btnAdd.onclick = function () {
    modal.style.display = "block";
  };

  // Закрываем модальное окно при клике на кнопку "Закрыть" (иконка X)
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Закрываем модальное окно при клике вне его области
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  addBtn.addEventListener("click", () => {
    if (
      //Проверка на заполненность полей
      !inpName.value.trim() ||
      !inpPrice.value.trim() ||
      !inpImage.value.trim() ||
      !inpAddress.value.trim()
    ) {
      alert("Заполните все поля");
      return;
    }
    //Создаем новый обьект, куда добавляем значения наших инпутов(Создание новой книги)
    let newProduct = {
      productName: inpName.value,
      productPrice: inpPrice.value,
      productImage: inpImage.value,
      productAddres: inpAddress.value,
    };
    creatProducts(newProduct);
    readProducts();
  });
  //!================CREATE=================
  async function creatProducts(product) {
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании продукта");
      }

      // Убедимся, что запрос завершился успешно, затем очистим инпуты и обновим отображение продуктов
      inpName.value = "";
      inpPrice.value = "";
      inpImage.value = "";
      inpAddress.value = "";
      modal.style.display = "none";
      // Вызываем функцию для обновления отображения продуктов
      readProducts();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }
  //!=====================READ========================

  async function readProducts() {
    try {
      const response = await fetch(
        `${API}?q=${searchValue}&_page=${currentPage}&_limit=4`
      );
      const data = await response.json(); // Получение данных из db.json()

      // Очищаем содержимое элемента .sectionProducts
      sectionProducts.innerHTML = "";

      // Добавляем продукты
      data.forEach((item) => {
        sectionProducts.innerHTML += `
          <div class="detailsCard card" style="width: 19rem">
            <img
              id="${item.id}"
              src="${item.productImage}"
              alt=""
              class="card-img-top detailsCard"
              style="height: 280px"
            />

            <div class="card-body">
            <button class="add-to-favorites">
                <img src="./images/heart.png" alt="" class="heart-icon" id="${item.id}">

    </button>
              <h5 class="card-title">${item.productName}</h5>
              <p class="card-text">${item.productPrice}</p>
              <span class="card-text">${item.productAddres}</span>
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

      pageFunc(); // Вызываем функцию пагинации
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
    }
  }

  readProducts(); // Вызываем функцию для отображения продуктов

  //!REGISTRATION==================================================
  const registrationIcon = document.getElementById("registrationIcon");
  const registrationModal = document.getElementById("registrationModal");
  const closeBtn3 = document.querySelector(".close3");

  // Обработчик события для кнопки закрытия модального окна
  closeBtn3.addEventListener("click", function () {
    closeRegistrationModal();
  });
  registrationIcon.addEventListener("click", function (event) {
    event.preventDefault();
    alert("Registration logic goes here!");
  });

  function openRegistrationModal() {
    registrationModal.style.display = "block";
  }

  function closeRegistrationModal() {
    registrationModal.style.display = "none";
  }

  registrationIcon.addEventListener("click", function (event) {
    event.preventDefault();
    openRegistrationModal();
  });

  const registrationForm = document.getElementById("registrationForm");
  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    localStorage.setItem("name", name);
    localStorage.setItem("address", address);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);

    closeRegistrationModal();
  });

  //!================DELETE===============
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnDelete")) {
      let del_id = e.target.id;
      fetch(`${API}/${del_id}`, {
        method: "DELETE",
      })
        .then(() => {
          readProducts();
        })
        .catch((error) => {
          console.error("Ошибка при удалении:", error);
        });
    }
  });
  //!==============EDIT===================
  const editInpName = document.querySelector("#editInpName");
  const editInpPrice = document.querySelector("#editInpPrice");
  const editInpImage = document.querySelector("#editInpImage");
  const editInpAddress = document.querySelector("#editInpAddress");
  const editBtnSave = document.getElementById("editBtnSave");
  const editProductModal = document.getElementById("editProductModal");
  const editCloseBtn = editProductModal.querySelector(".close");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnEdit")) {
      const edit_id = e.target.id;
      fetch(`${API}/${edit_id}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          editInpName.value = data.productName;
          editInpPrice.value = data.productPrice;
          editInpImage.value = data.productImage;
          editInpAddress.value = data.productAddress;
          editBtnSave.setAttribute("data-id", data.id);
          editProductModal.style.display = "block"; // Отображение модального окна при получении данных для редактирования
        })
        .catch((error) => {
          console.error("Ошибка при загрузке данных:", error);
        });
    }
  });

  editCloseBtn.addEventListener("click", function () {
    editProductModal.style.display = "none";
  });

  // Обработчик события для кнопки "Save Changes" в модальном окне редактирования
  editBtnSave.addEventListener("click", function () {
    let id = editBtnSave.getAttribute("data-id");
    let editedProduct = {
      productName: editInpName.value,
      productPrice: editInpPrice.value,
      productImage: editInpImage.value,
      productAddress: editInpAddress.value,
    };
    editProduct(editedProduct, id);
    editProductModal.style.display = "none"; // Закрытие модального окна после сохранения изменений
  });

  async function editProduct(editedProduct, id) {
    try {
      let res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(editedProduct),
      });

      if (!res.ok) {
        throw new Error("Failed to edit the product");
      }

      // Обновляем отображение продуктов после успешного редактирования
      readProducts();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  readProducts();
  //!====================PAGINATION=======================
  function pageFunc() {
    fetch(`${API}?q=${searchValue}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        //записываем в переменную countPage = текушую страницу
        countPage = Math.ceil(data.length / 4);
      });
  }
  //
  prevBtn.addEventListener("click", () => {
    //проверяем на какой странице мы сейчас находимся
    if (currentPage <= 1) return;
    currentPage--;
    readProducts();
  });
  nextBtn.addEventListener("click", () => {
    if (currentPage >= countPage) return;
    currentPage++;
    readProducts();
  });

  // ! search
  const searchIcon = document.getElementById("SearchIcon");
  const searchInput = document.getElementById("searchInput");
  // Объявление переменной в более глобальной области видимости

  searchIcon.addEventListener("click", function () {
    searchInput.classList.toggle("active");
  });

  searchInput.addEventListener("keyup", function () {
    searchValue = searchInput.value.toLowerCase();
  });

  searchInput.addEventListener("input", (e) => {
    searchValue = e.target.value.trim();
    currentPage = 1; // Сбрасываем страницу при вводе нового запроса

    readProducts();
  });

  //!==========details=====================

  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("detailsCard")) {
      const productId = e.target.id;
      const data = await fetchDetails(productId);
      displayDetails(data);
    }
  });

  document.getElementById("closeModalBtn").addEventListener("click", () => {
    closeModal();
  });

  async function fetchDetails(id) {
    try {
      const response = await fetch(`${API}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching details:", error);
      return null;
    }
  }

  function displayDetails(data) {
    if (data) {
      // Update modal content
      detailsContainer.innerHTML = `
        <span class="close4" id="closeModalBtn">&times;</span>
        <img src="${data.productImage}" alt="" id="detailProductImage" />
        <h2 id="detailProductName">${data.productName}</h2>
        <span id="detailProductPrice">${data.productPrice}</span>
        <p id="detailProductAddress">${data.productAddres}</p>
      `;

      document.getElementById("detailsModal").style.display = "block";
    } else {
      console.error("Details not available");
    }
  }
  function closeModal() {
    document.getElementById("detailsModal").style.display = "none";
  }
  closeModal();
  //!===========favorites===========
  function addToFavorites(productId) {
    let favorites = localStorage.getItem("favorites");

    if (!favorites) {
      favorites = [];
    } else {
      favorites = JSON.parse(favorites);
    }

    // Проверяем, есть ли уже такой продукт в избранном
    if (!favorites.includes(productId)) {
      favorites.push(productId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function removeFromFavorites(productId) {
    let favorites = localStorage.getItem("favorites");

    if (favorites) {
      favorites = JSON.parse(favorites);

      const index = favorites.indexOf(productId);
      if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    }
  }

  function toggleFavorite(productId) {
    let favorites = localStorage.getItem("favorites");

    if (!favorites) {
      favorites = [];
    } else {
      favorites = JSON.parse(favorites);
    }

    const index = favorites.indexOf(productId);

    if (index === -1) {
      // Продукт не в избранном, добавить его
      favorites.push(productId);
    } else {
      // Продукт уже в избранном, удалить его
      favorites.splice(index, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  // Функция для получения избранных продуктов
  function getFavorites() {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  }

  function displayFavorites() {
    const favorites = getFavorites(); // Получаем список избранных продуктов
    const favoritesListElement = document.getElementById("favoritesList");

    // Очищаем содержимое перед добавлением новой информации
    favoritesListElement.innerHTML = "";

    favorites.forEach((productId) => {
      // Проверяем, существует ли информация о продукте в объекте sectionProducts по его ID
      if (sectionProducts.hasOwnProperty(productId)) {
        // Для каждого избранного продукта создаем HTML-элементы для отображения информации
        const productInfoElement = document.createElement("div");

        // Получаем информацию о продукте по его ID из объекта sectionProducts
        const productData = sectionProducts[productId];

        // Проверяем, существует ли необходимая информация о продукте
        if (productData) {
          // Создаем HTML для отображения информации о продукте
          const productHTML = `
            <div class="product">
              <h3>${productData.productName}</h3>
              <p>Price: ${productData.productPrice}</p>
              <img src="${productData.productImage}" alt="${productData.productName}" />
              <p>Address: ${productData.productAddress}</p>
              <!-- Другие детали или информация о продукте, которые вы хотите отобразить -->
            </div>
          `;

          // Добавляем созданный HTML для каждого продукта в блок favoritesListElement
          favoritesListElement.innerHTML += productHTML;
        }
      }
    });

    console.log("Избранные продукты:", favorites);
  }

  const favoritedIcon = document.getElementById("favorited");

  favoritedIcon.addEventListener("click", () => {
    displayFavorites();
  });
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
  // Получение ссылок на элементы навигации
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
});
