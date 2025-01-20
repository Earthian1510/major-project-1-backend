const express = require('express')
const Order = require('../models/order.model')

const router = express.Router()


// GET all orders
router.get('/orders', async(req, res) => {
    try{
        const orders = await Order.find()
        res.status(200).json(orders);
    }
    catch(error) {
        res.status(500).json({message: "Error fetching orders", error})
    }
})

// GET an order by ID
router.get('/orders/:userId', async(req, res) => {
    const userId = req.params.userId
    try{
        const userOrders = await Order.find({ userId })
        res.status(200).json(userOrders)
    }
    catch(error) {
        res.status(500).json({message: "Error fetching user orders", error})
    }
})

// POST an order
router.post('/orders/:userId', async(req,res) => {
    try{
        const { orderInfo, shippingAddress, paymentStatus } = req.body;
        const { userId } = req.params;

        const newOrder = new Order({ userId, orderInfo, shippingAddress, paymentStatus })
        
        const savedOrder = await newOrder.save()
        res.status(201).json(savedOrder)
    }
    catch(error){
        res.status(500).json({message: "Error creating order", error})
    }
})

// UPDATE an orders
router.put('/orders/:id/cancel', async(req, res) => {
    const orderID = req.params.id 
    
    try{
       const order = await Order.findById(orderID)
       if(!order){
        return res.status(404).json({ message: "Order not found" })
       }

       if(order.status === 'Shipped' || order.status === 'Delivered') {
        return res.status(400).json({ message: "order cannot be cancelled because it is already shipped or delivered"})
       }

       order.status = 'Cancelled';

       const updatedOrder = await order.save();
       res.status(200).json(updatedOrder)

    } 
    catch(error) {
        res.status(500).json({ message: "Error updating order", error })
    }
})

// DELETE an orders
router.delete('/orders/:orderId', async(req, res) => {
    const orderID = req.params.orderId
    try{
        const deletedOrder = await Order.findByIdAndDelete(orderID)
        if(!deletedOrder) {
            res.status(404).json({error: "order not found"})
        }
        res.status(200).json({message: "order deleted successfully", order: deletedOrder})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = router

