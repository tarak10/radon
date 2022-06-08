const { count } = require("console")
const BookModel= require("../models/bookModel")

const createBook= async function (req, res) {
    let data= req.body

    let savedData= await BookModel.create(data)
    res.send({msg: savedData})
}

const getBooksData= async function (req, res) {

    const createBook = async function (req,res){
        const book = req.body
        let saveBook = await BookModel.create(book)
        
        res.send({msg:savedBook})
        }
        
        const allBookList = async function  (req,res){
            let list = await bookModel.find().select({bookName: 1, authorName:  1,_id:  0 })
            res.send({msg:list})
        
        }
        
        const yearDetails  =  async  function (req,res){
            let yearList= await bookModel.find({year:req.body.year})
        }
        

    }

module.exports.createBook= createBook
module.exports.getBooksData= getBooksData