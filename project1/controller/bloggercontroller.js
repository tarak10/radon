const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogsModel = require("../models/blogsModel")
const moment = require('moment')
//============================================================ Phase I ================================================================//
//========================================================= Creating Blogs ===========================================================// 

const createBlogs = async function (req, res) {
    try {
        let blog = req.body;
        if (!blog.title)
            return res.status(404).send({ status: false, msg: "Please provide title" });
        if (!blog.body)
            return res.status(404).send({ status: false, msg: "Please provide body" });
        if (!blog.category)
            return res.status(404).send({ status: false, msg: "Please provide category" });
        let authorId = req.body.authorId
        let authorDetails = await authorModel.findById(authorId);
        if (!authorDetails)
            return res.status(404).send({ status: false, msg: "No such author exists" });
        let savedData = await blogsModel.create(blog);
        res.status(201).send({ status: true, data: savedData });
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//===================================================== get Blogs By filter =============================================================//

let getByFilter = async function (req, res) {
    try {
        let querydata = req.query
        querydata.isDeleted = false;
        querydata.isPublished = true;
        let allblogs = await blogsModel.find(querydata)
        if (!allblogs.length)
            return res.status(404).send({ status: true, msg: "Blog not found" })
        res.status(200).send({ status: true, data: allblogs })
        let getblogs = await blogsModel.find({ isDeleted: false, isPublished: true })
        if (!getblogs) return res.status(404).send({ status: false, msg: "Blog does not exist which are not deleted and published" })
        else res.status(200).send({ status: true, data: getblogs })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//======================================================== Updating Blogs =========================================================//

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let blog = await blogsModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, msg: "No such blog exists" });
        }
        let blogData = req.body;
        let updatedblog = await blogsModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            { $set: blogData, isUpdated: true, publishedAt: Date.now(), isPublished: true },
            { new: true, upsert: true });
        res.status(200).send({ status: 'updated', data: updatedblog });
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

//============================================================ delete Blogger by Id ==========================================================//

const deleteBlogsById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let result = await blogsModel.findOne({ _id: blogId, isDeleted: false });
        if (!result) return res.status(404).send({ status: false, msg: "Blog doesnot exist" });
        let deleteblog = await blogsModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true, upsert: true }); //updatemany
        res.status(200).send({ status: true, data: deleteblog });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

//========================================================== Delete by query ============================================================ // 

const deleteBlogByQuerConditoin = async function (req, res) {
    try {
        const data = req.query
        if (!data) return res.status(400).send({ error: "Enter Valid Input " })
        const dataforUpdation = { ...data, isDeleted: true, isDeletedAt: new Date() }
        const result = await blogsModel.updateMany(data, dataforUpdation, { new: true })
        if (!result) res.status(404).send({ error: "No Data Found" })
        res.status(200).send({ status: true, data: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


//========================================================== Exported Module ===================================================================//
module.exports.createBlogs = createBlogs
module.exports.getByFilter = getByFilter
module.exports.updateBlog = updateBlog
module.exports.deleteBlogsById = deleteBlogsById
module.exports.deleteBlogByQuerConditoin = deleteBlogByQuerConditoin


