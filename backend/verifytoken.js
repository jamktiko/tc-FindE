const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// verifyToken -funktio ottaa vastaan tokenin, dekoodaa ja tarkistaa sen
function verifyToken(req, res, next) {
  const token = req.body.token || req.headers['x-access-token'];
  if (token) {
    // verify tutkii tokenin voimassaolon ja salausmuuttujan
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Token virheellinen tai expiroitunut.',
        });
      } else {
        req.decoded = decoded;
        next(); // siirrytään eteenpäin seuraaviin reitteihin
      }
    });
  } else {
    // jos ei saatu tokenia, tulee error ja jäädään tähän
    return res.status(403).send({
      success: false,
      message: 'Tokenia ei ole.',
    });
  }
}

module.exports = verifyToken;
