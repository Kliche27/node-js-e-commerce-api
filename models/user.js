const validator = require('validator')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
     //   unique:true,
        maxlength:50,
        minlength:4,
        trim:true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        maxlength:100,
        lowercase:true,
        trim:true,
        validate:{
            validator: (value)=>validator.isEmail(value),
            message:(pros)=>`${pros.value} is not a valid email!`
        }
    },
    password:{
        type:String,
        required:true,
    },
    adress:{
        type:String,
        required:true,
        max:100
    },
    isAdmin:{
        type:Boolean
    }
},{ timestamps:true })
userSchema.methods.generateToken = async function (){
    const secretKey = config.get('secretKey')
    return await jwt.sign({
        id: this._id,
        username:this.username,
        email:this.email,
        isAdmin:this.isAdmin,
        adress:this.adress,
      
     },secretKey)
}
const User = mongoose.model('user',userSchema)
module.exports = User