const { required, types } = require('joi')
const mongoose =require('mongoose')
const orderSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orderItems:{
        type:[{
            productId: 
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type:Number,
                required: true
            }
        }]
    },
    totalPrice:Number,
    shippingAdress:{
        type: String,
        required: true
    },
    orderStatus:{
        type:String,
        enum:['confirmed','canceled','delivered','shipped','pending']
    },
    },{
        timestamps:true
    }
)
const Order = mongoose.model('order', orderSchema)
module.exports = Order