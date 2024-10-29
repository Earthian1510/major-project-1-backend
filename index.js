const express = require('express')
const cors = require('cors')

const app = express()
const {initializeDatabase} = require('./db/db.connection')
const {Category} = require('./models/category.model')
const {Product} = require('./models/products.model')

app.use(cors())
app.use(express.json())

initializeDatabase()

app.get('/api', (req, res) => {
    res.send("Hello Express")
})

// Product API
app.get('/api/products', async(req, res) => {
    try{
        const products = await Product.find()
        res.json(products)
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.get('/api/products/:id', async(req, res) => {
    const productId = req.params.id
    try{
        const product = await Product.findById(productId)
        if(!product){
            res.status(404).json({message: "Product not found!"} )
        }
        res.status(200).json({product: product})
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.get('/api/products/category/:category', async (req, res) => {
    const category = req.params.category
    try{
        const products = await Product.find({category: category})
        res.status(200).json({products: products})
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})


app.post('/api/products', async(req,res) => {
    const { name, price, description, category, imgUrl } = req.body;
    try{
        const newProduct = new Product({name, price, description, category, imgUrl})
        await newProduct.save()
        res.status(201).json(newProduct)
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.put('/api/products/:id', async(req, res) => {
    const productId = req.params.id 
    const productToUpdate = req.body 
    try{
        const updatedProduct = await Product.findByIdAndUpdate(productId, productToUpdate, {new: true})
        if(!updatedProduct) {
            res.status(404).json({message: "Product not found"})
        }
        res.status(200).json(updatedProduct)
    } 
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.delete('/api/products/:id', async(req, res) => {
    const productId = req.params.id 
    try{
        const deletedProduct = await Product.findByIdAndDelete(productId)
        if(!deletedProduct) {
            res.status(404).json({error: "Product not found"})
        }
        res.status(200).json({message: "Product deleted successfully", product: deletedProduct})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
})

// Category API 
app.get('/api/categories', async(req, res) => {
    try{
        const categories = await Category.find()
        res.json(categories)
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.get('/api/categories/:id', async(req, res) => {
    const categoryId = req.params.id
    try{
        const category = await Category.findById(categoryId)
        if(!category){
            res.status(404).json({message: "category not found!"} )
        }
        res.status(200).json({category: category})
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.post('/api/categories', async(req,res) => {
    const { name, imgUrl } = req.body;
    try{
        const newCategory = new Category({name, imgUrl})
        await newCategory.save()
        res.status(201).json(newCategory)
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.put('/api/categories/:id', async(req, res) => {
    const categoryId = req.params.id 
    const categoryToUpdate = req.body 
    try{
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, categoryToUpdate, {new: true})
        if(!updatedCategory) {
            res.status(404).json({message: "Category not found"})
        }
        res.status(200).json(updatedCategory)
    } 
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

app.delete('/api/categories/:id', async(req, res) => {
    const categoryId = req.params.id 
    try{
        const deletedCategory = await Category.findByIdAndDelete(categoryId)
        if(!deletedCategory) {
            res.status(404).json({error: "category not found"})
        }
        res.status(200).json({message: "category deleted successfully", category: deletedCategory})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})