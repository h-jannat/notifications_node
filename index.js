const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const { read } = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
//const vapidKeys = webpush.generateVAPIDKeys();
// {
//     publicKey: 'BK2ETbxj0BqaJFzz2PhC-Kx_2DZXZ_s5V9RmukmqFW0U2Eq2kublMGW8N_b_rtCtVehqLjfuKrJlcOybtkOy9yQ',
//     privateKey: 'po7FCmAmhlyT43Uyp3tJ_52tE1ghVtLTmGg5DvVqBq4'
//   }
const publicKey = 'BK2ETbxj0BqaJFzz2PhC-Kx_2DZXZ_s5V9RmukmqFW0U2Eq2kublMGW8N_b_rtCtVehqLjfuKrJlcOybtkOy9yQ';
const privateKey = 'po7FCmAmhlyT43Uyp3tJ_52tE1ghVtLTmGg5DvVqBq4';
webpush.setVapidDetails('mailto:hend.jnnt@gmail.com', publicKey, privateKey);


FgRed = "\x1b[31m";
FgGreen = "\x1b[32m";
FgYellow = "\x1b[33m";
FgMagenta = "\x1b[35m";
FgCyan = "\x1b[36m";
const reqColors = {
  GET: FgCyan,
  POST: FgGreen,
  PATCH: FgYellow,
  PUT: FgMagenta,
  DELETE: FgRed
}
app.use((req, res, next) => {
  console.log(reqColors[req.method], `${req.method}: ${req.url}|  origin: ${req.headers.origin}, 'user-agent': ${req.headers["user-agent"]}`);
  console.log("\x1b[37m")
  next();
})


app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  console.log(req.body)
  // Send 201 - resource created
  res.status(201).json({});
  // Create payload
  const payload = JSON.stringify({ title: "Subscibed!", body: "We will send you the latest available updates" });
  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

app.post("/notification", (req,res) => {
  const endPointInfo = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/cOzmSaDIkuM:APA91bF1ldzNaNlE_LyJMXsz2WpNdt-ziaKq8XXumggfSfVzC78SjeF6CvZWR24VKXSHBQTZjD10SYhEmPpfANiV77bmKoYcFPtrl4S37MJ6JNV1q6NswoH7pfEjatf8QCEcKxb2TX_N',    
    expirationTime: null,
    keys: {
      p256dh: 'BCI1Ar8WgBNdh3niLvho6WibEkQvG2ARojA_pbwcnAU_rFtEMC3GM7Y1Q63wibQkZwLo_bYxhnfnzV7Gc3lv5ic',
      auth: 'hKlib3r_2u1d85TC13VnWQ'
    }};
    const payload = JSON.stringify({ title: "Notification", body: "New" });
    webpush
    .sendNotification(endPointInfo, payload)
    .catch(err => { 
      if(err.statusCode==410){
        console.log("no longer subscribed")
      }
      console.error(err.statusCode==410)
    });
    res.send({})
});



const port = 5000;
app.listen(port, async () => {
  console.log(`The app is running on port ${port}`)
});
