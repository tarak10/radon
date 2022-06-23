const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogscontroller = require("../controller/bloggercontroller")
const middleware = require("../middleware/middleware")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/authors",authorController.createAuthor)

router.post("/blogs", middleware.authentification,middleware.autherisation, blogscontroller.createBlogs)

router.get("/blogs", middleware.authentification,middleware.autherisation, blogscontroller.getallblogs)

router.get("/specificblogs", middleware.authentification,middleware.autherisation, blogscontroller.getByFilter)

router.put("/blogs/:blogId", middleware.authentification,middleware.autherisation, blogscontroller.updateBlog)

router.put("/updatingpublisher", middleware.authentification,middleware.autherisation, blogscontroller.updatingpublisherwithdate)

router.get("/blogs/:blogId", middleware.authentification,middleware.autherisation, blogscontroller.deleteBlogsById)

router.get("//blogs?queryParams", middleware.authentification,middleware.autherisation, blogscontroller.deleteBlogByQuerConditoin)
module.exports = router