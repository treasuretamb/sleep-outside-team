import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  renderProductDetails() {
    const productContainer = document.querySelector(".product-detail");

    productContainer.innerHTML = `
      <h2 class="product-name">${this.product.Name}</h2>
      <img src="${this.product.Image}" alt="${this.product.Name}" class="product-image">
      <p class="product-description">${this.product.Description}</p>
      <p class="product-price">$${this.product.Price.toFixed(2)}</p>
      <button id="addToCart" data-id="${this.product.Id}" class="add-to-cart-btn">Add to Cart</button>
    `;
  }

  addToCart() {
    let cart = getLocalStorage("so-cart") || [];

    if (!Array.isArray(cart)) {
      cart = [];
    }

    const existingProduct = cart.find((item) => item.Id === this.product.Id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.product.quantity = 1;
      cart.push(this.product);
    }

    setLocalStorage("so-cart", cart);
  }
}
