const express = require('express')
const Order = require('../models/order.model')

const router = express.Router()

// Order APIs
// GET all orders
router.get('/user/orders', async(req, res) => {
    try{
        const orders = await Order.find({ userId: req.user.id })
        res.status(200).json(orders)
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

// GET an order by ID
router.get('/user/orders/:id', async(req, res) => {
    const orderID = req.params.id
    try{
        const order = await Order.findById(orderID)
        if(!order){
            res.status(404).json({message: "order not found!"} )
        }
        res.status(200).json({ order })
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

// POST an order
router.post('/user/orders', async(req,res) => {
    const { totalAmount, items, status } = req.body;
    try{
        const newOrder = new Order({ totalAmount, items, status })
        await newOrder.save()
        res.status(201).json(newOrder)
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error"})
    }
})

// UPDATE an orders
router.put('/user/orders/:id', async(req, res) => {
    const orderID = req.params.id 
    const orderToUpdate = req.body 
    try{
        const updatedOrder = await Order.findByIdAndUpdate(orderID, orderToUpdate, {new: true})
        if(!updatedOrder) {
            res.status(404).json({message: "Order not found"})
        }
        res.status(200).json(updatedOrder)
    } 
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

// DELETE an orders
router.delete('/user/orders/:id', async(req, res) => {
    const orderID = req.params.id 
    try{
        const deletedOrder = await orders.findByIdAndDelete(orderID)
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

