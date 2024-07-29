import ProductManager from './mongo/ProductManager.js';
import CartManager from './mongo/CartManager.js';

export const productsService = new ProductManager();
export const cartService = new CartManager();
