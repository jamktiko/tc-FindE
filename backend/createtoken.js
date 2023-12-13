const jwt = require('jsonwebtoken');

function createToken(user) {
  const payload = {
    etunimi: user.etunimi,
    sukunimi: user.sukunimi,
    sposti: user.sposti,
    _id: user._id,
  };
  console.log(payload);

  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: 60 * 60 * 24,
  });
  return token;
}
module.exports = createToken;
