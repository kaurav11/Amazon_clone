const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51J0VlpSHc9hfR6CHJD8ojyOzmrUuiB7dRp7p2BrS399pYcObCH4Xg9ZGwEGe96vK4MMWoOnQlS7HC3Y4WEyRpuKN00H34JGYbg');

// Api 


//-App config
const app = express();

//Middleware

app.use(cors({ origin: true }));
app.use(express.json());

//API routes
app.get('/', (request, response) => response.status(200).send('hello'));

app.post('/payments/create', async (request, response) =>{
    const total = request.query.total;

    console.log("payment request received for this amount", total);

    const paymentIntent =await stripe.paymentIntents.create({
        amount: total, //subunits of currency
        currency: "usd",
    });
    //ok-created
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    });
});
//listen commands

exports.api = functions.https.onRequest(app);

//http://localhost:5001/clone-6378b/us-central1/api