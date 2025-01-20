const express = require('express');
const Wishlist = require('../models/wishlist.model');
const router = express.Router();

// Get Wishlist by UserId
router.get('/wishlist/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Product to Wishlist
router.post('/wishlist/:userId/products', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [],
      });
    }

    const existingProduct = wishlist.products.find((item) => item.productId.toString() === productId);
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists in wishlist' });
    }

    wishlist.products.push({ productId });
    const updatedWishlist = await wishlist.save();
    res.status(200).json({ message: 'Wishlist updated successfully', updatedWishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Empty the Wishlist (Remove all products)
router.delete('/wishlist/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      message: 'Wishlist emptied successfully',
      updatedWishlist: wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove a Product from Wishlist
router.delete('/wishlist/:userId/products/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const updatedProducts = wishlist.products.filter((item) => item.productId.toString() !== productId);

    if (updatedProducts.length === wishlist.products.length) {
      return res.status(404).json({ message: 'Product not found in Wishlist' });
    }

    wishlist.products = updatedProducts;
    await wishlist.save();
    res.status(200).json({ message: 'Product removed from wishlist', updatedWishlist: wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all Wishlists
router.get('/wishlist', async (req, res) => {
  try {
    const wishlists = await Wishlist.find().populate('products.productId');
    res.status(200).json(wishlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
