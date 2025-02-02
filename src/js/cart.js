import { getLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  // Add error handling for image and data properties
  const imageSrc = item.Image || item.Images?.[0] || "/images/placeholder.jpg";
  const colorName = item.Colors?.[0]?.ColorName || "No color specified";
  const price = item.FinalPrice?.toFixed(2) || "0.00";

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${imageSrc}" alt="${item.Name}">
    </a>
    <h2 class="card__name">${item.Name}</h2>
    <p class="cart-card__color">${colorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${price}</p>
  </li>`;
}

// UPDATE THE renderCartContents FUNCTION
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []; // Default to empty array
  const cartList = document.querySelector(".product-list");

  if (!cartItems.length) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartList.innerHTML = cartItems.map(cartItemTemplate).join("");
}

renderCartContents();
