const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogscontroller = require("../controller/bloggercontroller")
const middleware = require("../middleware/middleware")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/authors",authorController.createAuthor)

router.post("/authorlogin", authorController.loginauthor)

router.post("/blogs/:userId", middleware.authentification,middleware.autherisation, blogscontroller.createBlogs)

router.get("/specificblogs/:userId", middleware.authentification,middleware.autherisation, blogscontroller.getByFilter)

router.put("/blogs/:userId/:blogId", middleware.authentification,middleware.autherisation, blogscontroller.updateBlog)

router.delete("/blogs/:userId/:blogId", middleware.authentification,middleware.autherisation, blogscontroller.deleteBlogsById)

router.delete("/blogs/:userId?queryParams", middleware.authentification,middleware.autherisation, blogscontroller.deleteBlogByQuerConditoin)
module.exports = router