const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const Validator = require("../validators/validator");


const createCart = async function (req, res){
    
try {
    const userId = req.params.userId;

    const data = req.body;
    let { quantity, productId, cartId} = data


    if (!Validator.isValid(data)) {
      return res.status(400).send({
        status: false,
        message: " data is required for cart",
      });
    }

      if (!Validator.isValidObjectId(userId)) {
        return res.status(400).send({
          status: false,
          message: "please enter valid userId ",
        });
      }

      if (!Validator.isValidObjectId(productId)) {
        return res.status(400).send({ status: false, message: "Please provide valid Product Id" });
    }

    if (!quantity) {
        quantity = 1;

    } else {
        if (!Validator.isValid(quantity) || !Validator.isvalidQuantity(quantity)) {
            return res.status(400).send({ status: false, message: "Please provide valid quantity & it must be greater than zero." });
        }
    }
    const finduser = await userModel.findById({_id:userId})
    if(!finduser){
        return res.status(400).send({status: false, message:`user doesn't exist by ${userId}`})
    }

    
    else if (finduser._id != req.dtoken) {
        return res.status(403).send({
            status: false,
            message: "Unauthorized access."
        })
    }


const findproduct = await productModel.findById({_id:productId, isDeleted: false})
    if(!findproduct){
        return res.status(400).send({status: false, message:`productId doesn't exist by ${productId}`})
    }

     if(cartId){
        if (!Validator.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Please provide valid cartId" });
        }
    }
        const findCartOfUser = await cartModel.findOne({ userId: userId, isDeleted: false });
     

if(!findCartOfUser) {
    var cardData = {
        userId: userId,
        items:[
            { 
                productId: productId,
                quantity: quantity
            }],
         
            totalPrice: findproduct.price * quantity,
            totalItems: 1,
    };
    const createCart = await cartModel.create(cardData);
    return res.status(201).send({status: true, message: "Cart created Successfully", data: createCart})
}

//...............check productId is present In Cart.........................
if (findCartOfUser) {

   // let price = findCartOfUser.totalPrice + quantity * findproduct.price;

    let arr = findCartOfUser.items;
    if(findCartOfUser.items.length> 0 ){

let noproductId = true

    for (i in arr) {
        if (arr[i].productId == productId) {
            findCartOfUser.items[i].quantity += quantity
          noproductId = false}}

          if (noproductId){
            let obj= {}
            obj.productId = findproduct._id
            obj.quantity = quantity
            findCartOfUser.items.push(obj)
          }
        }
        else{ 
            let obj= {}
            obj.productId = findproduct._id
            obj.quantity = quantity
            findCartOfUser.items.push(obj)
        }

        findCartOfUser.totalPrice  = findCartOfUser.totalPrice +  findproduct.price;
        findCartOfUser.totalItems = findCartOfUser.items.length
//-------------Update Cart---------------------//

           findCartOfUser.save()
            return res.status(200).send({ status: true, message: `Product added successfully`, data: findCartOfUser });



        }
    }
    
 catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, error: err.message })
}

}

const updateCart = async function (req, res) {
    try {
      let userId = req.params.userId;
  
      let { cartId, productId, removeProduct } = req.body;
  
      if (!productId)
        return res
          .status(400)
          .send({ status: false, message: " Please provide productId" });
  
      if (!Validator.isValidObjectId(productId)) {
        return res
          .status(400)
          .send({ status: false, message: " Enter a valid productId" });
      }
  
      let product = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      if (!product)
        return res
          .status(400)
          .send({ status: false, msg: "Product does not exist" });

          //AuthoriZation check..................................................................................../////

          if(userId != req.dtoken) res.status(403).send({status: false, message: "Unauthorized access"})
  
      let cart = await cartModel.findOne({ userId: userId });
      if (!cart)
        return res
          .status(400)
          .send({ status: false, msg: "cart does not exist" });

  
      if (!("removeProduct" in req.body))
        return res
          .status(400)
          .send({
            status: false,
            message: " Please enter removeProduct details",
          });
  
      if (cartId) {
        if (!Validator.isValidObjectId(cartId)) {
          return res
            .status(400)
            .send({ status: false, message: " Enter a valid cartId" });
        }
        if (cartId !== cart._id.toString())
          return res
            .status(400)
            .send({
              status: false,
              msg: "This cart does not belong to the user",
            });
      }
  
      let arr = cart.items;
      compareId = arr.findIndex((obj) => obj.productId == productId);
      if (compareId == -1) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "The product is not available in this cart",
          });
      }
      let quantity1 = arr[compareId].quantity;
      if (removeProduct == 0) {
        console.log("ok")
        cart.items.splice(compareId , 1);
        cart.totalItems =arr.length
        cart.totalPrice -= product.price * quantity1;
        cart.save();
        return res.status(200).send({ status: true, data: cart });
      } else if (removeProduct == 1) {
        if (arr[compareId].quantity == 1) {
          arr.splice(compareId - 1, 1);
          cart.totalItems = arr.length;
          cart.totalPrice -= product.price;
          await cart.save();
          return res.status(200).send({ status: true, data: cart });
        } else if (arr[compareId].quantity > 1) arr[compareId].quantity -= 1;
        cart.totalItems = arr.length;
        cart.totalPrice -= product.price;
        await cart.save();
        return res.status(200).send({ status: true, data: cart });
      }
    } catch (err) {
      return res.status(500).send({ status: false, error: err.message });
    }
  };

//getCart..................................................**///
  const getCart = async function (req, res) {
    try {
      let userId = req.params.userId;

      if(userId != req.dtoken) res.status(403).send({status: false, message: "Unauthorized access"})
  
      let cartDetails = await cartModel
        .findOne({ userId: userId })
        .populate("items.productId");
  
      if (!cartDetails)
        return res.status(404).send({ status: false, message: "Cart not found" });
  
      return res
        .status(200)
        .send({
          status: true,
          message: "Cart details with Product details",
          data: cartDetails,
        });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  //----------------------------------------------------delete cart-----------------------------------------------------------
  
  const delCart = async (req, res) => {
    try {
      let userId = req.params.userId;

      if(userId != req.dtoken) res.status(403).send({status: false, message: "Unauthorized access"})
  
      let deleteCart = await cartModel.findOneAndUpdate(
        { userId: userId },
        { items: [], totalPrice: 0, totalItems: 0 },
        { new: true }
      );
      return deleteCart
        ? res.status(204).send({
            status: false,
            message: "Cart Successfully Deleted",
            data: deleteCart,
          })
        : res
            .status(404)
            .send({
              status: false,
              message: "There is no cart under this user id",
            });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };












module.exports = {createCart, updateCart, getCart, delCart}






// cartModel.findById(cartId).populate([{ path: "items.productId" }])
