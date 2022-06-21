const jwt = require("jsonwebtoken");
// const userModel = require("../models/userModel");

const createblogs = async function (req, res) {
    try {
        let blog = req.body;
        let authorid = req.body.authorid
        let authorDetails = await authorModel.findById(authorid);
        if (!authorDetails)
            return res.status(404).send({ status: false, msg: "No such author exists" });
        let savedData = await authorModel.create(blog);
        res.status(201).send({ status: true, data: savedData });
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.createblogs=createblogs