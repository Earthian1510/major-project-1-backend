const express = require('express')
const Category = require('../models/category.model')

const router = express.Router()

// Category API 
// GET all Categories
router.get('/categories', async(req, res) => {
    try{
        const categories = await Category.find()
        res.json(categories)
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

// GET a Category by ID
router.get('/categories/:id', async(req, res) => {
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

// POST a Category
router.post('/categories', async(req,res) => {
    const { name, imageUrl } = req.body;
    try{
        const newCategory = new Category({name, imageUrl})
        await newCategory.save()
        res.status(201).json(newCategory)
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error"})
    }
})

// UPDATE a Category
router.put('/categories/:id', async(req, res) => {
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

// DELETE a Category
router.delete('/categories/:id', async(req, res) => {
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

module.exports = router;