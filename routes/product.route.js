// routes/product.js
const express = require('express');
const Product = require('../models/product.model');

const router = express.Router();

// Product APIs
// Get All Products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

// Get Product by ID
router.get('/products/:productId', async (req, res) => {
    try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
});

// Create Product
router.post('/products', async (req, res) => {
    try {
      const { name, description, price, stock, category, imageUrl } = req.body;
  
      const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category,
        imageUrl
      });
  
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ message: "Error creating product", error: err });
    }
  });

// Update Product
router.put('/products/:productId', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
});

// Delete Product
router.delete('/products/:productId', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
});

module.exports = router;
