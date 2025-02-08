import { getLocalStorage, setLocalStorage } from "./utils.mjs";

/**
 * Returns the HTML for a single cart item.
 * Uses a number input so the user can adjust the quantity.
 */
function cartItemTemplate(item) {
  // Use item.quantity if available, otherwise default to 1
  const quantity = item.quantity || 1;
  const imageSrc = item.Image || item.Images?.[0] || "/images/placeholder.jpg";
  const colorName = item.Colors?.[0]?.ColorName || "No color specified";
  // Calculate the total price for this product (unit price * quantity)
  const totalPrice = (item.FinalPrice * quantity).toFixed(2);
  
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${imageSrc}" alt="${item.Name}">
    </a>
    <h2 class="card__name">${item.Name}</h2>
    <p class="cart-card__color">${colorName}</p>
    <div class="cart-card__quantity-container">
      <label>
        Quantity: 
        <input 
          type="number" 
          class="cart-card__quantity-input" 
          data-id="${item.Id}" 
          value="${quantity}" 
          min="1">
      </label>
    </div>
    <p class="cart-card__price">$${totalPrice}</p>
  </li>`;
}

/**
 * Update the quantity for the given productId in the cart (stored in localStorage).
 */
function updateCartQuantity(productId, newQuantity) {
  let cartItems = getLocalStorage("so-cart") || [];
  // Update the item whose Id matches the given productId
  const updatedCart = cartItems.map(item => {
    if (String(item.Id) === String(productId)) {
      // Return a new object with the updated quantity
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  setLocalStorage("so-cart", updatedCart);
}

/**
 * Renders the contents of the cart.
 * It creates the HTML for each cart item and then attaches event listeners
 * for the quantity input fields.
 */
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []; // Default to empty array
  const cartList = document.querySelector(".product-list");

  if (!cartItems.length) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartList.innerHTML = cartItems.map(cartItemTemplate).join("");

  // After rendering, attach event listeners to all quantity input fields.
  const quantityInputs = document.querySelectorAll(".cart-card__quantity-input");
  quantityInputs.forEach(input => {
    input.addEventListener("change", function () {
      const newQuantity = parseInt(this.value, 10);
      const productId = this.dataset.id;
      
      // Prevent quantities less than 1
      if (newQuantity < 1) {
        this.value = 1;
        return;
      }
      
      // Update localStorage with the new quantity and re-render the cart.
      updateCartQuantity(productId, newQuantity);
      renderCartContents();
    });
  });
}

renderCartContents();
