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
        enum:['succed','refused','refund'],
        required: true
    }
},{
    timestamps:true
})