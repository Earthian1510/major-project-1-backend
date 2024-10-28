const mongoose = require('mongoose')
require('dotenv').config()

const mongoURL = process.env.MONGO_DB 

const initializeDatabase = async () => {
    try{
        const connection = await mongoose.connect(mongoURL, {
            useNewUrlParser : true,
            useUnifiedTopology: true
        })

        if(connection){
            console.log('Connection Successful')
        }
    }
    catch(error) {
        console.log('Connection Failed')
    }
} 

module.exports = { initializeDatabase }
