const express = require('express')
const AddressDB = require('../models/address.model')

const router = express.Router()


router.get('/address', async(req, res) => {
    try{
        const address = await AddressDB.find()
        res.status(200).json(address)
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching addresses", error })
    }
})

router.get('/address/:userId', async(req, res) => {
    const userId = req.params.userId
    try{
        const address = await AddressDB.find({ userId })
        if(!address){
            res.status(404).json({message: "address not found!"} )
        }
        res.status(200).json(address)
    }
    catch(error) {
        res.status(500).json({message: "Internal Server Error", error})
    }
})

// GET a specific address for a user 
router.get('/address/:userId/:id', async (req, res) => {
    const { userId, id } = req.params;
    try{
        const address = await AddressDB.findOne({ _id: id, userId });

        if(!address){
            return res.status(404).json({ message: "Address not found!"})
        }

        res.status(200).json({ address })
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error })
    }
})


// POST an Address
router.post('/address/:userId', async(req,res) => {
    try{
        const { userId } = req.params;
        const {  name, city, state, apartment, street, phoneNo, zipcode, isPrimary } = req.body;
        
        const newAddress = new AddressDB({
            userId,
            name, 
            city, 
            state, 
            apartment, 
            street, 
            phoneNo, 
            zipcode,
            isPrimary
        })

        await newAddress.save()
        res.status(201).json(newAddress)
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error", error})
    }
})

// UPDATE an Address
router.put('/address/:userId/:id', async(req, res) => {
   
    const { userId, id } = req.params;
    const { name, city, state, apartment, street, phoneNo, zipcode, isPrimary } = req.body;
    
    try{
      const address = await AddressDB.findById(id)
      
      if(!address){
        return res.status(404).json({ message: "Address not found" })
      }

      if(address.userId.toString() !== userId){
        return res.status(403).json({ message: "You do not have permission to update this address" })
      }

      Object.assign(address, { name, city, state, apartment, street, phoneNo, zipcode, isPrimary });

      const updatedAddress = await address.save();
      res.status(200).json(updatedAddress);
      
    } 
    catch(error) {
        res.status(500).json({message: "Internal Server Error", error})
    }
})

// DELETE an Address
router.delete('/address/:id', async(req, res) => {
    const addressID = req.params.id 
    try{
        const deletedAddress = await AddressDB.findByIdAndDelete(addressID)
        if(!deletedAddress) {
            res.status(404).json({error: "address not found"})
        }
        res.status(200).json({message: "address deleted successfully", address: deletedAddress})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Internal Server Error", error})
    }
})

module.exports = router

