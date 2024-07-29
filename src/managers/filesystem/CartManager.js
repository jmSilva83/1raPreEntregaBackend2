import fs from 'fs/promises';
import path from 'path';

const PATH = path.resolve('src/data/carts.json');
const PRODUCTS_PATH = path.resolve('src/data/products.json');

class CartManager {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const exists = await fs
        .access(PATH)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        await fs.writeFile(PATH, JSON.stringify([]));
        console.log('Cart file created successfully.');
      }
    } catch (error) {
      console.log('Error initializing cart file:', error);
    }
  }

  async getProductsCart() {
    try {
      const data = await fs.readFile(PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('Error reading cart data:', error);
      return [];
    }
  }

  async saveProductsCart(productsCart) {
    try {
      await fs.writeFile(PATH, JSON.stringify(productsCart, null, 2));
      console.log('Cart data saved successfully.');
      return true;
    } catch (error) {
      console.log('Error writing cart data:', error);
      return false;
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(PRODUCTS_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('Error reading products file:', error);
      return [];
    }
  }

  async addProductCart({ productId, quantity }) {
    const dataProductCart = await this.getProductsCart();
    const productData = await this.getProducts();
    const product = productData.find((p) => p.id === productId);

    if (!product) {
      console.error(`Product with ID: ${productId} not found.`);
      return false;
    }

    const newProductCart = {
      id: dataProductCart.length
        ? dataProductCart[dataProductCart.length - 1].id + 1
        : 1,
      products: [{ ...product, quantity }],
    };

    dataProductCart.push(newProductCart);
    await this.saveProductsCart(dataProductCart);
    return newProductCart;
  }

  async showProductCart(id) {
    const productCart = await this.getProductsCart();
    return productCart.find((cart) => cart.id === id) || null;
  }

  async updateCart(idCart, idProduct, quantity) {
    const dataProductCart = await this.getProductsCart();
    const cartIndex = dataProductCart.findIndex((cart) => cart.id === idCart);
    if (cartIndex === -1) {
      console.log(`Cart with ID: ${idCart} not found.`);
      throw new Error('Cart index not found');
    }

    const cart = dataProductCart[cartIndex];
    const productIndex = cart.products.findIndex((p) => p.id === idProduct);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
      console.log(
        `Updated quantity for product ID: ${idProduct} in cart ID: ${idCart}.`
      );
    } else {
      console.log(
        `Product with ID: ${idProduct} not found in cart ID: ${idCart}.`
      );
      return false;
    }

    dataProductCart[cartIndex] = cart;
    await this.saveProductsCart(dataProductCart);
    return true;
  }
}

export default CartManager;
