const expect = require('chai').expect;
const axios = require('axios');
const db = require('../database/helpers.js');
const config = require('../config.js');

describe('Database', () => {
  before((done) => {
    db.client.query('INSERT INTO shops (id) VALUES (100100100);')
    .then(() => {
      db.client.query('INSERT INTO products (id, shop_id) VALUES (1001001001, 100100100);', done);
    });
  });

  it('should insert reviews into database', done => {
    const postData = {
      username: 'Old Justus',
      productId: 1001001001,
      dateSubmitted: '1994-09-22',
      rating: 4,
      review: 'Old Justus wuz here lmao',
      shopId: 100100100,
    };
    db.postReview(postData, (err, data) => {
      expect(err).to.be.null;
      expect(data).to.not.be.null;
      done();
    });
  });

  it('should select reviews from database', done => {
    db.getReviews(1001001001, (err, data) => {
      expect(err).to.be.null;
      expect(data.rows[0].review).to.equal('Old Justus wuz here lmao');
      done();
    });
  });

  it('should update reviews in database', done => {
    db.getReviews(1001001001, (err, data) => {
      expect(data.rows[0].helpfulness).to.equal(0);
      const putData = [27, data.rows[0].id];
      db.updateReview(putData, (err, data) => {
        expect(err).to.be.null;
        db.getReviews(1001001001, (err, data) => {
          expect(data.rows[0].helpfulness).to.equal(27);
          done();
        });
      });
    });
  });

  it('should delete reviews from database', done => {
    db.getReviews(1001001001, (err, data) => {
      db.deleteReview(data.rows[0].id, (err, data) => {
        expect(err).to.be.null;
        db.getReviews(1001001001, (err, data) => {
          expect(data.rows.length).to.equal(0);
          done();
        });
      });
    })
  });

  after(done => db.client.query('DELETE FROM shops * WHERE id=100100100;', done));
});

describe('Server', () => {
  before((done) => {
    db.client.query('INSERT INTO shops (id) VALUES (100100100);')
    .then(() => {
      db.client.query('INSERT INTO products (id, shop_id) VALUES (1001001001, 100100100);', done);
    });
  });

  it('should POST reviews', done => {
    axios.post('http://localhost:3001/1001001001/reviews', {
      username: 'Yung Justus',
      dateSubmitted: '2018-09-22',
      rating: 3,
      review: 'Yung J comin at ya',
      shopId: 100100100,
    })
    .then(response => {
      expect(response.status).to.equal(201);
      db.getReviews(1001001001, (err, data) => {
        expect(data.rows[0].review).to.equal('Yung J comin at ya');
        done();
      });
    });
  });

  it('should PUT reviews', done => {
    db.getReviews(1001001001, (err, data) => {
      axios.put('http://localhost:3001/1001001001/reviews', {
        id: data.rows[0].id,
        helpfulness: -27,
      })
      .then(response => {
        expect(response.status).to.equal(204);
        db.getReviews(1001001001, (err, data) => {
          expect(data.rows[0].helpfulness).to.equal(-27);
          done();
        });
      });
    });
  });

  it('should GET reviews', done => {
    axios.get('http://localhost:3001/1001001001/reviews')
    .then(response => {
      expect(response.status).to.equal(200);
      expect(response.data.rows[0].username).to.equal('Yung Justus');
      done();
    });
  });

  it('should DELETE reviews', done => {
    db.getReviews(1001001001, (err, data) => {
      axios.delete('http://localhost:3001/1001001001/reviews', {
        data: { reviewId: data.rows[0].id },
      })
      .then(response => {
        expect(response.status).to.equal(204);
        db.getReviews(1001001001, (err, data) => {
          expect(data.rows.length).to.equal(0);
          done();
        });
      });
    });
  });

  after(done => db.client.query('DELETE FROM shops * WHERE id=100100100;', done));
});
