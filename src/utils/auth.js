const jwtConfig = require("../config/jwt.config.js");
const utilsConfig = require("../config/utils.config.js");
const jwt = require("jsonwebtoken");
const redisInstance = require("./redis.js");

async function generateToken(id) {
  return new Promise(async (resolve) => {
    var token = jwt.sign({ id: id }, jwtConfig.jwt_secret, {
      expiresIn: 86400, // expires in 24 hours
    });

    let result = await redisInstance.setEntity(
      utilsConfig.current_session,
      id,
      token
    );
    if (!result) {
      reject(null);
    }
    resolve(token);
  });
}

async function verifyToken(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, jwtConfig.jwt_secret, async function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything good, save to request for use in other routes
    // req.userId = decoded.id;

    let result = await redisInstance.getEntity(
      utilsConfig.current_session,
      decoded.id
    );
    // kalo token di cek dr redis ga ada, dan kalau ada tokennya gak sama sama kaya yg di req, berarti beda id = reject

    if (!result && result !== token) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }

    next();
  });
}

async function deleteToken(id) {
  return new Promise(async (resolve) => {
    let result = await redisInstance.deleteEntity(
      utilsConfig.current_session,
      id
    );
    if (!result) {
      reject(null);
    }
    resolve(result);
  });
}

module.exports = { generateToken, verifyToken, deleteToken };
