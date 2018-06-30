require('newrelic');
const express = require("express");
const redis = require('redis');
const config = require('../config.js');
const db = require('../database/helpers.js');

const redisPort = config.redisPort;
const port = process.env.port || 3001;

const client = redis.createClient(redisPort);
const app = express();

app.use(express.json());

app.use("/:id", express.static(__dirname + "/../public"));

app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  });
  next();
});

const cache = function(req, res, next) {
  client.get(req.params.id, (err, data) => {
    if (data) {
      res.json(data);
    } else {
      next();
    }
  });
}

app.get("/:id/reviews", cache, (req, res) => {
  db.getReviews(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      client.setex(req.params.id, 3600, JSON.stringify(data));
      res.json(data);
    }
  });
});

app.post("/:id/reviews", (req, res) => {
  const postData = {
    username: req.body.username,
    productId: req.params.id,
    dateSubmitted: req.body.dateSubmitted,
    rating: req.body.rating,
    review: req.body.review,
    shopId: req.body.shopId,
  }
  db.postReview(postData, (err, data) => {
    if (err) {
      console.log('Error posting: ', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

app.put("/:id/reviews", (req, res) => {
  const putData = {
    helpfulness: req.body.helpfulness,
    id: req.body.id,
  };
  db.updateReview(putData, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

app.options("/:id/reviews", (req, res) => {
  res.set({
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT"
  }).end();
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));
