const bookModel = require("../models/bookModel")
exports.getBooksById =async function (){

    try {
    let bookId= req.params


  if (Object.keys(bookId).length == 0) return res.status(400).send({ status: false, message: "Please enter data in  params" });
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ status: false, message: "Please provide valid bookId" });
   
 
   const checkBookId = await bookModel.findOne({_id:bookId ,isDeleted:false})
  if (!checkBookId) { return res.status(400).send({ status: false, msg: "bookId not found" }) }
  
    const getBookDetails= await bookModel.find() 
        
    } catch (error) {
        



    }



}