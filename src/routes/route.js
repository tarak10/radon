const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")

const mw = require("../middlewares/auth")



//router.post("/register",userController.createUser)
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.get("/user/:userId", mw.authenticated,userController.getuserdata)
router.put("/user/:userId", mw.authenticated,userController.updateuser)


router.post("/product", productController.createProduct)
router.get("/product", productController.getproduct)
router.get("/product/:productId", productController.getproductid)
router.put("/product/:productId", productController.updateproduct)
router.delete("/product/:productId", productController.deleteproduct)



router.post("/user/:userId/cart",mw.authenticated, cartController.createCart )
router.put("/user/:userId/cart",mw.authenticated, cartController.updateCart )
 
router.all("/*",(req,res)=>{
    return res.status(404).send({status:false,message:"Url not found"})
});



module.exports = router;