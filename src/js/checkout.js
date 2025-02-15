import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Function to package cart items in a format required by the backend
export function packageItems(items) {
  return items.map((item) => {
    const price = parseFloat(item.FinalPrice || item.price) || 0;
    return {
      id: item.Id,
      name: item.Name,
      price: price,
      quantity: item.quantity || 1,
    };
  });
}

// Function to update the cart count in the UI
function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = totalItems > 0 ? totalItems : "";
  }
}

// Checkout process class
export default class CheckoutProcess {
  constructor() {
    this.cartItems = getLocalStorage("so-cart") || [];
    console.log("Cart items loaded:", this.cartItems);
    this.externalServices = new ExternalServices();
  }

  displaySubtotal() {
    const subtotalEl = document.getElementById("subtotal");
    const subtotal = this.cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = parseFloat(item.FinalPrice || item.price) || 0;
      return sum + price * quantity;
    }, 0);
    if (subtotalEl) {
      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
  }

  updateOrderSummary() {
    const shippingEl = document.getElementById("shipping");
    const taxEl = document.getElementById("tax");
    const orderTotalEl = document.getElementById("orderTotal");
    const subtotalEl = document.getElementById("subtotal");

    const subtotal = parseFloat(subtotalEl.textContent.replace("$", "")) || 0;
    const totalItems = this.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    const tax = subtotal * 0.06;
    const orderTotal = subtotal + shipping + tax;

    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (orderTotalEl) orderTotalEl.textContent = `$${orderTotal.toFixed(2)}`;
  }

  renderOrderSummary() {
    const cartSummary = document.getElementById("cart-summary");
    if (!cartSummary) return;

    cartSummary.innerHTML = "";
    if (this.cartItems.length === 0) {
      cartSummary.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    this.cartItems.forEach((item) => {
      const quantity = item.quantity || 1;
      const price = parseFloat(item.FinalPrice || item.price) || 0;
      const itemTotal = price * quantity;
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      itemElement.innerHTML = `
        <p><strong>${item.Name}</strong> (${quantity}x)</p>
        <p>$${itemTotal.toFixed(2)}</p>
      `;
      cartSummary.appendChild(itemElement);
    });
  }

  async checkout(form) {
    const formData = new FormData(form);
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
    };

    const subtotal = this.cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = parseFloat(item.FinalPrice || item.price) || 0;
      return sum + price * quantity;
    }, 0);
    const totalItems = this.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    const tax = subtotal * 0.06;
    const orderTotal = subtotal + shipping + tax;

    order.orderTotal = orderTotal.toFixed(2);
    order.shipping = shipping;
    order.tax = tax.toFixed(2);

    try {
      console.log("Sending order:", order);
      const result = await this.externalServices.checkout(order);
      console.log("Server response:", result);

      setLocalStorage("so-cart", []);
      updateCartCount();
      window.location.href = "../successful.html"; // Redirects to success page
      return result;
    } catch (error) {
      console.error("Checkout error:", error);
      alert(`Checkout failed: ${error.message}`);
      throw error;
    }
  }
}

// Initialize order summary and attach form validation on page load.
document.addEventListener("DOMContentLoaded", () => {
  const checkout = new CheckoutProcess();
  checkout.displaySubtotal();
  checkout.updateOrderSummary();
  checkout.renderOrderSummary();
  updateCartCount();

  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (checkoutForm.checkValidity()) {
        console.log("Form is valid, proceeding with checkout...");
        checkout.checkout(checkoutForm);
      } else {
        console.warn("Form validation failed");
        checkoutForm.reportValidity();
      }
    });
  }
});
