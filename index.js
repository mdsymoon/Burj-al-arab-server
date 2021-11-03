const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const port = 5000;

var serviceAccount = require("./configs/burj-al-arab33-firebase-adminsdk-jsr5k-c8331bc962.json");

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8cqw.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookings = client.db("burjAlArab").collection("bookings");

  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(newBooking);
  });

  app.get("/bookings", (req, res) => {
    bookings.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });

  });
  app.get('/products', (req, res) => {
    productsCollection
  })
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
