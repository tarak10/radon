const bookModel = require("../models/bookModel")
const validator = require('../validator/validator')
//const mongoose=require('mongoose')


exports.createBook = async (req,res) =>{
    
try {
    
    let data =req.body
let {title, excerpt , userId , ISBN , category ,  subcategory, releasedAt} = data

if(Object.keys(data).length == 0)
return res.status(400).send({ status: false, msg: "you have to enter all details" })

if (!validator.isValid(title)) {
    return res.status(400).send({ status: false, msg: "title required" })
}
if (!validator.isValid(excerpt)) {
    return res.status(400).send({ status: false, msg: "excerpt required" })
}if (!validator.isValid(userId)) {
    return res.status(400).send({ status: false, msg: "UserId required" })
}if (!validator.isValid(category)) {
    return res.status(400).send({ status: false, msg: "category required" })
}
if (!validator.isValid(ISBN)) {
    return res.status(400).send({ status: false, msg: "ISBN required" })
}
if(!/^(\d{13})?$/.test(ISBN)){
    return res.status(400).send({ status: false, msg: "Please enter a valid ISBN number" })
}
if (!validator.isValid(subcategory)) {
    return res.status(400).send({ status: false, msg: "subcategory required" })
}
if (!validator.isValid(releasedAt)) {
    return res.status(400).send({ status: false, msg: "releasedAt required" })
}

const checkUserId = await userModel.findOne({userId:userId})
if(!checkUserId){return res.status(400).send({ status: false, msg: "UserId not found" })}

const checktitle = await bookModel.findOne({title:title})
if(checktitle){return res.status(400).send({ status: false, msg: "title already exists please enter new title" })}

const checkIsbn = await bookModel.findOne({ISBN:ISBN})
if(checkIsbn){return res.status(400).send({ status: false, msg: "ISBN already exists please enter new ISBN" })}

const saveBook = await bookModel.createBook(req.body)
return res.status(201).send({status : true , message : "Book successfully created" , data:saveBook})}


catch (error) {
 
return res.status(500).send({ status: false, msg: error.message })
}


}

