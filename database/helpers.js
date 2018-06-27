const config = require('../config.js');
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [config.host],
  keyspace: config.searchPath,
  pooling: {
    maxRequestsPerConnection: config.max,
  }
});

exports.getReviews = function(productId, callback) {
  const query1 = `SELECT shop_id FROM shop_reviews.reviews WHERE product_id=${productId} LIMIT 1`;
  client.execute(query1)
  .then(result => {
    const shopId = result.rows[0].shop_id;
    const query2 = `SELECT * FROM shop_reviews.reviews WHERE shop_id=${shopId}`;
    client.execute(query2)
    .then(data => callback(null, data))
    .catch(err => callback(err, null));
  })
  .catch(err => callback(err, null));
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
