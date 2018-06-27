const express = require('express');
const mysql = require('mysql');
const faker = require('faker');
const db = require('../database/helpers.js');

const port = process.env.port || 3001;
const app = express();

app.use(express.json());

app.use('/:id', express.static(__dirname + '/../public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/:id/reviews', (req, res) => {
  db.getReviews(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
});

app.post('/:id/reviews', (req, res) => {
  const postData = [
    req.body.username,
    faker.internet.avatar,
    req.params.id,
    req.body.shopId,
    req.body.dateSubmitted,
    req.body.rating,
    req.body.review,
    0
  ]
  db.postReview(postData, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

app.put('/:id/reviews', (req, res) => {
  db.updateReview(req.body.helpfulness, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

app.delete('/:id/reviews', (req, res) => {
  db.deleteReview(reviewId, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

app.options('/:id/reviews', (req, res) => {
  res.set({
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT'
  }).end();
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));
