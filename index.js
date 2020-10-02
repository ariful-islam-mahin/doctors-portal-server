const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmoae.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const patientsCollection = client.db("doctorsPortal").collection("patients");
  const doctorsCollection = client.db('doctorsPortal').collection("doctors");
  
  app.post('/addDoctors', (req, res) => {
    const doctors = req.body;
    doctorsCollection.insertMany(doctors)
    .then(result => {
      console.log(result);
      res.send(result)
    })
  })

  app.get('/doctors', (req, res) => {
    doctorsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  // app.post('/addPatient', (req, res) => {
  //   const patient = req.body;
  //   patientsCollection.insertOne(patient)
  //   .then(result => {
  //     console.log('submited',result)
  //     res.send( result)
  //   })
  // })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

});


app.listen(5000)