import { Router } from 'express';
import CartManager from '../managers/mongo/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.status(200).send({
      status: "success",
      payload: carts,
    });
  } catch (error) {
    console.error('Error fetching all carts:', error.message);
    res.status(500).send({
      status: 'error',
      message: `Error fetching carts: ${error.message}`,
    });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).send({
        status: 'error',
        message: 'Cart not found',
      });
    }

    res.status(200).send({
      status: 'success',
      payload: cart,
    });
  } catch (error) {
    console.error('Error fetching cart details:', error.message);
    res.status(500).send({
      status: 'error',
      message: `Error fetching cart details: ${error.message}`,
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).send({ status: 'success', payload: newCart });
  } catch (error) {
    console.error('Error creating cart:', error.message);
    res.status(500).send({ status: 'error', message: 'Error creating cart' });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).send('Quantity must be a positive number');
  }
  try {
    const result = await cartManager.addProductToCart(cid, pid, quantity);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    if (error.message === 'Invalid cart ID' || error.message === 'Invalid product ID') {
      res.status(400).send({ status: 'error', message: error.message });
    } else if (error.message === 'Cart not found' || error.message === 'Product not found') {
      res.status(404).send({ status: 'error', message: error.message });
    } else {
      console.error('Error adding product to cart:', error.message);
      res.status(500).send({ status: 'error', message: 'Error adding product to cart' });
    }
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).send({
        status: 'error',
        message: 'Invalid quantity',
      });
    }

    const updatedProduct = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (!updatedProduct) {
      return res.status(404).send({
        status: 'error',
        message: 'Cart or product not found',
      });
    }

    res.status(200).send({
      status: 'success',
      payload: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product quantity:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Error updating product quantity',
      error: error.message,
    });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products;

    if (!Array.isArray(products)) {
      return res.status(400).send({
        status: 'error',
        message: 'Products should be an array',
      });
    }

    const updatedCart = await cartManager.updateCart(cid, products);

    if (!updatedCart) {
      return res.status(404).send({
        status: 'error',
        message: 'Cart not found',
      });
    }

    res.status(200).send({
      status: 'success',
      payload: updatedCart,
    });
  } catch (error) {
    console.error('Error updating cart:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Error updating cart',
      error: error.message,
    });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartManager.removeProductFromCart(cid, pid);

    if (!result) {
      return res.status(404).send({
        status: 'error',
        message: 'Cart or product not found',
      });
    }

    res.status(200).send({
      status: 'success',
      message: 'Product removed from cart',
    });
  } catch (error) {
    console.error('Error removing product from cart:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Error removing product from cart',
      error: error.message,
    });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartManager.clearCart(cid);

    if (!result) {
      return res.status(404).send({
        status: 'error',
        message: 'Cart not found',
      });
    }

    res.status(200).send({
      status: 'success',
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Error clearing cart',
      error: error.message,
    });
  }
});

export default router;