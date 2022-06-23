const jwt = require("jsonwebtoken");

const authentification = async function (req, res, next) {
    let token = req.headers["x-api-key"];
    if (!token) return res.status(404).send({ status: false, msg: "token must be present" });
    let decodedToken = jwt.verify(token, "projectOne");
    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is invalid" });
    next()
}

const autherisation = async function (req, res, next) {
    let token = req.headers["x-auth-token"];
    let decodedToken = jwt.verify(token, "projectOne");
    let userToBeModified = req.params.userId
    let userLoggedIn = decodedToken.userId
    if (userToBeModified != userLoggedIn) return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' });
    next()
}

module.exports.authentification = authentification
module.exports.autherisation = autherisation