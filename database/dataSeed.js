const faker = require('faker');
const connectionOptions = require('../config.js');
const cassandra = require('cassandra-driver');

const client = new cassandra.Client(connectionOptions);

// Users
const query = 'INSERT INTO reviews (id, username, user_avatar, product_id, shop_id, date_submitted, rating, review, helpfulness) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
const insertUsers = function(n) {
  console.log(`INSERTING USER DATA PART ${n} OF 1000`);
  let reviewInserts = [];
  for (let i = 0; i < 100; i++) {
    let rows = [];
    for (let j = 0; j < 100; j++) {
      rows[j] = {
        query: query,
        params: [
          faker.random.uuid(),
          faker.internet.userName(),
          faker.internet.avatar(),
          faker.random.number({
            min: 1,
            max: 10000000,
          }),
          faker.random.number({
            min: 1,
            max: 1000000,
          }),
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
  .then(() => n < 1000 ? insertUsers(n + 1) : console.log('OPERATIONS COMPLETE'))
  .catch(err => console.log(err));
}

insertUsers(1);