const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51J0VlpSHc9hfR6CHJD8ojyOzmrUuiB7dRp7p2BrS399pYcObCH4Xg9ZGwEGe96vK4MMWoOnQlS7HC3Y4WEyRpuKN00H34JGYbg');


// API

// - App config
const app = express();

// - Middlewares
app.use(cors({ origin: true }));
app.use(express.json());


// - API routes
app.get('/', ( request, response ) => response.status(200).send
('hello world'));
app.post('/payments/create', async (request, response) => {
    try{
        const total = request.query.total;

        console.log('Payment Request Recieved BOOM!!! for this amount >>>', total);
    
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
        });
        console.log(paymentIntent.client_secret);
    
        response.status(201).send({
            clientSecret: paymentIntent.client_secret
        })
    }
    catch(e){
        console.log(e.message);
    }
    
})


// - listen command
exports.api = functions.https.onRequest(app);