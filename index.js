const express  =  require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const port = 5000
app.use(cors());
app.use(bodyParser.json())
app.use(cors());
const productsRoute  = require('./routers/products')
const addressRoute  = require('./routers/address')
const cartProducts  = require('./routers/cartProducts')
app.get('/',(req,res)=>{
    res.send('hello world')
})
app.use('/products',productsRoute)
app.use('/address',addressRoute)
app.use('/cartProduct',cartProducts)
app.listen(process.env.PORT || port)