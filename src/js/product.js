import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);

// incluing the init function
class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
  }

  // The init function to handle product loading and button event listener
  async init() {
    try {
      // Fetch product details using the data source and the product ID
      const productDetails = await this.dataSource.findProductById(this.productId);
      
      // Once product details are available, render the HTML (assume renderProductHTML is a method)
      this.renderProductHTML(productDetails);
      
      // Add an event listener to the 'Add to Cart' button
      document.getElementById('addToCart')
        .addEventListener('click', this.addToCart.bind(this));
    } catch (error) {
      console.error("Error loading product details:", error);
    }
  }

  // A sample method for rendering product details (you can modify this based on your structure)
  renderProductHTML(productDetails) {
    // Assuming you have a container to insert product details into
    const productContainer = document.getElementById('productDetailsContainer');
    
    // Render product HTML (this can be adapted depending on how you want to display it)
    productContainer.innerHTML = `
      <h1>${productDetails.name}</h1>
      <p>${productDetails.description}</p>
      <p>Price: $${productDetails.price}</p>
    `;
  }

  // Example method for 'Add to Cart' (you will need to define what it should do)
  addToCart() {
    console.log("Product added to cart:", this.productId);
    // Implement cart logic here
  }
}

// Initialize the product details page
product.init();
