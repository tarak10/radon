const express = require('express');
const router = express.Router();
const {createUser , userLogin,} = require("../controller/userController")
const {createBook,getBooks} = require("../controller/bookController")
//const auth = require("../middleware/auth")


router.post('/register',createUser)

router.post('/login', userLogin)

router.post('/books',createBook)

router.get('/books', getBooks)

module.exports = router;
