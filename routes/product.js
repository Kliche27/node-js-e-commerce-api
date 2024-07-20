const mongoose = require('mongoose')
const Product = require('../models/product')
const express = require('express')
const Joi = require('joi')
const route = express.Router()
const auth = require('../middleware/auth')



route.post('/', async (req,res)=>{
 // first i will validate the request using joi
    // if the request is not validate a 400 response will be send to the client 
 // then i will check the unicity of the sku
    // if the sku not unique a 400 response will be send with error is sku existed already
 // create an istance of the model 
 // save it in the db
   const {error} = validateProduct(req.body)
   if(error) return res.status(400).send(error.details[0].message)
   const unicity = await Product.find({sku:req.body.sku})
   console.log(unicity)
   if(unicity[0]) return res.status(400).send("SKU must be unique")
   const product = new Product(req.body)
   const result = await product.save()
   res.send(result)
})
route.get('/',async (req, res)=>{
  const result = await Product.find()
  return res.send(result)
})
route.get('/:id',async (req, res)=>{
    const result = await Product.findById(req.params.id)
    if(!result) return res.status(404).send("Invalid id")
    res.send(result)
})
route.put('/:id', async(req, res)=>{
    const {error} = validateProduct(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const product = await Product.findById(req.params.id)
    if(!product) return res.status(404).send("Invalid id")
    product.set(req.body)
    const result = product.save()
    res.send(result)
    // res.send(result)
    // const id = await Product.findById(req.params.id)
    // const result = await Product.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true})
    // console.log(result)
    // res.send(result)
})
route.delete('/:id', auth, async (req,res)=>{
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product) return res.status(404).send("Invalid id")
    res.send(product)
})

function validateProduct(product){
    const schema = Joi.object({
        name: Joi.string().max(100).required(),
        price:  Joi.number().min(0).required(),
        category: Joi.string().valid(    
            "Electronics",
            "Fashion",
            "Home & Kitchen",
            "Beauty & Personal Care",
            "Health & Wellness",
            "Sports & Outdoors",
            "Toys & Games",
            "Automotive",
            "Books & Media",
            "Office Supplies",
            "Pet Supplies",
            "Baby Products",
            "Groceries",
            "Gifts & Occasions",
            "Art & Craft"),
        description: Joi.string().max(250),
        stockQuantity: Joi.number().min(0).required(),
        sku: Joi.string().required(),
        images: Joi.array().items(Joi.string()).required(),
        brand: Joi.string().max(50),
    })
    return schema.validate(product)
}
module.exports = route 


