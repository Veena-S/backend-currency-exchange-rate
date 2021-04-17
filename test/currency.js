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
});
