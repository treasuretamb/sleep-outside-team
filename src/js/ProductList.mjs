// ProductList.mjs
import { renderListWithTemplate } from './utils.mjs'; // Import the utility function

export default class ProductListing {
  constructor(category, dataSource, listElement) {
    // Store the category, dataSource, and listElement for later use
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      // Fetch the list of products from the dataSource (which is assumed to be asynchronous)
      const list = await this.dataSource.getData();

      // Filter the list to only show the first 4 products
      const filteredList = this.filterList(list);

      // Render the product list using the utility function
      renderListWithTemplate(this.productCardTemplate, this.listElement, filteredList);
    } catch (error) {
      console.error("Error loading product data:", error);
    }
  }

  // Create a product card template

  productCardTemplate(product) {
    return `<li class="product-card">
      <a href="product_pages/index.html?product=${product.Id}">
        <img src="${product.Image}" alt="Image of ${product.Name}" class="product-image">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      </a>
    </li>`;
  }

  // Filter the list to show only the first 4 products
  filterList(list) {
    return list.slice(0, 4); // Adjust the number of products to show as needed
  }
}
