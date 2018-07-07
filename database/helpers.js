const { Pool } = require('pg');

const client = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 200,
});

const getQuery = `SELECT reviews.id, users.username, users.avatar_url, products.product, products.img_url, products.shop_id, reviews.date_submitted, reviews.rating, reviews.review, reviews.helpfulness FROM products INNER JOIN reviews ON reviews.product_id=products.id AND products.shop_id=(SELECT shop_id FROM products WHERE products.id=$1) INNER JOIN users ON reviews.user_id=users.id`;
const insertUserQuery = `INSERT INTO users (username, avatar_url) VALUES ($1, 'https://cdn2.iconfinder.com/data/icons/mixed-icon-collection/100/dog-128.png') RETURNING id`;
const insertReviewQuery = `INSERT INTO reviews (user_id, product_id, date_submitted, rating, review, helpfulness, shop_id) VALUES ($1, $2, $3, $4, $5, 0, $6)`;
const updateQuery = `UPDATE reviews SET helpfulness=$1 WHERE id=$2`;
const deleteQuery = `DELETE FROM reviews * WHERE id=$1`;

exports.getReviews = function(productId, callback) {
  client.query(getQuery, [productId])
  .then(data => {
    callback(null, data);
  })
  .catch(err =>{
    callback(err, null);
  })
}

exports.postReview = function(postData, callback) {
  client.query(insertUserQuery, [postData.username])
  .then(results => {
    client.query(insertReviewQuery, [results.rows[0].id, postData.productId, postData.dateSubmitted, postData.rating, postData.review, postData.shopId])
    .then(data => callback(null, data))
    .catch(err => callback(err, null));
  })
  .catch(err => callback(err, null));
}

exports.updateReview = function(putData, callback) {
  client.query(updateQuery, putData)
  .then(data => callback(null, data))
  .catch(err => callback(err, null));
}

exports.deleteReview = function(reviewId, callback) {
  client.query(deleteQuery, [reviewId])
  .then(data => callback(null, data))
  .catch(err => callback(err, null)); 
}

exports.client = client;
