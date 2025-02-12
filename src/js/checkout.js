import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// helper function to convert the cart items into the simplified format required by the server.
export function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: parseFloat(item.FinalPrice),
    quantity: item.quantity || 1,
  }));
}

function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = totalItems > 0 ? totalItems : "";
  }
}

export default class CheckoutProcess {
  constructor() {
    // Get the current cart items from localStorage
    this.cartItems = getLocalStorage("so-cart") || [];
    this.externalServices = new ExternalServices();
  }

  // Calculate and display the subtotal based on the items in the cart.
  displaySubtotal() {
    const subtotalEl = document.getElementById("subtotal");
    const subtotal = this.cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + parseFloat(item.FinalPrice) * quantity;
    }, 0);
    if (subtotalEl) {
      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
  }

  // Calculate and display shipping, tax, and order total.
  // Shipping: $10 for the first item + $2 for each additional item.
  // Tax: 6% of the subtotal.
  updateOrderSummary() {
    const shippingEl = document.getElementById("shipping");
    const taxEl = document.getElementById("tax");
    const orderTotalEl = document.getElementById("orderTotal");
    const subtotalEl = document.getElementById("subtotal");

    const subtotal = parseFloat(subtotalEl.textContent.replace("$", "")) || 0;
    const totalItems = this.cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    const shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    const tax = subtotal * 0.06;
    const orderTotal = subtotal + shipping + tax;

    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (orderTotalEl) orderTotalEl.textContent = `$${orderTotal.toFixed(2)}`;
  }

  // Render the order summary dynamically
  renderOrderSummary() {
    const cartSummary = document.getElementById("cart-summary");
    if (!cartSummary) return;

    cartSummary.innerHTML = "";
    if (this.cartItems.length === 0) {
      cartSummary.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    this.cartItems.forEach((item) => {
      const itemTotal = item.price * (item.quantity || 1);
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      itemElement.innerHTML = `
        <p><strong>${item.name}</strong> (${item.quantity || 1}x)</p>
        <p>$${itemTotal.toFixed(2)}</p>
      `;
      cartSummary.appendChild(itemElement);
    });
  }

  // This method gets called when the checkout form is submitted.
  async checkout(form) {
    const formData = new FormData(form);
    // Build the order object.
    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.get("fname").trim(),
      lname: formData.get("lname").trim(),
      street: formData.get("street").trim(),
      city: formData.get("city").trim(),
      state: formData.get("state").trim(),
      zip: formData.get("zip").trim(),
      cardNumber: formData.get("cardNumber").trim(),
      expiration: formData.get("expiration").trim(),
      code: formData.get("code").trim(),
      items: packageItems(this.cartItems),
      orderTotal: "", // to be calculated
      shipping: 0, // to be calculated
      tax: "", // to be calculated
    };

    // Calculate totals to ensure consistency.
    const subtotal = this.cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + parseFloat(item.FinalPrice) * quantity;
    }, 0);
    const totalItems = this.cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    const shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    const tax = subtotal * 0.06;
    const orderTotal = subtotal + shipping + tax;

    order.orderTotal = orderTotal.toFixed(2);
    order.shipping = shipping;
    order.tax = tax.toFixed(2);

    // Send the order to the server using ExternalServices.checkout.
    const result = await this.externalServices.checkout(order);

    // Clear the cart on successful order submission.
    setLocalStorage("so-cart", []);
    updateCartCount(); // Update cart count after clearing cart
    return result;
  }
}

// Initialize order summary when page loads
document.addEventListener("DOMContentLoaded", () => {
  const checkout = new CheckoutProcess();
  checkout.displaySubtotal();
  checkout.updateOrderSummary();
  checkout.renderOrderSummary();
  updateCartCount(); // Ensure cart count is updated on load
});
