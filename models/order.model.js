const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    
    
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    }
})

module.exports = mongoose.model('Order', orderSchema)