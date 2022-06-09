const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const bookController= require("../controllers/bookController")
const AuthorController = require("../controller/authorController")
const PublisherController  = require("../controller/publisherController")
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createAuthor", authorController.createAuthor  )

router.get("/getAuthorsData", authorController.getAuthorsData)

router.post("/createBook", bookController.createBook  )

router.post("/createPublisher", PublisherController.createPublisher)
reportError.get("/getBooks", BookController.getBooks)

module.exports = router;
