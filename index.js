const express = require('express')
const mongoose = require('mongoose')
const product = require('./routes/product')
const user = require('./routes/user')
const auth = require('./routes/auth')
mongoose.connect('mongodb://localhost:27017/e-commerce-app')
.then(()=>console.log('connecting to the db'))
.catch(err=>console.log(err))

const app = express()


app.use(express.json())
app.use('/api/product',product)
app.use('/api/user',user)
app.use('/api/auth',auth)
app.listen(3000,()=> console.log('server listen to port 3000'))