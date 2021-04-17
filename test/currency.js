import chai, { should, expect } from 'chai';
import chaiHttp from 'chai-http';
import PORT from '../constants.js';

chai.use(chaiHttp);

const serverUrl = `http://localhost:${PORT}`;

describe('Backend Currency Exchange', () => {
  describe('Get root', () => {
    // 'it' tells us that what is going to be tested in this method
    // Test the root path of the server
    it('Get Currency List', (done) => {
      chai.request(serverUrl)
        .get('/')
        .end((err, res) => {
          // Verify the response status of the API
          expect(res.status).to.equal(200);
          // Verify the type of the response body
          expect(res.body).to.be.a('object');
          // done() will be called when everything is success
          done();
        });
    });
  });

  describe('Get complete list of currencies', () => {
    // This method tests for the api '/api/currencies'
    it('Get Currency List', (done) => {
      chai.request(serverUrl)
        .get('/api/currencies')
        .end((err, res) => {
          // Verify the response status of the API
          expect(res.status).to.equal(200);
          // Verify the type of the response body
          expect(res.body).to.be.a('object');
          // done() will be called when everything is success
          done();
        });
    });
  });

  // To test the fetching of latest rate
  describe('Get latest currency rate', () => {
    // This method tests for the api '/api/latest-rate/:base'
    it('Get Real Time Exchange Rates', (done) => {
      chai.request(serverUrl)
        .get('/api/latest-rate/SGD')
        .end((err, res) => {
          // Verify the response status of the API
          expect(res.status).to.equal(200);

          // Verify the type of the response body
          expect(res.body).to.be.a('object');

          // Base value returned in the response should be same as in the request
          expect(res.body.base).to.equal('SGD');

          // Rate of base value should be 1
          expect(res.body.rates.SGD).to.equal(1);

          // done() will be called when everything is success
          done();
        });
    });
  });
});
