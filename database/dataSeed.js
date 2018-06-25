const faker = require('faker');
const config = require('../config.js');
const fs = require('fs');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  },
  pool: {
    min: config.min,
    max: config.max,
  },
  acquireConnectionTimeout: 600000,
  searchPath: [config.searchPath],
});

// Users
const insertUsers = function(n) {
  console.log(`INSERTING USER DATA PART ${n} OF 100`);
  let userInserts = [];
  for (let i = 0; i < 100; i++) {
    let rows = [];
    for (let j = 0; j < 1000; j++) {
      rows[j] = {
        username: faker.internet.userName(),
        img_url: faker.internet.avatar(),
      };
    }
    userInserts.push(knex.batchInsert('users', rows));
  }
  Promise.all(userInserts)
  .then(() => n < 100 ? insertUsers(n + 1) : insertShops(1))
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
    shopInserts.push(knex.batchInsert('shops', rows));
  }
  Promise.all(shopInserts)
  .then(() => n < 10 ? insertShops(n + 1) : insertProducts(1))
  .catch(err => console.log(err));
}

const insertProducts = function(n) {
  console.log(`INSERTING PRODUCT DATA PART ${n} OF 100`);
  let productInserts = [];
  for (let i = 0; i < 100; i++) {
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
    productInserts.push(knex.batchInsert('products', rows));
  }
  Promise.all(productInserts)
  .then(() => {
    if (n < 100) {
      insertProducts(n + 1);
    } else {
      knex.schema.alterTable('products', table => {
        table.foreign('shop_id').references('id').inTable('shops');
        table.index('shop_id');
      })
      .then(() => insertReviews(1))
      .catch(err => console.log(err));
    }
  })
  .catch(err => console.log(err));
}

const insertReviews = function(n) {
  console.log(`INSERTING REVIEW DATA PART ${n} OF 500`);
  let reviewInserts = [];
  for (let i = 0; i < 100; i++) {
    let rows = [];
    for (let j = 0; j < 1000; j++) {
      let productId = faker.random.number({
        min: 1,
        max: 10000000,
      });
      rows[j] = {
        user_id: faker.random.number({
          min: 1,
          max: 10000000,
        }),
        product_id: productId,
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
        shop_id: knex('products').where({id: productId}).select('shop_id'),
      };
    }
    reviewInserts.push(knex.batchInsert('reviews', rows));
  }
  Promise.all(reviewInserts)
  .then(() => {
    if (n < 500) {
      insertReviews(n + 1);
    } else {
      knex.schema.alterTable('reviews', table => {
        table.foreign('user_id').references('id').inTable('users');
        table.foreign('product_id').references('id').inTable('products');
        table.foreign('shop_id').references('id').inTable('shops');
      })
      .then(() => console.timeEnd('seeding'))
      .catch(err => console.log(err))
    }
  })
  .catch(err => console.log(err));
}

console.time('seeding');
insertUsers(1);
