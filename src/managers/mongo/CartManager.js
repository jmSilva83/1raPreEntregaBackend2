import mongoose from 'mongoose';
import cartModel from './models/cart.model.js';
import productModel from './models/product.model.js';

class CartManager {
  async getAllCarts() {
    try {
      return await cartModel.find().populate('products.product');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartModel.findById(id).populate('products.product');
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error fetching cart details: ${error.message}`);
    }
  }

  async createCart(cart = { products: [] }) {
    try {
      const addCart = await cartModel.create(cart);
      if (!addCart) {
        return null;
      }
      return addCart.populate('products.product');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cid))
        throw new Error('Invalid cart ID');
      if (!mongoose.Types.ObjectId.isValid(pid))
        throw new Error('Invalid product ID');

      const cart = await cartModel.findById(cid);
      if (!cart) throw new Error('Cart not found');

      const product = await productModel.findById(pid);
      if (!product) throw new Error('Product not found');

      const productIndex = cart.products.findIndex(
        (p) => p.product._id.toString() === pid
      );
      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }

      const updatedCart = await cart.save();
      return updatedCart.populate('products.product');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await cartModel.findById(cid);
      const productIndex = cart.products.findIndex(
        (p) => p.product._id.toString() === pid
      );
      if (productIndex >= 0) {
        cart.products[productIndex].quantity = quantity;
        return await cart.save();
      } else {
        throw new Error('Product not found in cart');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCartProducts(cid, products) {
    try {
      return await cartModel
        .findByIdAndUpdate(cid, { products }, { new: true })
        .populate('products.product');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
      cart.products = cart.products.filter(
        (p) => p.product._id.toString() !== pid
      );
      return await cart.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async clearCart(cid) {
    try {
      return await cartModel
        .findByIdAndUpdate(cid, { products: [] }, { new: true });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default CartManager;
