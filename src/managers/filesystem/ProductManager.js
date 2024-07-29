import fs from 'fs';
import __dirname from '../utils.js';

const PATH = `${__dirname}/data/products.json`;

export default class ProductManager {
  constructor() {
    this.init();
  }

  async init() {
    if (fs.existsSync(PATH)) {
    } else await fs.promises.writeFile(PATH, JSON.stringify([]));
    console.log('Product file created successfully.');
  }

  async getProducts() {
    const data = await fs.promises.readFile(PATH, 'utf-8');
    console.log('Product data retrieved successfully.');
    return JSON.parse(data);
  }

  async createProduct(product) {
    const products = await this.getProducts();
    if (products.length === 0) {
      product.id = 1;
    } else {
      product.id = products[products.length - 1].id + 1;
    }
    products.push(product);
    await fs.promises.writeFile(PATH, JSON.stringify(products, null, '\t'));
    console.log('Product data saved successfully.');
    return product;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find(p => p.id == id);
    return product;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(p => p.id == id);
    if (productIndex !== -1) {
      const deletedProduct = products.splice(productIndex, 1)[0];
      await fs.promises.writeFile(PATH, JSON.stringify(products, null, '\t'));
      console.log('Product data deleted successfully.');
      return deletedProduct;
    }
    return null;
  }

}