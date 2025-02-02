import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs"; // Import ProductListing class

// An instance of ProductData, passing the category (e.g., "tents")
const dataSource = new ProductData("tents");

(async () => {
  try {
    const dataSource = new ProductData("tents");
    const products = await dataSource.getData();
    
    const listElement = document.querySelector('.product-list');
    const productListing = new ProductListing("tents", dataSource, listElement);
    
    await productListing.init();
    
  } catch (error) {
    console.error("Error initializing products:", error);
  }
})();
