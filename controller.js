const jwt = require("jsonwebtoken");
// const userModel = require("../models/userModel");

const createblogs = async function (req, res) {
    //You can name the req, res objects anything.
    //but the first parameter is always the request 
    //the second parameter is always the response
    try {
        let blog = req.body;
        let authorid = req.body.authorid
        let authorDetails = await userModel.findById(authorid);
        if (!authorDetails)
            return res.status(404).send({ status: false, msg: "No such author exists" });
        let savedData = await userModel.create(blog);
        res.status(201).send({ status: true, data: savedData });
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}
