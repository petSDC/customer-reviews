require('newrelic');
const express = require('express');
const db = require('../database/helpers.js');

const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use('/:id', express.static(__dirname + '/../public'));

app.use((req, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  });
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
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

app.put('/:id/reviews', (req, res) => {
  const putData = [req.body.helpfulness, req.body.id];
  db.updateReview(putData, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

app.delete('/:id/reviews', (req, res) => {
  db.deleteReview(req.body.reviewId, (err, data) => {
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
