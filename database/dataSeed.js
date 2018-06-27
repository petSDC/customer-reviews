const faker = require('faker');
const config = require('../config.js');
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [config.host],
  keyspace: config.searchPath,
  pooling: {
    maxRequestsPerConnection: config.max,
  }
});

// Users
const query = 'INSERT INTO reviews (id, username, user_avatar, product_id, shop_id, date_submitted, rating, review, helpfulness) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
const insertReviews = function(n) {
  console.log(`INSERTING USER DATA PART ${n} OF 5000`);
  let reviewInserts = [];
  for (let i = 0; i < 100; i++) {
    let rows = [];
    for (let j = 0; j < 100; j++) {
      let productId = faker.random.number({
        min: 1,
        max: 10000000,
      });
      rows[j] = {
        query: query,
        params: [
          faker.random.uuid(),
          faker.internet.userName(),
          faker.internet.avatar(),
          productId,
          Math.ceil(productId / 10),
          faker.date.between('2018-03-01', '2018-07-10'),
          faker.random.number({
            min: 1,
            max: 5,
          }),
          faker.lorem.sentences(),
          faker.random.number({
            min: -50,
            max: 200,
          }),
        ],
      };
    }
    reviewInserts.push(client.batch(rows, {prepare: true}));
  }
  Promise.all(reviewInserts)
  .then(() => n < 5000 ? insertReviews(n + 1) : console.timeEnd('seeding'))
  .catch(err => console.log(err));
}

console.time('seeding');
insertReviews(1);