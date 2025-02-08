import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

(async () => {
  try {
    await loadHeaderFooter();
    const params = new URLSearchParams(window.location.search);
    let category = params.get("category");

    // If no query parameter, extract category from the URL path.
    if (!category) {
      const pathParts = window.location.pathname.split("/");
      category = pathParts[2] || "tents";
    }
    console.log("Active category:", category);

    // Create the data source and check that the UL exists
    const dataSource = new ProductData(category);
    const listElement = document.querySelector(".product-list");
    if (!listElement) {
      console.error("Could not find element with class 'product-list'");
      return;
    }

    const productListing = new ProductListing(category, dataSource, listElement);
    await productListing.init();
  } catch (error) {
    console.error("Error initializing products:", error);
  }
})();
