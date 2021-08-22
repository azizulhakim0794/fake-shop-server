const express = require('express');
const { MongoClient } = require('mongodb');
const {ObjectId} = require('mongodb')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const router = express.Router()
const app = express();
app.use(bodyParser.json())
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsgbd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const cartProductCollection = client.db("fake-shop").collection("cartProduct");

  router.post('/',(req, res ,next) =>{
    const id = req.body.id
    const title = req.body.title
    const description = req.body.description
    const category = req.body.category
    const image = req.body.image
    const price = req.body.price
    const quantity = req.body.quantity
    const email = req.body.email
    cartProductCollection.insertOne({id:id, title:title, description:description, category:category,price:price,image:image,quantity:quantity,email:email})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    })
    router.get("/",(req,res,next)=>{
        const email = req.headers.email
      cartProductCollection.find({email:email})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })
    router.get("/addToCartSingleProduct",(req,res,next)=>{
      const id = req.headers.id
      console.log(id)
      cartProductCollection.find({_id:ObjectId(id)})
      .toArray((err, documents) => {
        res.send(documents[0])
        console.log(documents[0])
      })
    })
    router.delete("/",(req,res,next)=>{
      const id = req.headers.id
      cartProductCollection.deleteOne({_id:ObjectId(id)})
      .then(result => {
        res.send(result.deletedCount>1)
      })
    })
    
});
module.exports = router