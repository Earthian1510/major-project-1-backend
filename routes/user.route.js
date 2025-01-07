const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserDB = require('../models/user.model')
const verifyJWT = require('../middleware/verifyJWT')
const router = express.Router();

const JWT_SECRET = 'mySecret'
const SALT_ROUNDS = 10;


// User : APIs for CRUD 
// -------------------------------
// GET all user
router.get('/users', async (req, res) => {
    try{
        const users = await UserDB.find()
        res.json(users)
    }
    catch(error){
        res.status(500).json({ error: "Internal server error" })
    }
})

// POST a new user 
router.post('/auth/signup', async (req, res) => {
    const { name, address, phoneNo, email, orders, userImage, password, cart, wishlist} = req.body 

    try{
        const existingUser = await UserDB.findOne({ email });
        if(existingUser){
            return res.status(400).json({message: "User with this email already exists"})
        }
        else{
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const user = new UserDB({name, address, phoneNo, email, orders, userImage, password: hashedPassword, cart, wishlist})
            await user.save();
            res.status(201).json({message: "User created successfully"});
        }        
    }
    catch(error){
        console.error(error)
        res.status(500).json({ error: "Internal server error occured"})
    }
})

// PUT to update user
router.put('/users/:id', async (req, res) => {
    const userId = req.params.id 
    const userDataToUpdate = req.body;

    try{
        const updatedUser = await UserDB.findByIdAndUpdate( userId, userDataToUpdate, {new: true});
       if(!updatedUser){
        return res.status(404).json({message: "User not found"})
       }
       res.status(200).json(updatedUser)
    }
    catch(error){
        console.error(error)
        res.status(500).json({ error: "Internal server error occured"})
    }
})

// DELETE a user
router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id 
   
    try{
        const deletedUser = await UserDB.findByIdAndDelete( userId );
       if(!deletedUser){
        return res.status(404).json({message: "User not found"})
       }
       res.status(200).json({message: "User deleted successfully", deletedUser: deletedUser})
    }
    catch(error){
        console.error(error)
        res.status(500).json({ error: "Internal server error occured"})
    }
})

// POST Login - authentication of a user
router.post('/auth/login', async (req, res) => {
    const { email, password} = req.body;

    try{
        const user = await UserDB.findOne({ email })
        if(!user){
            return res.status(400).json({ message: 'Invalid email'})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid)
        if(!isPasswordValid){
            return res.status(400).json({message: 'Invalid Password'})
        }

        const token = jwt.sign({ userId: user._id}, JWT_SECRET, {expiresIn: '1hr'})
        res.json({token})
    }
    catch(error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(402).json({ message: 'Invalid token' });
    }
})

// protected routes
router.get('/protected', verifyJWT, (req, res) => {
    res.json({message: "Protected route accessible"})
})



module.exports = router;