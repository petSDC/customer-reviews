const express = require("express");
const mysql = require("mysql");
const db = require("./config.js");

const port = process.env.port || 3001;
const app = express();

db.connect();

app.use(express.json());

app.use("/:id", express.static(__dirname + "/../public"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/:id/reviews", (req, res) => {
  let productId = req.params.id;
  db.query(`SELECT reviews.id, users.username, users.img_url AS user_img, products.product, products.img_url AS product_img, reviews.shop_id, reviews.date_submitted, reviews.rating, reviews.review, reviews.votes, reviews.helpfulness 
  FROM reviews INNER JOIN products INNER JOIN users 
  ON reviews.user_id = users.id AND reviews.product_id = products.id 
  AND reviews.shop_id = (SELECT shop_id FROM products WHERE id = ${productId})`, (err, results) => {
    err
    ? res.status(500).end()
    : res.status(200).json(results);
  });
});

app.post("/:id/reviews", (req, res) => {
  let productId = req.params.id;
  db.query(`INSERT INTO users (username, img_url) 
  VALUES ("${req.body.username}", "https://s3-us-west-1.amazonaws.com/front-end-capstone-images/default.png")`)
  .on("error", err => {
    res.status(500).json(err);
  })
  .on("result", results => {
    let userId = results.insertId;
    db.query(`INSERT INTO reviews (user_id, product_id, date_submitted, rating, review, votes, helpfulness, shop_id)
    VALUES (${userId}, ${productId}, "${req.body.dateSubmitted}", ${req.body.rating}, "${req.body.review}", 0, 0, ${req.body.shopId})`, (err, results) => {
      err
      ? res.status(500).json(err)
      : res.status(201).json(results);
    });
  });
});

app.put("/:id/reviews", (req, res) => {
  db.query(`UPDATE reviews SET votes = ${req.body.votes}, helpfulness = ${req.body.helpfulness}
  WHERE id = ${req.body.id}`, (err, results) => {
    err
    ? res.status(500).json(err)
    : res.status(204).end();
  });
});

app.options("/:id/reviews", (req, res) => {
  res.set({
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT"
  }).end();
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));
