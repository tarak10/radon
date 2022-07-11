const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const validator = require('../validator/validator')
const { validate } = require('../models/reviewModel')


exports.createReview = async (req, res) => {
  try {
    let id = req.params.bookId

    if (!validator.isValidObjectId(id)) return res.status(400).send({ status: false, message: "Please enter valid bookId" });

    let checkBook = await bookModel.findById(id);
    if (!checkBook) return res.status(404).send({ status: false, message: "Book not found" });

    if (checkBook.isDeleted == true) return res.status(404).send({ status: false, message: "Book is already deleted" });

    let data = req.body;

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide data in body" });

    let { review, rating, reviewedBy } = data;

    if (!rating) return res.status(400).send({ status: false, message: "Rating is required and should not be zero" });

    if (validator.validString(reviewedBy) || validator.validString(review)) return res.status(400).send({ status: false, send: "Please enter rewiew and reviewdBy in a valid string" });

    if (!validator.validString(rating)) return res.status(400).send({ status: false, message: "Please enter rating in digits" });

    if (!((rating < 6) && (rating > 0))) return res.status(400).send({ status: false, message: "Rating should be between 1 - 5 numbers" });

    data.bookId = id //storing bookId got from params inside reviews bookId

    let reviewData = await reviewModel.create(data)
    
    await bookModel.updateOne(
      { _id: id },
      { $inc: { reviews: 1 } }
    )
    return res.status(200).send({ status: true, message: "Success", data: reviewData })
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message })
  }



}




exports.updateReview= async (req,res)=>{

  let bookId=req.params.bookId
  let reviewId=req.params.reviewId
  let {review, rating,  reviewedAt, reviewedBy}=req.body
  if(!validator.isValidRequestBody(req.params)) return res.status(400).send({ status: false, message: "Please provide data in params" })
  if (!validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId" });
  if (!validator.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Please enter valid reviewId" });

  if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Please provide data in body" });

if(!validator.isValid(review))return res.status(400).send({ status: false, message: "review required" })

}