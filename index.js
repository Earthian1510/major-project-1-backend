const { initializeDatabase } = require('./db/db.connection')
const express = require('express')
const cors = require('cors')
const productRoutes = require('./routes/product.route')
const categoryRoutes = require('./routes/category.route')
const addressRoutes = require('./routes/address.route')
const userRoutes = require('./routes/user.route')
const cartRoutes = require('./routes/cart.route');
const wishlistRoutes = require('./routes/wishlist.route');

initializeDatabase()

const app = express()
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send("Hello Express")
})

app.use('/', productRoutes)
app.use('/', categoryRoutes)
app.use('/', addressRoutes)
app.use('/', userRoutes)
app.use('/', cartRoutes)
app.use('/', wishlistRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`--------------------------------------------`)
    console.log(`Server running on port http://127.0.0.1:${PORT}`)
    console.log(`--------------------------------------------`)
})