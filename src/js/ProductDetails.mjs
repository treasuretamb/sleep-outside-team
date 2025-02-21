import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// Use the environment variable for the API base URL
const baseURL = import.meta.env.VITE_SERVER_URL;

function productDetailsTemplate(product) {
  if (!product) {
    return `<p class="error-message">Product details not available.</p>`;
  }

  // Use the PrimaryLarge image for the product detail page.
  let imageUrl = product.Images?.PrimaryLarge || "placeholder.jpg";
  if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
    imageUrl = "/" + imageUrl;
  }

  return `<section class="product-detail"> 
    <h3>${product.Brand?.Name || "Unknown Brand"}</h3>
    <h2 class="divider">${product.NameWithoutBrand || "No Name"}</h2>
    <img class="divider" src="${imageUrl}" alt="${product.NameWithoutBrand || "Product Image"}" />
    <p class="product-card__price">$${product.FinalPrice || "N/A"}</p>
    <p class="product__color">${product.Colors?.[0]?.ColorName || "No Color Info"}</p>
    <p class="product__description">
      ${product.DescriptionHtmlSimple || "No Description Available."}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}

export default class ProductDetails {
  constructor(productId) {
    this.productId = productId;
    this.product = {};
  }

  async init() {
    try {
      const response = await fetch(baseURL + `product/${this.productId}`);
      if (!response.ok) {
        throw new Error("Bad response from API");
      }
      let data = await response.json();

      // If the API wraps the product in a "Result" property, extract it.
      this.product = data.Result ? data.Result : data;

      console.log("Fetched Product:", this.product);

      if (!this.product) {
        console.error("Product not found. Check your API response.");
        document.querySelector("main").innerHTML =
          `<p class="error-message">Product not found.</p>`;
        return;
      }

      // Render the product details
      this.renderProductDetails("main");

      // Attach the event listener for Add to Cart
      document
        .getElementById("addToCart")
        ?.addEventListener("click", this.addToCart.bind(this));
    } catch (error) {
      console.error("Error initializing product details:", error);
    }
  }

  // addToCart METHOD
  addToCart() {
    let currentCart = getLocalStorage("so-cart");
    if (!Array.isArray(currentCart)) {
      currentCart = [];
    }

    // Check if product already exists in cart
    const existingItem = currentCart.find(
      (item) => item.Id === this.product.Id,
    );

    if (existingItem) {
      // Increment quantity if item exists
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // Add new item with quantity 1
      this.product.quantity = 1;
      currentCart.push(this.product);
    }

    setLocalStorage("so-cart", currentCart);
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product),
    );
  }
}
