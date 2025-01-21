import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // access the current cart from local storage
  // show an empty array if cart is null
  let cart = getLocalStorage("so-cart") || []; 

  // make the cart an array so it can hold various items
  if (!Array.isArray(cart)) {
    cart = [];
  }

  // Add the new product to the cart or exixting items
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
