import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";
import ProductListing from "./ProductList.mjs";

// Get the product id and category from the URL query parameters
const productId = getParam("product");
const category = getParam("category");

// If either the product id or the category is missing, redirect to the homepage.
if (!productId || !category) {
  window.location.href = "/index.html";
}

// Initialize the data source with the correct category.
const dataSource = new ProductData(category);

// Initialize the product details using the correct data source.
const product = new ProductDetails(productId, dataSource);
product.init();

// Optionally, if there is a product listing element on the same page, initialize the listing.
const listElement = document.querySelector(".product-list");
if (listElement) {
  const listing = new ProductListing(category, dataSource, listElement);
  listing.init();
}
