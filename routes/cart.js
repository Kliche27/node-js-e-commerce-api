const Cart = require('../models/cart')
const Product= require('../models/product')
const express = require('express')
const Joi = require('joi')
const mongoose = require('mongoose')
const router = express.Router()

router.post('/create', async(req, res)=>{
    // this request will have a product with quantity
    console.log(req.body)
    const cart = new Cart({
        user_id: req.body.user_id,
        
        cartItems:[ 
            {
                productId: req.body.cartItems[0].productId,
                quantity: req.body.cartItems[0].quantity
            }]
        
    })
    const result = await cart.save()
    res.send(result)
})
router.put('/update',async(req, res)=>{
    const cart = await Cart.findById(req.body.cartId)
    if(!cart) return res.status(404).send('Invalid cart Id')
    const product = await Product.findById(req.body.productId)
    if(!product) return res.status(404).send('Invalid product Id')
    let cartItem = cart.cartItems.find(item => item.productId.toString() === req.body.productId)
    if(cartItem) cartItem.quantity = req.body.quantity
    else cart.cartItems.push({productId:req.body.productId, quantity:req.body.quantity})
    const result =await cart.save()
    res.send(result)
})
router.get('/get',async (req,res)=>{
    const cart =  await  Cart.findOne({user_id:req.body.user_id}).populate({
       path:'cartItems.productId'
    })
    if(!cart) return res.status(404).send('The current user doesnt have a cart')
    res.send(cart)
})
router.delete('/delete',async(req, res)=>{
    const cart = await Cart.findByIdAndDelete(req.body.cartId)
    res.send(cart)
})





module.exports = router 