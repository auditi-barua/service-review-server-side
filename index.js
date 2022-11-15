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



    app.get('/services_h', async (req, res) => {
      const query = {}
      const cursor = Services_Collection.find(query);
      const services = await cursor.limit(3).toArray();
      console.log(services)
      res.send(services);
    });

    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = Services_Collection.find(query);
      const services = await cursor.toArray();
      console.log(services)
      res.send(services);
    });

    app.post('/add_review', async (req, res) => {
      const review = req.body;
      console.log(review)
      const result = await Review_Collection.insertOne(review);
      res.json(result);
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

    app.get('/reviews', varifyToken, async (req, res) => {
      console.log({ email: req.query.email })
      const cursor = Review_Collection.find({ category: req.query.email });
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get('/my_reviews/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const service = await Review_Collection.findOne(query);
      res.send(service);
    });

    app.patch('/my_reviews/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const updateDoc = { $set: req.body };
      const result = await Review_Collection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete('/my_reviews/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await Review_Collection.deleteOne(query);
      res.send(result);
    });


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
