// product.js
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";

// Get the product id from the URL query parameters.
// (We no longer require the category, so we only check for product.)
const productId = getParam("product");

if (!productId) {
  window.location.href = "/index.html";
}

const productDetails = new ProductDetails(productId);
productDetails.init();
