const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    city: {
        type: String,
        required: true 
    }, 
    state: {
        type: String,
        required: true 
    }, 
    apartment: {
        type: String,
        required: true 
    }, 
    street: {
        type: String,
        required: true 
    }, 
    phoneNo: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    isPrimary: {
        type: Boolean,
        default: false // A flag to mark the primary address
    }

})

module.exports = mongoose.model('Address', addressSchema)