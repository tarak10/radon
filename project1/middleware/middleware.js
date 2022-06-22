const jwt = require('jsonwebtoken')

const authentication = async function(req, res, next) {
    const token = req.headers['x-api-key']
         if (!token) return res.status(400).send({ msg: "hey please provide token" })
    const validToken = jwt.verify(token, 'projectOne')

    if (!validToken) {
        res.status(400).send({ status: false, msg: "the user is not found" })
    }
    req.body.tokenId = validToken._id
    next()
}
module.exports.authentication = authentication;
