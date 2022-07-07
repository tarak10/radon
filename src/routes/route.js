const express = require('express');
const router = express.Router();
const {createUser , userLogin,} = require("../controllers/userController")
const {createBook,getBooks, getBooksById,deleteBookById,updateBooksById } = require("../controllers/bookController")
const {auth} = require("../middleware/auth")




router.post('/register',createUser)

router.post('/login', userLogin)

router.post('/books',auth, createBook)

router.get('/books',auth, getBooks)

router.get('/books/:bookId',auth, getBooksById)

router.delete('/books/:bookId',auth,deleteBookById)

router.put('/books/:bookId', updateBooksById)

module.exports = router;

