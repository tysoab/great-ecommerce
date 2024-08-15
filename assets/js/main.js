// import files
import fetchProducts, {
  fetchProduct,
  carts,
  storeCartData,
  cartQty,
} from "./http.js";

// select element
const proContainer = document.querySelector(".products-container");

const singleProContainer = document.querySelector(".single-pro-container");
const productTitle = document.querySelector(".product-title");
const cartQtyEl = document.querySelector(".cart-qty");
const cartOverviewCon = document.querySelector("#cart-overview .container");

// const products = [
//   {
//     title: "EILIFINTE B06 Casual Crossbody Shoulder Chest Bag-Grey",
//     id: 1,
//     description: `
//     Model Name: ET-B06(Crossbody chest bag, shoulder bag)

// Material: Good quality Cotton Polyester Fabric;

// Features: Fashionable, waterproof, wear resistant, portable, large capacity, strong load bearing, Super light;

// Size: 17x6x31cm (1cm=0.39inch)`,

//     price: 6000,
//     rating: 5,
//     discount: 0,
//     image:
//       "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/87/5167301/1.jpg?7673",
//   },
//   {
//     title: "EILIFINTE B06 Casual Crossbody",
//     id: 2,
//     description: `
//     Model Name: ET-B06(Crossbody chest bag, shoulder bag)

// Material: Good quality Cotton Polyester Fabric;

// Features: Fashionable, waterproof, wear resistant, portable, large capacity, strong load bearing, Super light;
// `,

//     price: 4000,
//     discount: 0,
//     rating: 4,
//     image:
//       "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/87/5167301/3.jpg?7540",
//   },
// ];

async function displayProducts() {
  proContainer.innerHTML = "<progress></progress>";

  let markup = "";
  const fetchPro = await fetchProducts();

  const products = (fetchPro.status && fetchPro.products) || [];

  markup += !fetchPro.status
    ? `<h2 class="text-info fs-bold text-center">No products, try again later</h2>`
    : "";

  if (products.length) {
    products.forEach(
      (product) =>
        (markup += `
    <div class="col-md-3 mb-4">
                <div class="card">
                  <a href="/product.html?id=${product.id}" class="nav-link">
                    <div class="card-image">
                      <img
                        src="${product.image}"
                        alt=""
                        style="height: 240px"
                        class="img-fluid w-100 rounded"
                      />
                    </div>
                    <div class="card-content py-3 px-3">
                      <h6 class="card-title text-dark">${product["title"]}</h6>

                      <div class="rating">
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-half text-warning"></i>
                      </div>

                      <div class="card-price d-flex align-items-center gap-5">
                        <h6 class="p-0 m-0" style="color: #f52565">$${
                          product.price
                        }</h6>
                       ${
                         product.discount
                           ? `<small
                          class="text-dark-emphasis text-decoration-line-through"
                          >$7</small
                        >
                        `
                           : ""
                       }
                      </div>
                    </div>
                  </a>
                </div>
              </div>
    `)
    );
  } else {
    markup =
      "<h2 class='text-info fs-bold text-center'>No products, try again later</h2>";
  }

  proContainer.innerHTML = markup;
}

// displayProducts(products);

// check if products container is available
proContainer && displayProducts();

// async function getProducts() {
//   const fetchPro = await fetchProducts();
//   console.log(fetchPro.products);
//   console.log(fetchPro.status);
// }

// getProducts();

async function displayProduct() {
  let url = window.location.search;
  url = url.split("=");
  const id = Number(url[url.length - 1]);

  if (id < 1 || id > 20) {
    return (window.location.href = "/");
  }

  singleProContainer.innerHTML = "<progress class='fs-3'></progress>";
  productTitle.textContent = "...";

  const { product, status } = await fetchProduct(id);
  let markup = "";
  let title;
  if (status) {
    title = product.title;
    markup += `
     <div class="col-md-6 m-0 p-0 mb-4">
              <div class="card border-0 px-1">
                <div class="card-image text-center">
                  <img
                    src="${product.image}"
                    class="w-75 rounded border-0 img-fluid"
                    style="max-height: 450px"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6 m-0 p-0 mb-4">
              <div class="card border-0 px-3">
                <h2 class="card-title">${product.title}</h2>
                <div class="rating mb-2">
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-half text-warning"></i>
                </div>

                <div class="card-price d-flex align-items-center gap-5 mb-2">
                  <h3 class="p-0 m-0" style="color: #f52565">$${
                    product.price
                  }</h3>
                  ${
                    product.discount
                      ? `<small
                    class="text-dark-emphasis fs-5 text-decoration-line-through"
                    >$7</small
                  >`
                      : ""
                  }
                </div>

                <!-- description -->
                <div class="description mb-3">
                  <p style="text-align: justify">
                    ${product.description}
                  </p>
                </div>

                <!-- add to cart button -->
                <div class="control-action">
                  <button class="btn add-to-cart bg-success fs-5 w-100 text-light" data-id='${
                    product.id
                  }'>
                    <i class="bi bi-cart4 fw-bold me-2"></i>
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
    `;
  }
  productTitle.textContent = title;
  singleProContainer.innerHTML = markup;
}

singleProContainer && displayProduct();

// add to cart operation
singleProContainer &&
  singleProContainer.addEventListener("click", async (e) => {
    const btnAddToCart = e.target.closest(".add-to-cart");
    // get button inner content
    const btnOldContent = btnAddToCart.innerHTML;

    if (!btnAddToCart) {
      return;
    }

    const id = btnAddToCart.dataset.id;
    btnAddToCart.innerHTML = "Adding Product...";

    const item = await fetchProduct(id);
    const { product } = item;
    const cartItem = {
      title: product.title,
      id: product.id,
      image: product.image,
      price: product.price,
      quantity: 1,
    };

    setTimeout(() => {
      btnAddToCart.innerHTML = "Added successfully";
      setTimeout(() => (btnAddToCart.innerHTML = btnOldContent), 300);
    }, 400);

    if (carts.length === 0) {
      carts.unshift(cartItem);
      storeCartData(carts);
      displayCartQty(carts);
      return;
    }

    if (carts.length >= 1) {
      const isExist = carts.find((cart) => cart.id === cartItem.id);

      if (isExist) {
        const newCartsItem = carts.filter((cart) =>
          cart.id === cartItem.id ? (cart.quantity += 1) : cart
        );
        storeCartData(newCartsItem);
        displayCartQty(newCartsItem);
      } else {
        carts.unshift(cartItem);
        storeCartData(carts);
        displayCartQty(carts);
      }
    }
  });

// display cart qty
function displayCartQty(carts) {
  const qty = cartQty(carts);
  cartQtyEl.textContent = qty ? qty : 0;
}
displayCartQty(carts);

// display cart items/overview
function displayCartItems() {
  let markup = "";
  carts.forEach(
    (cart) =>
      (markup += `
    <div class="row border-bottom border-primary mb-5">
            <div class="col-md-2 mb-3">
              <img
                src="${cart.image}"
                class="w-100"
                style="height: 200px"
                alt="${cart.title}"
              />
            </div>

            <div class="col-md-6 mb-3">
              <h5>
                ${cart.title}
              </h5>
            </div>

            <div class="col-md-4 mb-3">
              <p>((qty) ${cart.quantity} x ${cart.price})</p>
              <h6>$${cart.quantity * cart.price}</h6>
            </div>
          </div>
    `)
  );

  cartOverviewCon.innerHTML = markup;

  // cart total price
  const total = carts
    .reduce((acc, curCart) => acc + curCart.price * curCart.quantity, 0)
    .toFixed(2);
  document.querySelector(".total-price").textContent = `$${total}`;
}

cartOverviewCon && displayCartItems();
