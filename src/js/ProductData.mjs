function convertToJson(res) {
  if (res.ok) return res.json();
  throw new Error("Bad Response");
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // Path to the JSON file for this category (e.g. /json/tents.json)
    this.path = `/json/${this.category}.json`;
  }

  // Fetch data from the JSON file and ensure we return an array of products
  async getData() {
    try {
      const response = await fetch(this.path);
      const data = await convertToJson(response);

      // If the JSON contains an object with metadata, extract the "Result" array.
      if (data && typeof data === "object" && !Array.isArray(data)) {
        if (Array.isArray(data.Result)) {
          return data.Result;
        }
        console.error("Unexpected data format:", data);
        return [];
      }

      return data; // If it's already an array, return as is
    } catch (error) {
      console.error("Error loading products:", error);
      return [];
    }
  }

  // Find a product by ID from the JSON file
  async findProductById(id) {
    try {
        const productsData = await this.getData();
        let products = [];

        if (Array.isArray(productsData)) {
            products = productsData;
        } else if (productsData?.Result && Array.isArray(productsData.Result)) {
            products = productsData.Result;
        } else {
            throw new Error("Unexpected JSON structure.");
        }

        // Log available IDs for debugging
        console.log("Available Product IDs:", products.map(p => p.Id));

        // Ensure ID comparison is consistent (convert both to strings)
        const product = products.find((p) => String(p.Id) === String(id));

        console.log("Fetched Product:", product);

        if (!product) {
            console.warn(`Product with ID ${id} not found.`);
            return null;
        }

        return product;
    } catch (error) {
        console.error("Error finding product:", error);
        return null;
    }
}

}
