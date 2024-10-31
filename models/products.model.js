const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    price: {
        type: Number,
        required: true 
    }, 
    description: {
        type: String
    }, 
    category: { type: String, required: true },
    inCart: { type: Boolean },
    inWishlist: { type: Boolean },
    quantity: {
        type: Number
    },
    imgUrl: {
        type: String
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports = { Product }