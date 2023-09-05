import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const expect = chai.expect;
chai.use(chaiHttp);

describe('AppController', function () {
  describe('getStatus', function () {
    it('should return true for redis and mongodb', function () {
      chai.request(app)
        .get('/status')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.eql({ redis: true, db: true });
        })
    });
  });

  describe('getStats', function () {
    it('should return the right number of users and files stored in the database', function () {
      
    });
  });
});