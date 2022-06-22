const jwt = require("jsonwebtoken");
const BlogModel = require("../models/blogsModel")

//================================================ Creating Blogs ======================================================================// 

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

//==================================================== get Blogs with conditions ======================================================//

const getallblogs = async function (req, res) {
    try {
        let allblogs = await Blogmodel.find({ isDeleted: false, isPublished: true })
        if (!allblogs) return res.status(404).send({ status: false, msg: "Blog does not exist" })
        res.status(200).send({ status: true, data: allBlogs })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//===================================================== get Blogs By filter =============================================================//

let getByFilter = async function (req, res) {
    try {
        let authorid = req.query.authorId
        let category = req.query.category
        let tag = req.query.tags
        let subcategory = req.query.subcategory
        let allblogs = await BlogModel.find({
            $or: [{ authorId: authorid }, { category: category }, { tags: tag }, { subcategory: subcategory }]
        })
        res.status(200).send({ status: true, data: allblogs })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//======================================================== Updating Blogs =========================================================//

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let blog = await BlogModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, msg: "No such blog exists" });
        }
        let blogData = req.body;
        let updatedblog = await BlogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            { $set: blogData },
            { new: true, upsert: true });
        res.staus(200).send({ status: 'updated', data: updatedblog });
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

//========================================================== Updating publisher blogs with certain date and  =====================================//

const updatingpublisherwithdate = async function (req, res) {
    try {
        let blogData = req.body;
        let updatedblog = await BlogModel.updateMany(
            { PublishedAt: "date" },
            { $set: blogData },
            { new: true, upsert: true });
        res.staus(200).send({ status: 'updated', data: updatedblog });
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



//========================================================== Exported Module ===================================================================//
module.exports.createblogs = createblogs
module.exports.getallblogs = getallblogs
module.exports.getByFilter = getByFilter
module.exports.updateBlog = updateBlog
module.exports.updatingpublisherwithdate = updatingpublisherwithdate

