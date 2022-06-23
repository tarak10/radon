const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogsModel")

//================================================ Creating Blogs ======================================================================// 

const createBlogs = async function (req, res) {
    try {
        let blog = req.body;
        let authorId = req.body.authorId
        let authorDetails = await authorModel.findById(authorId);
        if (!authorDetails)
            return res.status(404).send({ status: false, msg: "No such author exists" });
        let savedData = await blogModel.create(blog);
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
        let allblogs = await blogModel.find({
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
        let blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, msg: "No such blog exists" });
        }
        let blogData = req.body;
        let updatedblog = await blogModel.findOneAndUpdate(
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
        let updatedblog = await blogModel.updateMany(
            { PublishedAt: "date" },
            { $set: blogData },
            { new: true, upsert: true });
        res.staus(200).send({ status: 'updated', data: updatedblog });
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

//============================================================ delete Blogger by Id ==========================================================//

const deleteBlogsById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let result = await blogModel.findOne({ _id: blogId, isDeleted: false });
        if (!result) return res.status(404).send({ status: false, msg: "Blog doesnot exist" });
        let deleteblog = await blogModel.updateMany(
            { _id: blogId },
            { isDeleted: true, deletedAt: new Date }, { new: true });
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
        const result = await blogModel.updateMany(data, dataforUpdation, { new: true })
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
module.exports.getallblogs = getallblogs
module.exports.getByFilter = getByFilter
module.exports.updateBlog = updateBlog
module.exports.updatingpublisherwithdate = updatingpublisherwithdate
module.exports.deleteBlogsById = deleteBlogsById
module.exports.deleteBlogByQuerConditoin = deleteBlogByQuerConditoin

