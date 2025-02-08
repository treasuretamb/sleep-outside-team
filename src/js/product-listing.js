import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

(async () => {
  try {
    await loadHeaderFooter();

    // Retrieve the category from the URL or from the body's data-category attribute.
    const params = new URLSearchParams(window.location.search);
    let category = params.get("category") || document.body.dataset.category || "tents";
    console.log("Active category:", category);

    // Capitalize the first letter of the category.
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    // Update the heading inside the products section.
    // (Assumes your HTML has <h2>Top Products</h2> inside a container with class "products")
    const heading = document.querySelector(".products h2");
    if (heading) {
      heading.textContent = `Top Products: ${capitalizedCategory}`;
    }

    // (Optional) Also update the document title if desired.
    document.title = `Top Products: ${capitalizedCategory}`;

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
