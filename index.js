const express = require('express')
const mongoose = require('mongoose')
const product = require('./routes/product')
const user = require('./routes/user')
const auth = require('./routes/auth')
const cart = require('./routes/cart')
const order = require('./routes/order')
mongoose.connect('mongodb://localhost:27017/e-commerce-app')
.then(()=>console.log('connecting to the db'))
.catch(err=>console.log(err))

const app = express()


app.use(express.json())
app.use('/api/product',product)
app.use('/api/user',user)
app.use('/api/auth',auth)
app.use('/api/cart',cart)
app.use('/api/order',order)

app.listen(3000,()=> console.log('server listen to port 3000'))