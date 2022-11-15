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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hpc3ria.mongodb.net/?retryWrites=true&w=majority`;

//console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
  try {

    const Services_Collection = client.db('review-site').collection('services');
    const Review_Collection = client.db('review-site').collection('reviews');



    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = Services_Collection.find(query);
      const services = await cursor.toArray();
      console.log(services)
      res.send(services);
    });

    app.get('/reviews', async (req, res) => {
      const query = {}
      const cursor = Review_Collection.find(query);
      const reviews = await cursor.toArray();
      // console.log(reviews);
      res.send(reviews)
    })

    app.get('/myreviews', async (req, res) => {
      const cursor = Review_Collection.find({ email: req.query.email });
      const reviews = await cursor.toArray();
      res.send(reviews);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
