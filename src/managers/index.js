import ProductManager from './mongo/ProductManager.js';
import CartManager from './mongo/CartManager.js';
import UsersManager from "./mongo/UsersManager.js";

export const usersService = new UsersManager();
export const productsService = new ProductManager();
export const cartService = new CartManager();
