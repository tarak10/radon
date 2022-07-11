const jwt = require('jsonwebtoken');

exports.authentication = async (req, res, next) => {

  try {
    let token = req.headers['X-API-KEY'];
    if (!token) {
      token = req.headers['x-api-key'];
    }
    if (!token) return res.status(400).send({ status: false, message: "Token is missing" });

    let decodedToken = jwt.verify(token, "lama");
    if (!decodedToken) return res.status(401).send({ status: false, message: "Token is not valid" })
    req.decodedToken = decodedToken.userId;
    next();
  } catch (err) { //hardcoded them
    if (err.message == "jwt expired") return res.status(400).send({ status: false, message: "JWT expired, login again" })
    if (err.message == "invalid signature") return res.status(400).send({ status: false, message: "Token is incorrect" })
    return res.status(500).send({ status: false, error: err.message })
  }

}








