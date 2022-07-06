const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userModel = require
const { isValidObjectId } = require('../validator/validator')
exports.authentication = async (req, res, next) => {

    try {
        let token = req.headers['x-Api-key'];
        if (!token) {
            token = req.headers['x-api-key'];
        }
        if (!token) return res.status(400).send({ status: false, message: "Token is missing" });

        let decodedToken = jwt.verify(token, "lama");
        if (!decodedToken) return res.status(401).send({ status: false, message: "Token is not valid" })
        req.decodedToken = decodedToken;
        next();
    } catch (err) { //hardcoded them
        if (err.message == "jwt expired") return res.status(400).send({ status: false, message: "JWT expired, login again" })
        if (err.message == "invalid signature") return res.status(400).send({ status: false, message: "Token is incorrect" })
      return  res.status(500).send({ status: false, error: err.message })
    }

}









exports.authorize = async function (req, res, next) {

    try {

        const userId = req.body.userId
        let userlogging= req.decodedToken.userId
        let loggedinUser;

        if (!isValidObjectId(userId)) {
            return res.status(403).send("Provide valid userId")
        }

        const data = await userModel.findById(userId)
        if (!data) return res.status(404).send("UserId not found ")
        loggedinUser = data._id;

        if(userlogging != loggedinUser)
        return res.status(403).send({status: false , message :"Unauthorized to access"})
        next()
    } catch (error) {
       return  res.status(500).send({ status: false, error: err.message })
    }
    }
