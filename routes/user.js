const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { joiPasswordExtendCore } = require('joi-password')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const joiPassword = Joi.extend(joiPasswordExtendCore)

const saltRounds = 10


const router = express.Router()

router.post('/createUser',async (req,res)=>{
    // we will validate the req (valid email valid password ....)
    const {error} = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    // we will valid the unicity of the email
    const email = await User.findOne({email:req.body.email})
    if(email) return res.status(400).send("this email already exist")
    // if the data sended to the server is valid and the email does'nt already exist
        // hash the password 
         req.body.password = await bcrypt.hash(req.body.password,saltRounds)
         //add the user to the db
         const user = new User(req.body)
         const result = await user.save()
         //here we will generate a token and send it to the client in the response header after we create the user 
        const token = await user.generateToken()
         res.header({"x-auth-token":token})
         res.send(result)
})

// update a user 1/ i will only update a user after he is authorized to do the update operation // he send a token this token if is verifed the user object of the request it will be populated with payloads of the token which will include id email username adress.. ext  
router.put('/update-user',auth,async(req,res)=>{
    const{error} = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const result = await User.findByIdAndUpdate({
        _id: req.user.id
    },{
        $set:req.body
    },{
        new:true
    })
    res.send(result)
})
// delete a user
router.delete('/delete-user',auth,async(req, res)=>{
    const result = await User.findByIdAndDelete(req.user.id)
    res.send(result)
})
// the me user 
router.get('/me',auth,async (req,res)=>{
    const result = await User.findById(req.user.id)
                .select({
                    username:1,
                    adress:1,
                    email:1
                })
    res.send(result)
})
// get all user
router.get('/getAllUser',auth,admin, async(req, res)=>{
    const result = await User.find()
    .select({
        username:1,
        adress:1,
        email:1,

    })
    res.send(result)
})





function validateUser(user){
    const schema = Joi.object({
        username: Joi.string()
        .min(4)
        .max(30)
        .required(),
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .max(100)
        .required(),
        password: joiPassword
        .string()
        .min(8)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .doesNotInclude(['password'])
        .required(),
        adress: Joi.string()
        .max(100)
        .required()
    })
    return schema.validate(user)
}
module.exports = router