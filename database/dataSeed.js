const faker = require('faker');
const connectionOptions = require('../config.js');
const knex = require('knex')({
  client: 'pg',
  connection: connectionOptions,
  pool: {
    min: 0,
    max: 50,
  },
  acquireConnectionTimeout: 600000,
});

// Users
const insertUsers = function(n) {
  console.log(`INSERTING USER DATA PART ${n} OF 10`);
  let userInserts = [];
  for (let i = 0; i < 1000; i++) {
    let rows = [];
    for (let j = 0; j < 1000; j++) {
      rows[j] = {
        username: faker.internet.userName(),
        img_url: faker.internet.avatar(),
      };
    }
    userInserts.push(knex.batchInsert('shop_reviews.users', rows));
  }
  Promise.all(userInserts)
  .then(() => n < 10 ? insertUsers(n + 1) : insertShops(1))
  .catch(err => console.log(err));
}

// Shops
const insertShops = function(n) {
  console.log(`INSERTING SHOP DATA PART ${n} OF 10`)
  let shopInserts = [];
  for (let i = 0; i < 100; i++) {
    let rows = [];
    for (let j = 0; j < 1000; j++) {
      rows[j] = {
        shop: faker.company.companyName(),
      };
    }
    shopInserts.push(knex.batchInsert('shop_reviews.shops', rows));
  }
  Promise.all(shopInserts)
  .then(() => n < 10 ? insertShops(n + 1) : insertProducts(1))
  .catch(err => console.log(err));
}

const insertProducts = function(n) {
  console.log(`INSERTING PRODUCT DATA PART ${n} OF 10`);
  let productInserts = [];
  for (let i = 0; i < 1000; i++) {
    let rows = [];
    for (let j = 0; j < 1000; j++) {
      rows[j] = {
        product: faker.commerce.productName(),
        img_url: `https://loremflickr.com/320/320/animals?lock=${faker.random.number(99)}`,
        shop_id: faker.random.number({
          min: 1,
          max: 1000000,
        }),
      };
    }
    productInserts.push(knex.batchInsert('shop_reviews.products', rows));
  }
  Promise.all(productInserts)
  .then(() => n < 100 ? insertProducts(n + 1) : insertReviews(1))
  .catch(err => console.log(err));
}

const insertReviews = function(n) {
  console.log(`INSERTING REVIEW DATA PART ${n} OF 50`);
  let reviewInserts = [];
  for (let i = 0; i < 1000; i++) {
    let rows = [];
    for (let j = 0; j < 1000; j++) {
      rows[j] = {
        user_id: faker.random.number({
          min: 1,
          max: 10000000,
        }),
        product_id: faker.random.number({
          min: 1,
          max: 10000000,
        }),
        date_submitted: faker.date.between('2018-03-01', '2018-07-10'),
        rating: faker.random.number({
          min: 1,
          max: 5,
        }),
        review: faker.lorem.sentences(),
        helpfulness: faker.random.number({
          min: -50,
          max: 200,
        }),
        shop_id: faker.random.number({
          min: 1,
          max: 1000000,
        }),
      };
    }
    reviewInserts.push(knex.batchInsert('shop_reviews.reviews', rows));
  }
  Promise.all(reviewInserts)
  .then(() => n < 500 ? insertReviews(n + 1) : console.log('OPERATIONS COMPLETE'))
  .catch(err => console.log(err));
}

insertUsers(1);
