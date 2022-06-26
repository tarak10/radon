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

router.post("/blogs/:userId", middleware.authentication,middleware.authorization, blogscontroller.createBlogs)

router.get("/specificblogs/:userId", middleware.authentication,middleware.authorization, blogscontroller.getblogs)

router.put("/blogs/:userId/:blogId", middleware.authentication,middleware.authorization, blogscontroller.updateBlog)

router.delete("/blogs/:userId/:blogId", middleware.authentication,middleware.authorization, blogscontroller.deleteBlogsById)

router.delete("/blogs/:userId", middleware.authentication,middleware.authorization, blogscontroller.deleteBlogByQuerConditoin)

module.exports = router