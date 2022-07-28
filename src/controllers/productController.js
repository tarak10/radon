const productcontroller = require('../models/productModel')
const Validator = require('../validators/validator')
// const jwt = require('jsonwebtoken')
const aws = require('../validators/aws')
const productModel = require('../models/productModel')




//#1API..................................................//................................

const createProduct = async function (req, res) {
    try {
        let data = req.body
        let file = req.files
        console.log(data)

        if (!Validator.isValid(data.title))
            return res.status(400).send({ status: false, msg: "The Title is Missing" })
        if (!Validator.isValidTitle(data.title))
            return res.status(400).send({ status: false, msg: "Please enter valid Title and is in only alphabet format" })

        if (!Validator.isValid(data.description))
            return res.status(400).send({ status: false, msg: "The description is Missing" })
        if (!Validator.isValidTitle(data.description))
            return res.status(400).send({ status: false, msg: "Please enter valid description and is in only alphabet format" })

        if (!Validator.isValid(data.price))
            return res.status(400).send({ status: false, msg: "The price is Missing" })
        if (!Validator.isValidPrice(data.price))
            return res.status(400).send({ status: false, msg: "Please enter valid price length between 1 - 4 and only in Number format" })

        if (!Validator.isValid(data.currencyId))
            return res.status(400).send({ status: false, msg: "The currencyId is Missing" })
        if (data.currencyId != "INR")
            return res.status(400).send({ status: false, msg: "Please enter currencyId In Format INR" })

        if (!Validator.isValid(data.currencyFormat))
            return res.status(400).send({ status: false, msg: "The currencyformat is Missing" })
        if (data.currencyFormat != "₹")
            return res.status(400).send({ status: false, msg: "Please enter currencyFormat In Format ₹" })

        if (!file || file.length == 0) {
            return res.status(400).send({ status: false, message: "Image File must be require, Please Provide it" });
        }
        if (!Validator.isValidimg(file[0].mimetype))
            return res.status(400).send({ status: false, msg: "Please Provide Valid Image Files in Format of [ jpg , jpge ,png ]" })

        data.productImage = await aws.uploadFile(req.files[0])


        if (!Validator.isValid(data.style))
        return res.status(400).send({ status: false, msg: "The Style is Missing" })

        if (!Validator.isValidName(data.style))
            return res.status(400).send({ status: false, msg: "Please enter valid style and is in only alphabet format" })



        let enumSize = ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'];
        data.availableSizes= data.availableSizes.split(",") 
        
        
        const multipleExist = data.availableSizes.every(value => {
            return enumSize.includes(value);
          })
          if(multipleExist != true){
            return res.status(400).send({status:false,msg:"availableSizes should be-[S, XS,M,X, L,XXL, XL]"})
          }
           

        if (!Validator.isValidInstallment(data.installments)) return res.status(400).send({ status: false, msg: "installments in only number format" })

        if (data.installments >= 37 || data.installments <= 0) return res.status(400).send({ status: false, msg: "installment Between 1 to 36 month" })

        const uniquetitle = await productModel.findOne({title:data.title})
        if(uniquetitle) res.status(400).send({status: false, message:"title already exist"})

        // let product = {}
        // product.title = data.title,
        //     product.description = data.description,
        //     product.price = data.price,
        //     product.currencyId = data.currencyId,
        //     product.currencyFormat = data.currencyFormat,
        //     product.productImage = data.productImage
        // product.style = data.style,
        //     product.availableSizes = size,
        //     product.installments = data.installments


        const Product = await productModel.create(data);
        return res.status(201).send({ status: true, message: 'Product Created Successfully', data: Product });
    } catch (err) {
       return res.status(500).send({ err: err.message })
    }
}

//#2ndAPI.....................................................................................//.........................


const getproduct = async function(req,res){
    try {
          
          let querydata = req.query                              
         
         

         let { name, size, priceGreaterThan,priceLessThan  } = querydata
         let obj = {isDeleted :false};


          if (name) {
            obj.title = { $regex : name}     
          }
          if(size){
            let newSize = size.split(",")
            obj.availableSizes = {$in: newSize}
          }

          if(priceGreaterThan){
            obj.price = {$gt: priceGreaterThan}
          }                                                                              
              
        
           if(priceLessThan){
            obj.price = {$lt: priceLessThan}
          }

          
          if(priceGreaterThan &&  priceLessThan){
            obj.price =  { $gt: priceGreaterThan , $lt: priceLessThan }

          } 

      
          const productData = await productModel.find(obj).sort({ price: 1 }).select({ deletedAt: 0 })
      
          if (productData.length == 0) {
            return res.status(404).send({ status: false, message: "No product found" })
          }
      
          return res.status(200).send({ status: true, message: 'Success', data: productData })
        }
         
        catch (error) {
            res.status(500).send({ status: false, message: error.message });
          }
        }

       //#3rdAPI.............................................................//..................................



        const getproductid =  async function(req,res){
          try{
          let productId = req.params
          if(!productId) res.status(400).send({status:false, message:"please enter productId"})


          const getId = await productModel.findById({_id:productId})
          if(!object.keys(getId).length == 0 ) res.status(400).send({status:false, message:"product not found"})
          return res.status(200).send({status:true, message:"Success", data:getId})

        }
        catch (error) {
          res.status(500).send({ status: false, message: error.message });
        }

        }



        
  
module.exports = { createProduct,getproduct, getproductid }


