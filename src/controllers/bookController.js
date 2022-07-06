const bookModel = require("../models/bookModel")
const validator = require('../validator/validator')

const createBook = async function (){
    

try {
    
const {title, excerpt , userId , ISBN , category ,  subcategory, reviews, releasedAt}=req.body
const filterQuery = { isDeleted: false }

if(!(title && excerpt &&  userId && ISBN && category && subcategory))
return res.status(400).send({ status: false, msg: "you have to enter all compulsory details" })

if (!validator.isValid(title)) {
    return res.status(400).send({ status: false, msg: "title required " })
}
if (!validator.isValid(excerpt)) {
    return res.status(400).send({ status: false, msg: "excerpt required " })
}if (!validator.isValid(userId)) {
    return res.status(400).send({ status: false, msg: "UserId required " })
}if (!validator.isValid(category)) {
    return res.status(400).send({ status: false, msg: "category required " })
}
if (!validator.isValid(subcategory)) {
    return res.status(400).send({ status: false, msg: "subcategory required " })
}
if (!validator.isValid(releasedAt)) {
    return res.status(400).send({ status: false, msg: "releasedAt required" })
}

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
