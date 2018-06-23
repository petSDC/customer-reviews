const connectionOptions = require('../config.js');
const cassandra = require('cassandra-driver');

const client = new cassandra.Client(connectionOptions);

exports.getReviews = function(productId, callback) {
  console.log(productId);
  const query = 'SELECT * FROM shop_reviews.reviews WHERE product_id=? ALLOW FILTERING';
  client.execute(query, [productId], {prepared: true}, (err, data) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

exports.postReview = function(data, callback) {
  const query = 'INSERT INTO shop_reviews.reviews (username, user_avatar, product_id, shop_id, date_submitted, rating, review, helpfulness) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  client.execute(query, data, {prepared: true}, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

exports.updateReview = function(helpfulness, callback) {
  const query = 'UPDATE shop_reviews.reviews SET helpfulness=?';
  client.execute(query, [helpfulness], {prepared: true}, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

exports.deleteReview = function(reviewId, callback) {
  const query = 'DELETE * FROM shop_reviews.reviews WHERE id=?';
  client.execute(query, [reviewId], {prepared: true}, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}
