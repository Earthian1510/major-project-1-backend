const express = require('express')
const Address = require('../models/address.model')

const router = express.Router()

// Address API
// GET all Addresses
router.get('/api/user/address', async(req, res) => {
    try{
        const address = await Address.find()
        res.json(address)
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

// GET an Address
router.get('/api/user/address/:id', async(req, res) => {
    const addressID = req.params.id
    try{
        const address = await Address.findById(addressID)
        if(!address){
            res.status(404).json({message: "address not found!"} )
        }
        res.status(200).json({address: address})
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

// POST an Address
router.post('/api/user/address', async(req,res) => {
    const { name, address, phoneNo } = req.body;
    try{
        const newAddress = new Address({name, address ,phoneNo})
        await newAddress.save()
        res.status(201).json(newAddress)
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error"})
    }
})

// UPDATE an Address
router.put('/api/user/address/:id', async(req, res) => {
    const addressID = req.params.id 
    const addressToUpdate = req.body 
    try{
        const updatedAddress = await Address.findByIdAndUpdate(addressID, addressToUpdate, {new: true})
        if(!updatedAddress) {
            res.status(404).json({message: "Category not found"})
        }
        res.status(200).json(updatedAddress)
    } 
    catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

// DELETE an Address
router.delete('/api/user/address/:id', async(req, res) => {
    const addressID = req.params.id 
    try{
        const deletedAddress = await Address.findByIdAndDelete(addressID)
        if(!deletedAddress) {
            res.status(404).json({error: "address not found"})
        }
        res.status(200).json({message: "address deleted successfully", address: deletedAddress})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = router

