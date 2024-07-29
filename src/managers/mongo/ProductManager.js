import mongoose from 'mongoose';
import productModel from './models/product.model.js';

class ProductManager {
  async getProducts({ limit = 10, page = 1, query = '', sort = '' }) {
    try {
      const queryObject = {};
      if (query) {
        queryObject.name = { $regex: query, $options: 'i' };
      }

      const sortObject = {};
      if (sort) {
        const [field, order] = sort.split(':');
        sortObject[field] = order === 'desc' ? -1 : 1;
      }

      const options = {
        limit: Number(limit),
        skip: Number(page),
        sort: sortObject,
      };

      const products = await productModel.paginate(queryObject, options);
      const totalProducts = await productModel.countDocuments(queryObject);

      const prevLink = products.hasPrevPage
        ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}`
        : null;
      const nextLink = products.hasNextPage
        ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}`
        : null;

      return {
        products: products.docs,
        totalPages: products.totalPages,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new Error('Invalid product ID');
      const product = await productModel.findById(id);
      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createProduct(data) {
    try {
      const exists = await productModel.findOne({ code: data.code });
      if (exists) {
        const updatedProduct = await productModel.updateOne(
          { code: data.code },
          { stock: exists.stock + data.stock }
        );
        if (!updatedProduct) {
          throw new Error('Error updating product stock');
        }
        return updatedProduct;
      } else {
        const product = new productModel(data);
        await product.save();
        return product;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new Error('Invalid product ID');
      const product = await productModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new Error('Invalid product ID');
      const product = await productModel.findByIdAndDelete(id);
      if (!product) {
        // Si product es null, el producto no se encontró
        return null;
      }
  
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default ProductManager;
