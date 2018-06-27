const config = require('../config.js');
const { Pool } = require('pg');

const pool = new Pool({
  host: config.host,
  port: config.port,
  database: config.database,
  max: config.max,
  user: config.user,
  password: config.password,
});

exports.getReviews = function(productId, callback) {
  pool.connect((err, client, release) => {
    if (err) {
      callback(err, null);
    } else { 
      const queryString = `SELECT reviews.id, users.username, users.avatar_url, products.product, products.img_url, reviews.shop_id, reviews.date_submitted, reviews.rating, reviews.review, reviews.helpfulness FROM products INNER JOIN reviews ON reviews.product_id=products.id AND reviews.shop_id=(SELECT shop_id FROM products WHERE products.id=${productId}) INNER JOIN users ON reviews.user_id=users.id`;
      client.query(`SET search_path TO ${config.searchPath}`)
      .then(() => {
        client.query(queryString)
        .then(data => {
          release();
          callback(null, data);
        })
        .catch(err =>{
          release();
          callback(err, null);
        })
      })
      .catch(err => callback(err, null));
    }
  });
}

exports.postReview = function(postData, callback) {
  pool.connect((err, client, release) => {
    if (err) {
      callback(err, null);
    } else {
      const queryString1 = `INSERT INTO users (username, avatar_url) VALUES ('${postData.username}', 'https://cdn2.iconfinder.com/data/icons/mixed-icon-collection/100/dog-128.png') RETURNING id`;
      client.query(`SET search_path TO ${config.searchPath}`)
      .then(() => {
        client.query(queryString1)
        .then(results => {
          const queryString2 = `INSERT INTO reviews (user_id, product_id, date_submitted, rating, review, helpfulness, shop_id) VALUES (${results.rows[0].id}, ${postData.productId}, '${postData.dateSubmitted}', ${postData.rating}, '${postData.review}', 0, ${postData.shopId})`
          client.query(queryString2, (err, data) => {
            release();
            if (err) {
              callback(err, null);
            } else {
              callback(null, err);
            }
          });
        })
        .catch(err => callback(err, null));
      })
      .catch(err => callback(err, null));
    }
  })
}

exports.updateReview = function(putData, callback) {
  pool.connect((err, client, release) => {
    if (err) {
      callback(err, null);
    } else {
      const queryString = `UPDATE reviews SET helpfulness=${putData.helpfulness} WHERE id=${putData.id}`;
      client.query(`SET search_path TO ${config.searchPath}`)
      .then(() => {
        release();
        client.query(queryString, (err, data) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, data);
          }
        });
      })
      .catch(err => callback(err, null));
    }
  });
}
