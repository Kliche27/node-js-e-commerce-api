const Order = require('../models/order')
const Payment = require('../models/payment')
const Fawn = require('fawn')
const express = require('express')
const auth = require('../middleware/auth')
const mongoose  = require('mongoose')
const config = require('config')
const admin = require('../middleware/admin')
const stripe = require('stripe')(config.get('stripeSecretKey'));
const router = express.Router()

router.post('/create',auth, async(req,res)=>{
    let orderStatus = 'pending'
    if(req.body.paymentStatus ==='succeeded') orderStatus = 'confirmed'
    else if (req.body.paymentStatus ==='refused') orderStatus ='canceled'
    const order = new Order({
        user_id: req.user.id,
        orderItems: req.body.cartItems,
        shippingAdress: req.body.shippingAdress,
        orderStatus: orderStatus, 
    })
    const payment = new Payment({
        orderId: order._id,
        paymentMethod: req.body.paymentMethod,
        paymentStatus: req.body.paymentStatus,
        paymentIntentId: req.body.paymentIntentId
    })
    const[paymentResult,orderResult] = await Promise.all(
        payment.save(),
        order.save() 
    )    
    res.send({paymentResult,orderResult})
})
router.put('/canceled/:id', auth, async(req, res)=>{
    const id = req.params.id
    const order = await Order.findById(id)
    if(!order) return res.status(404).send('Invalid order id')
    if(order.orderStatus != 'confirmed') return res.status(400).send('cannot cancel order')
    const payment = await Payment.findOne({orderId:order._id})
    // refunded using stripe api to refund the payment based on his paymentIntentId
    payment.paymentStatus = 'refunded'
    order.orderStatus = 'canceled'
    const [paymentResult,orderResult]= await Promise.all([
        payment.save(),
        order.save()
    ])
    res.send({paymentResult,orderResult})
}
)
router.put('/update-status/:id', auth, admin, async(req,res)=>{
    // validate the request body to be a value that included in this array ['shipped',delivered]
    const id = req.params.id
    const order = await Order.findById(id)
    if(!order) return res.status(404).send('Invalid order id')
    order.orderStatus = req.body.orderStatus
    const result = await order.save()
    res.send(result)
})
router.get('/get-order/:id', auth, async(req, res)=>{
    const userOrders = await Order.find({user_id:req.user.id})
    const order = userOrders.find(item => item._id.toString() === req.params.id)
    if(!order) return res.status(404).send('inexistant order')
    res.send(order)
})
router.get('/get-all-order', auth, admin, async(req, res)=>{
    const allOrders = await Order.find()
    .populate(
        {path:'orderItems.productId'}
    )
    .sort({
        updatedAt:-1
    })
    res.send(allOrders)
})
router.get('/get-user-orders', auth, async(req,res)=>{
    const userOrders = await Order.find({user_id:req.user.id})
    .populate({
        path:'orderItems.productId'
    })
    .select({
        user_id:0
    })
    .sort({
        updatedAt:-1
    })
    res.send(userOrders)
})
router.get('/get-all-canceled-orders', auth, admin, async(req, res)=>{
    const result = await Order.find({orderStatus:'canceled'})
    .populate({
        path:'orderItems.productId'
    })
    .populate({
        path:'user_id'
    })
    .sort({
        updatedAt:-1
    })
    res.send(result)
})
router.get('/get-all-shipped-orders', auth, admin, async(req, res)=>{
    const result = await Order.find({orderStatus:'shipped'})
    .populate({
        path:'orderItems.productId'
    })
    .populate({
        path:'user_id'
    })
    .sort({
        updatedAt:-1
    })
    res.send(result)
})
router.get('/get-all-delivered-orders', auth, admin, async(req, res)=>{
    const result = await Order.find({orderStatus:'delivered'})
    .populate({
        path:'orderItems.productId'
    })
    .populate({
        path:'user_id'
    })
    .sort({
        updatedAt:-1
    })
    res.send(result)
})
module.exports = router