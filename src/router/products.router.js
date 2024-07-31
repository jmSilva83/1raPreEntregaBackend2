import { Router } from 'express';
import ProductManager from '../managers/mongo/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, query = '', sort = '' } = req.query;
    const products = await productManager.getProducts({ limit, page, query, sort });

    res.status(200).send({
      status: 'success',
      payload: products.products,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Error fetching products',
      error: error.message,
    });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    
    if (!product) {
      return res.status(404).render('404');
    }
    res.status(200).send({
      status: 'success',
      payload: product,
    });
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Error fetching product details',
      error: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.description || !data.code || !data.price || !data.category) {
      return res.status(400).json({
        status: 'error',
        error: 'Missing product values',
      });
    }
    const newProduct = {
      title: data.title,
      description: data.description,
      code: data.code,
      price: data.price,
      stock: data.stock || 1,
      category: data.category,
      status: data.status || true,
      thumbnails: [],
    };

    const product = await productManager.createProduct(newProduct);
    res.status(201).json({
      status: 'success',
      payload: product,
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Could not create product',
      error: error.message,
    });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productManager.updateProduct(pid, req.body);

    if (!updatedProduct) {
      return res.status(404).render('404');
    }

    res.status(200).json({
      status: 'success',
      payload: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error updating product',
      error: error.message,
    });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProduct(pid);

    if (!deletedProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting product',
      error: error.message,
    });
  }
});

export default router;
