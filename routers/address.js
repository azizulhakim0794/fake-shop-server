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
  const addressCollection = client.db("fake-shop").collection("userAddress");
  router.get("/",(req,res,next)=>{
    const email = req.headers.email
    addressCollection.find({email:email})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })
  router.delete("/",(req,res,next)=>{
    const email = req.headers.email
    addressCollection.deleteOne({email:email})
    .then(result => {
      res.send(result.deletedCount>0);
    })
  })
  router.post('/',(req, res ,next) =>{
    const country = req.body.country
    const city = req.body.city
    const state = req.body.state
    const zip = req.body.zip
    const address = req.body.address
    const email = req.body.email
    addressCollection.insertOne({country:country, city:city, state:state,zip:zip,address:address,email:email})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    })
   
    
});
module.exports = router