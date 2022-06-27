 const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogscontroller = require("../controller/bloggercontroller")
const middleware = require("../middleware/middleware")


router.post("/authors",authorController.createAuthor)

router.post("/authorlogin", authorController.loginauthor)

router.post("/blogs/:userId", middleware.authentication,middleware.authorisation, blogscontroller.createBlogs)

router.get("/specificblogs/:userId", middleware.authentication,middleware.authorisation, blogscontroller.getByFilter)

router.put("/blogs/:userId/:blogId", middleware.authentication,middleware.authorisation, blogscontroller.updateBlog)

router.delete("/blogs/:userId/:blogId", middleware.authentication,middleware.authorisation, blogscontroller.deleteBlogsById)

router.delete("/blogs/:userId?queryParams", middleware.authentication,middleware.authorisation, blogscontroller.deleteBlogByQuerConditoin)
module.exports = router