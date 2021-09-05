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
  const AllProductCollection = client.db("fake-shop").collection("AllProduct");
  const UseBuyProductCollection = client.db("fake-shop").collection("userBuyProduct");
  router.get("/allProducts",(req,res,next)=>{
    const searchValue  = req.headers.searchitem;
    // console.log(searchValue.toLowerCase())

    if(searchValue){
      AllProductCollection.find({searchQuarry:{$regex:searchValue.toLowerCase()}})
        .toArray((err, documents) => {
          res.send(documents)
        })
    }
    else{
      AllProductCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    }
  })
  // router.get("/searchQuarry/:searchValue",(req,res,next)=>{
    // const searchValue  = req.params.searchValue;
    // console.log(searchValue.toLowerCase())
  //   AllProductCollection.find({searchQuarry:{$regex:searchValue.toLowerCase()}})
  //   .toArray((err, documents) => {
  //     res.send(documents)
  //   })
  // })
    router.post('/userBuyProduct',(req, res ,next) =>{
      const id = req.body.id
      const title = req.body.title
      const description = req.body.description
      const category = req.body.category
      const image = req.body.image
      const price = req.body.price
      const quantity = req.body.quantity
      const email = req.body.email
      const date = req.body.date
      const paymentID = req.body.paymentId
      const totalPrice = req.body.totalPrice
      const userAddress =req.body.userAddress
      UseBuyProductCollection.insertOne({id:id, title:title, description:description, category:category,price:price,image:image,quantity:quantity,email:email,date:date,totalPrice:totalPrice,paymentID:paymentID,userAddress:userAddress})
        .then(result => {
          res.status(201).send(result.insertedCount > 0);
        })
      })
      router.get("/userOrderProducts",(req,res,next)=>{
        const email = req.headers.email
        UseBuyProductCollection.find({email:email})
        .toArray((err, documents) => {
          res.status(200).send(documents)
        })
      })
    // router.post("/addToCart",(req,res,next)=>{
    //   const email = req.body.email
    //   cartProductCollection.find({email:email})
    //   .toArray((err, documents) => {
    //     res.send(documents)
    //   })
    // })
    router.get("/addToCartSingleProduct",(req,res,next)=>{
      const id = req.headers.id
      console.log(id)
      cartProductCollection.find({_id:ObjectId(id)})
      .toArray((err, documents) => {
        res.status(200).send(documents[0])
        console.log(documents[0])
      })
    })
    // router.post("/deleteAddToCart",(req,res,next)=>{
    //   const id = req.body.id
    //   cartProductCollection.deleteOne({_id:ObjectId(id)})
    //   .then(result => {
    //     res.send(result.deletedCount>1)
    //   })
    // })
    router.post("/singleProduct",(req,res,next)=>{
      let id = req.body.id
      // console.log(id)
      AllProductCollection.find({_id:ObjectId(id)})
      .toArray((err, documents) => {
        res.status(200).send(documents[0])
      })
    })
    
});
module.exports = router