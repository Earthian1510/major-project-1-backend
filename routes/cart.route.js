const express = require('express')
const Cart = require('../models/cart.model')
const router = express.Router();

// Get Cart by UserId
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try{
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if(!cart){
      return res.status(404).json({ message: 'Cart not found'});
    }
    res.status(200).json(cart)
  }
  catch(error){
    console.error(error)
    res.status(500).json({ message: 'Internal server error'})
  }
})

// Add Product to Cart
router.post('/cart/:userId/items', async (req, res) => {
  const { userId } = req.params 
  const { productId, quantity } = req.body 

  try{
    let cart = await Cart.findOne({ userId });
    
    if(!cart){
      cart = new Cart({
        userId,
        items: [],
      })
    }
    const existingItem = cart.items.find((item) => item.productId.toString() === productId)
    if (existingItem) {
      existingItem.quantity += quantity
    }
    else{
      cart.items.push({ productId, quantity });
    }
    
    const updatedCart = await cart.save()
    res.status(200).json({ message: 'Cart updated successfully', updatedCart})
  }
  catch(error){
    console.error(error)
    res.status(500).json({ message: 'Internal server error'})
  }
})

router.patch('/cart/:userId/items/:productId/increase', async (req, res) => {
  const { userId, productId } = req.params;
  
  try {
    // Find the cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item
    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Increase the quantity
    item.quantity += 1;

    // Save the updated cart
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/cart/:userId/items/:productId/decrease', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find the cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item
    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Decrease the quantity
    item.quantity -= 1;

    // If the quantity is 0 or less, remove the item from the cart
    if (item.quantity <= 0) {
      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    }

    // Save the updated cart
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete the cart
// Empty the cart (remove all items)
router.delete('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Cart emptied successfully',
      updatedCart: cart 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Remove Product from Cart
router.delete('/cart/:userId/items/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the product to remove it from the items array
    const updatedItems = cart.items.filter((item) => item.productId.toString() !== productId);

    // If no change, the product wasn't in the cart
    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.items = updatedItems;
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', updatedCart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get all Carts
router.get('/cart', async (req, res) => {
  try{
    const carts = await Cart.find().populate('items.productId');
    res.status(200).json(carts)
  }
  catch(error){
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error'});
  }
})



module.exports = router; 