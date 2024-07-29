import { Router } from 'express';
import productModel from '../managers/mongo/models/product.model.js';
import cartModel from '../managers/mongo/models/cart.model.js';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const paginationData = await productModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean();

    const products = paginationData;

    const totalCount = await productModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    res.render('Home', {
      products,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send('Error fetching products');
  }
});


router.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productModel.findById(pid).lean();

    if (!product) {
      return res.render('404'); 
    }

    res.render('ProductDetails', {
      product,
      mainImage: product.thumbnails.find((thumbnail) => thumbnail.main),
    });
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.render('error', { message: 'Error fetching product details' }); 
  }
});

// Vista para un carrito específico
router.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel
      .findById(cid)
      .populate('products.product')
      .lean();

    if (!cart) {
      return res.render('404'); 
    }

    res.render('Cart', { cart });
  } catch (error) {
    console.error('Error fetching cart details:', error.message);
    res.render('error', { message: 'Error fetching cart details' });
  }
});
export default router;
