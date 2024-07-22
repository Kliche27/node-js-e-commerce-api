const User = require('../models/user')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
router.post('/',async(req, res)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send('Invalid email or password')
    const result = await bcrypt.compare(req.body.password, user.password)
    //console.log(password)
    if(!result) return res.status(400).send("Invalid email or password")
    const token = await user.generateToken()
    res.header({"x-auth-token":token})
    res.send("you are loged in")    
})







module.exports = router