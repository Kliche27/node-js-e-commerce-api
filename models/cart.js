const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    cartItems:{
        type:[{
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            },
            quantity:{
                type: Number,
                required:true,
                min:1
            }
        }]
    },
    totalPrice:{
        type:Number
    },
   
})
const Cart = mongoose.model('cart',cartSchema)
module.exports = Cart