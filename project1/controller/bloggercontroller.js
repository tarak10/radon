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

//===================================================== get Blogs ====================================================================//

let getblogs = async function (req, res) {
    try {
        let query = Object.keys(req.query);
        if (query.length) {
            let filter = req.query;
            filter.isDeleted = false;
            filter.isPublished = true;
            let allblogs = await blogsModel.find(filter);
            if (!allblogs.length) {
                return res.status(404).send({ status: false, msg: "No blog found with requested query" })
            }
            return res.status(200).send({ status: true, data: allblogs })
        }
        let getblogs = await blogsModel.find({ isDeleted: false, isPublished: true })
        if (!getblogs.length)
            return res.status(404).send({ status: false, msg: "Blog does not exist" })
        res.status(200).send({ status: true, data: getblogs })
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
        let deletedblog = await blogsModel.find({ _id: blogId, isDeleted: true })
        if (!deletedblog) return res.status(404).send({ status: false, msg: "Requested blog by ID is deleted" })
        let blogData = req.body;
        let updatedblog = await blogsModel.findOneAndUpdate(
            { _id: blogId, },
            { $set: blogData, isUpdated: true, publishedAt: Date.now(), isPublished: true },
            { new: true, upsert: true });
        res.status(200).send({ status: 'updated', data: updatedblog });
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

//============================================================ Delete Blogger by Id ==========================================================//

const deleteBlogsById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let blog = await blogsModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, msg: "No such blog exists" });
        }
        let result = await blogsModel.findOne({ _id: blogId, isDeleted: false });
        if (!result) return res.status(404).send({ status: false, msg: "Blog is already deleted" });
        let deleteblog = await blogsModel.findOneAndUpdate(
            { _id: blogId },
            { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true, });
        res.status(200).send({ status: true, data: deleteblog });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

//========================================================== Delete by query ============================================================ // 

const deleteBlogByQuerConditoin = async function (req, res) {
    try {
        let data = req.query
        data.isDeleted = false
        let queryblog = await blogsModel.find({ data, isDeleted: false });
        if (!queryblog) return res.status(400).send({ status: false, msg: "Requested Blog is already deleted or requested query doesn't exist" })
        const dataforUpdation = { ...data, isDeleted: true, isDeletedAt: new Date() }
        const result = await blogsModel.updateMany(data, dataforUpdation, { new: true })
        if (!result) return res.status(404).send({ status: false, msg: "No Blog found with requested query" })
        res.status(200).send({ status: true, data: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


//========================================================== Exported Module ===================================================================//
module.exports.createBlogs = createBlogs
module.exports.getblogs = getblogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlogsById = deleteBlogsById
module.exports.deleteBlogByQuerConditoin = deleteBlogByQuerConditoin


