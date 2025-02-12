// Use the environment variable for the API base URL
const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) return res.json();
  throw new Error("Bad Response");
}

export default class ExternalServices {
  constructor() {}

  // Fetch data from the API for a given category
  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    // The API returns an object with a "Result" array
    return data.Result;
  }

  // Find a product by ID from the API data (now also requires the category)
  async findProductById(id, category) {
    try {
      const productsData = await this.getData(category);
      console.log(
        "Available Product IDs:",
        productsData.map((p) => p.Id),
      );

      // Ensure ID comparison is consistent by converting both to strings
      const product = productsData.find((p) => String(p.Id) === String(id));
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

  // New checkout method to submit the order to the server.
  // The order object should follow the required format.
  async checkout(order) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      };

      // Note: The URL below is specified by the assignment.
      const response = await fetch(
        "http://wdd330-backend.onrender.com/checkout",
        options,
      );

      if (!response.ok) {
        throw new Error("Checkout request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    }
  }
}
