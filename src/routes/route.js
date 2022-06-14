const express = require('express');
const router = express.Router();
const controller = require("../controllers/myController")
const commonMw = require("../middlewares/commonMiddlewares")

router.post("/createProduct", controller.createProduct)

router.post("/createUser", commonMw.mid1, controller.createUser)

router.post("/createOrder", commonMw.mid1, controller.createOrder)

module.exports = router;