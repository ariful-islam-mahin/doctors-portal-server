const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const admin = require('firebase-admin');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmoae.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const serviceAccount = require("./doctors-portal0-firebase-adminsdk-m0imp-29bc5ecb5c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://doctors-portal0.firebaseio.com"
});

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

  app.post('/addPatient', (req, res) => {
    const patient = req.body;
    patientsCollection.insertOne(patient)
    .then(result => {
      console.log('submited',result)
      res.send( result)
    })
  })

  app.get('/patients', (req, res) => {
    const brarer = req.headers.authorization;
    if(brarer && brarer.startsWith('Bearer ')){
        const idToken = brarer.split(' ')[1];
        console.log({idToken});
        admin.auth().verifyIdToken(idToken)
          .then(function(decodedToken) {
            const tokenEmail = decodedToken.email;
            const queryEmail = req.query.email;
            console.log(tokenEmail, queryEmail)
            if(tokenEmail == queryEmail){
              patientsCollection.find({email: queryEmail})
              .toArray((err, documents) => {
                res.send(documents)
              })
            }
          })
          .catch(function(error) {
            // Handle error
          });
    }
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

});


app.listen(4000)