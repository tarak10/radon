const express = require('express');
const router = express.Router();
const {createUser , userLogin,} = require("../controllers/userController")
<<<<<<< HEAD
const {createBook,getBooks, getBooksById ,updateBooksById  } = require("../controllers/bookController")
const {authentication,authorize} = require("../middleware/auth")
=======
const {createBook,getBooks, getBooksById,deleteBookById } = require("../controllers/bookController")
const {auth} = require("../middleware/auth")
>>>>>>> c4f314f0ba312cca7f9dbe53376ed89451ca0404




router.post('/register',createUser)

router.post('/login', userLogin)

router.post('/books',auth, createBook)

router.get('/books',auth, getBooks)
router.get('/books/:bookId', getBooksById)
<<<<<<< HEAD
router.put('/books/:bookId',updateBooksById )
=======

router.delete('/books/:bookId',auth,deleteBookById)

>>>>>>> c4f314f0ba312cca7f9dbe53376ed89451ca0404
module.exports = router;

