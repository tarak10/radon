const jwt = require("jsonwebtoken");
const authorModel = require('../models/authorModel')


//=========================================================== Creating author =============================================================//

const createAuthor = async function (req, res) {
    try {
        let authorData = req.body
        let savedData = await authorModel.create(authorData);
        res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



module.exports.createAuthor = createAuthor