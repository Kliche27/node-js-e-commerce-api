const { required, types } = require('joi')
const mongoose =require('mongoose')
const orderSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    orderItems:{
        type:[{
            productId: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'product',
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
        enum:['confirmed','canceled','delivered','shipped']
    },
    },{
        timestamps:true
    }
)
orderSchema.methods.calculPrice = function (){
    let price =0
    for (i =0 ; i < this.orderItems.length;i++){
        productPrice = this.orderItems[i].productId.
        price += this.orderItems[i].price * this.orderItems[i].quantity
    }
    console.log(price)
    return price 
}
const Order = mongoose.model('order', orderSchema)
module.exports = Order