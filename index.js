const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;


//midleware



app.use(cors());
app.use(express.json());

//console.log(process.env.DB_USER)
//console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3njemyu.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;

  if(!authHeader){
      return res.status(401).send({message: 'unauthorized access'});
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
      if(err){
          return res.status(403).send({message: 'Forbidden access'});
      }
      req.decoded = decoded;
      next();
  })
}


const run = async () => {
  try {

      const Services_Collection = client.db('review-site').collection('servises');
      

      app.get('/services', async (req, res) => {
          const cursor = Services_Collection.find({});
          const services = await cursor.toArray();
          res.send(services);
      });

  } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
  }
}

run().catch(console.dir);


app.get("/",  (req, res) => {
  res.send("service Api running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
