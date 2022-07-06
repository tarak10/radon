const express = require('express');
const router = express.Router();
const {createUser , userLogin,} = require("../controllers/userController")
const {createBook,getBooks} = require("../controllers/bookController")
//const auth = require("../middleware/auth")


//router.post('/register',createUser)




router.post('/login', userLogin)

router.post('/books',createBook)

//router.get('/books', getBooks)

module.exports = router;

