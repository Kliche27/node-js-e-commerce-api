const { required } = require('joi')
const mongoose = require('mongoose')
const paymentSchema = new mongoose.Schema({
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    paymentMethod:{
        type: String,
        required: true,
    },
    paymentStatus:{
        type: String,
        enum:['succeeded','refused','refunded'],
        required: true
    },
    paymentIntentId:{
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps:true
})

const Payment = mongoose.model('payment',paymentSchema)
module.exports = Payment