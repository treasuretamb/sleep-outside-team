import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

(async () => {
  try {
    await loadHeaderFooter();

    // Get the category from the URL or use a fallback.
    const params = new URLSearchParams(window.location.search);
    let category = params.get("category") || document.body.dataset.category || "tents";
    console.log("Active category:", category);

    // Update the heading to include the category (capitalize the first letter)
    const heading = document.querySelector('.products h2');
    if (heading) {
      heading.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }

    const dataSource = new ProductData();
    const listElement = document.querySelector(".product-list");
    if (!listElement) {
      console.error("Could not find element with class 'product-list'");
      return;
    }

    const productListing = new ProductListing(category, dataSource, listElement);
    await productListing.init();
  } catch (error) {
    console.error("Error initializing product listing:", error);
  }
})();
