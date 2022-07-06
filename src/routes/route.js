const express = require('express');
const router = express.Router();
const {createUser , userLogin,} = require("../controllers/userController")
const {createBook,getBooks} = require("../controllers/bookController")
const {authentication,authorize} = require("../middleware/auth")


//router.post('/register',createUser)




router.post('/login', userLogin)

router.post('/books',authentication, authorize, createBook)

router.get('/books',authentication, getBooks)

module.exports = router;

