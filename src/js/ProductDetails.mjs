import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  if (!product) {
    return `<p class="error-message">Product details not available.</p>`;
  }

  return `<section class="product-detail"> 
    <h3>${product.Brand?.Name || "Unknown Brand"}</h3>
    <h2 class="divider">${product.NameWithoutBrand || "No Name"}</h2>
    <img
      class="divider"
      src="${product.Images?.PrimaryLarge || "placeholder.jpg"}"
      alt="${product.NameWithoutBrand || "Product Image"}"
    />
    <p class="product-card__price">$${product.FinalPrice || "N/A"}</p>
    <p class="product__color">${product.Colors?.[0]?.ColorName || "No Color Info"}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple || "No Description Available."}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div></section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);
      
      console.log("Fetched Product:", this.product); // Debugging log
      
      if (!this.product) {
        console.error("Product not found. Check your API response.");
        document.querySelector("main").innerHTML = `<p class="error-message">Product not found.</p>`;
        return;
      }
      
      this.renderProductDetails("main");
      document
        .getElementById("addToCart")
        ?.addEventListener("click", this.addToCart.bind(this));
    } catch (error) {
      console.error("Error initializing product details:", error);
    }
  }
  addToCart() {
    let currentCart = getLocalStorage("so-cart");
    
    if (!Array.isArray(currentCart)) {
      currentCart = [];
    }
    
    currentCart.push(this.product);
    setLocalStorage("so-cart", currentCart);
  }
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML("afterBegin", productDetailsTemplate(this.product));
  }
}
