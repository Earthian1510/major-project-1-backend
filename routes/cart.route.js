const express = require('express')
const Cart = require('../models/cart.model')
const router = express.Router();


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

// Increase or Decrease Product Quantity 
router.patch('/cart/:userId/item/:productId', async( req, res) => {
  const { userId, productId} = req.params
  const { action } = req.body; 
  
  try{
    const cart = await Cart.findOne({ userId })
    if(!cart){
      const newCart = new Cart({ userId, items: [] });
      await newCart.save();
    }

    const item = cart.items.find((item) => item.productId.toString() === productId)
    if(action === 'increase'){
      item.quantity += 1;
    }
    else if(action === 'decrease'){
      item.quantity -= 1;

      if(item.quantity <= 0){
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId)
      }
    }
    else{
      return res.status(400).json({ message: 'Invalid action.'})
    }

    const updatedCart = await cart.save()
    res.status(200).json(updatedCart)

  }
  catch(error){
    console.error(error)
    res.status(500).json({ message: 'Internal server error'})
  }
})


// Delete the cart
router.delete('/cart/:id', async(req, res) => {
  const {id} = req.params
  try{
    const deletedCart = await Cart.findByIdAndDelete(id)
    if(!deletedCart){
      return res.status(404).json({message: "Cart not found"})
    }
    res.status(200).json({ message: 'Cart deleted successfully'})
  }
  catch(error){
    console.error(error)
    res.status(500).json({ message: 'Internal server error'})
  }
})

// Remove Product from Cart 
router.delete('/cart/:userId/item/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      res.status(200).json({ message: 'Product removed from cart', updatedCart: cart });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router; 