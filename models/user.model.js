const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
    },
    userImage: {
        type: String
    },
    address: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address'
        }
    ], 
    orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist'
    },
    
})

module.exports = mongoose.model('UserDB', userSchema)