import { renderListWithTemplate } from "./utils.mjs";

export default class ProductListing {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      // Pass the category so that the API call is made for the correct category
      const list = await this.dataSource.getData(this.category);
      console.log("Data fetched for category", this.category, list);

      const filteredList = this.filterList(list);
      console.log("Filtered list:", filteredList);

      // Render the product cards using our template function
      renderListWithTemplate(
        this.productCardTemplate.bind(this),
        this.listElement,
        filteredList
      );
    } catch (error) {
      console.error("Error loading product data:", error);
    }
  }

  productCardTemplate(product) {
    // Use the PrimaryMedium image for the product list.
    const imageSrc =
      product.Images && product.Images.PrimaryMedium
        ? product.Images.PrimaryMedium
        : "/images/placeholder.jpg";
  
    return `<li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${imageSrc}" alt="Image of ${product.Name}" class="product-image">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${parseFloat(product.FinalPrice).toFixed(2)}</p>
      </a>
    </li>`;
  }
  

  filterList(list) {
    // Optionally filter or limit the list; here we’re showing only the first 4 products.
    return list.slice(0, 4);
  }
}
