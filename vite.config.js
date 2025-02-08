import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        tents: resolve(__dirname, "src/products/tents/index.html"),
        backpacks: resolve(__dirname, "src/products/backpacks/index.html"),
        sleepingbags: resolve(__dirname, "src/products/sleeping-bags/index.html"),
        hammocks: resolve(__dirname, "src/products/hammocks/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"
        ),
  
      },
    },
  },
});
