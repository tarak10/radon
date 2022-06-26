const jwt = require("jsonwebtoken");
const authorModel = require('../models/authorModel')


//=========================================================== Creating author =============================================================//

const createAuthor = async function (req, res) {
    try {
        let authorData = req.body
        if (!(authorData.fname && authorData.lname))
            return res.status(404).send({ status: false, msg: "Please check name fields" });
        if (!authorData.title)
            return res.status(404).send({ status: false, msg: "Please provide Title" });
        if (!authorData.password)
            return res.status(404).send({ status: false, msg: "Please provide password" });
        if (await authorModel.findOne({ email: data.email }))
            return res.status(400).send({ status: false, msg: "Email already exist please provide different email" });
        let savedData = await authorModel.create(authorData);
        res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

//============================================================ Phase II ====================================================================//

const loginauthor = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;
        let user = await authorModel.findOne({ email: userName, password: password });
        if (!user) return res.status(404).send({ status: false, msg: "username or the password is not corerct" });
        let token = jwt.sign({ userId: user._id.toString() }, "projectOne");
        res.setHeader("x-api-key", token);
        res.status(201).send({ status: true, token: token });
    }
    catch (error) {
        res.status(400).send({ msg: error.message })
    }
}

module.exports.createAuthor = createAuthor
module.exports.loginauthor = loginauthor