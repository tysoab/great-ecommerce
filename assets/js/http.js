async function fetchProducts() {
  let status = null;

  const url = "https://fakestoreapi.com/products";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return (status = false);
  }

  const data = await res.json();

  if (data.length) status = true;

  return { status, products: data };
}

export default fetchProducts;

// two ways to export file
// 1 default

//2 name
// export const name = "taiwo";
// export const state = "lagos";

async function fetchProduct(id) {
  let status = null;

  const url = `https://fakestoreapi.com/products/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return (status = false);
  }

  const data = await res.json();

  if (data.id) status = true;

  return { status, product: data };
}

export { fetchProduct };

// retrieve data from lsg
export const carts = JSON.parse(localStorage.getItem("bestShopCart")) || [];

export const cartQty = (cartsqty) => {
  return cartsqty.reduce((acc, curCart) => acc + curCart.quantity, 0);
};

// store cart data
export const storeCartData = (data) => {
  localStorage.setItem("bestShopCart", JSON.stringify(data));
};
