const chai = require('chai');
const chaihttp = require('chai-http');
const expect = chai.expect;
chai.use(chaihttp);

describe('Testataan API', () => {
  // get reitin testaus
  it('pitäisi palauttaa kaikki tapahtumat /events', (done) => {
    chai
      .request('https://backendwithlogin-1-u7980985.deta.app')
      .get('/events')
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        } else {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        }
      });
  });
});
