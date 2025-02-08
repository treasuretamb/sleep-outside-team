import { renderListWithTemplate } from "./utils.mjs";

export default class ProductListing {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const list = await this.dataSource.getData();
      console.log("Data fetched for category", this.category, list);

      const filteredList = this.filterList(list);
      console.log("Filtered list:", filteredList);

      // Bind the template function to preserve `this`
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
    const category = this.category;
    return `<li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}&category=${category}">
        <img src="${product.Image}" alt="Image of ${product.Name}" class="product-image">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      </a>
    </li>`;
  }

  filterList(list) {
    return list.slice(0, 4);
  }
}
