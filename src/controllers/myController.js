const express = require("express/lib/request")
const UserModel = require("../models/userModel")
const ProductModel = require("../models/productModel")
const OrderModel = require("../models/orderModel")
const { default: mongoose } = require("mongoose")

const ObjectId = mongoose.Types.ObjectId

const createProduct = async function (req, res) {
    let data = req.body;
    let saveData = await ProductModel.create(data);
    res.send({ msg: saveData });
}

const createUser = async function (req, res) {
    let data = req.body;
    let saveData = await UserModel.create(data);
    res.send({ msg: saveData });
}

const createOrder = async function (req, res) {
    let data = req.body;
    let uId = await UserModel.findById(req.body.userId)
    let pId = await ProductModel.findById(req.body.productId)
    let str = ""
    let saveData
    if (!data.userId)
        res.send({ msg: "User ID is required" })
    else if (!uId)
        res.send({ msg: "Enter valid User ID" })
    else if (!data.productId)
        res.send({ msg: "Product ID is required" })
    else if (!pId)
        res.send({ msg: "Enter valid Product ID" })
    else {
        saveData = await OrderModel.create(data);
        if (req.headers["isfreeappuser"] === "true") {
            await orderModel.updateOne({ userId: data.userId }, { $set: { amount: 0 } }, { new: true })
        }
        else {
            let pPrice = pId.price;
            if (uId.balance >= pPrice) {
                await userModel.updateOne({ _id: data.userId }, { $inc: { balance: -pPrice } }, { new: true })
                await orderModel.updateOne({ _id: saveData._id }, { $set: { amount: pPrice } }, { new: true })
                res.send({ msg: saveData });
            }
            else res.send({ msg: "user doesn't have enough balance" })
        }

    }
}

module.exports.createProduct = createProduct
module.exports.createUser = createUser
module.exports.createOrder = createOrder