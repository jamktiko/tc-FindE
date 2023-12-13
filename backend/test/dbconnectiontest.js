const chai = require('chai');
const expect = chai.expect;
const connectTodb = require('../dbconnection.js');

describe('Testataan yhteyttä tietokantaan', () => {
  it('Yhteys tietokantaan pitäisi muodostua', async () => {
    try {
      const connectionResult = await connectTodb();
      expect(connectionResult).to.equal(true); // Assert that the connection was successful
    } catch (error) {
      throw new Error('Tietokantaan yhdistäminen epäonnistui');
    }
  });
});
