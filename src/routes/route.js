const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")

const mw = require("../middlewares/auth")



//router.post("/register",userController.createUser)
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.get("/user/:userId", mw.authenticated,userController.getuserdata)
router.put("/user/:userId", mw.authenticated,userController.updateuser)


router.post("/product", productController.createProduct)
router.get("/product", productController.getproduct)
router.get("/product/:productId", productController.getproductid)
 




module.exports = router;