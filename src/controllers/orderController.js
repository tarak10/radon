const orderModel = require("../models/orderModel")
const userModel = require ("../models/userModel")
const cartModel = require("../models/cartModel")
const Validator = require("../validators/validator")


const orderCreate = async function (req, res) {
    try{
        let userId = req.params.userId
        let data = req.body

    let objectcreate = {}

        if (!Validator.isValid(data)) {
            return res.status(400).send({
              status: false,
              message: "Cart data is required for order",
            });
          }
          if(userId != req.dtoken) res.status(403).send({status: false, message: "Unauthorized access"})


  const finduser = await userModel.findById({_id:userId})
    if(!finduser){
        return res.status(400).send({status: false, message:`user doesn't exist by ${userId}`})
    }
 

    if(!Validator.isValidObjectId(userId))  return res.status(400).send({status: false, message:"please enter valid userId"})


    if(!Validator.isValid(data.cartId)) return res.status(400).send({status: false, message: "CartId should be present in body"})

    if(!Validator.isValidObjectId(data.cartId))  return res.status(400).send({status: false, message:"please enter valid cartId"})

    let cart = await cartModel.findOne({ userId: userId, _id:data.cartId });
    if (!cart)
      return res
        .status(400)
        .send({ status: false, msg: "No cart exist for this user" });

    if(cart.items.length == 0){
        return res.status(400).send({status:false, message:"your cart is empty"})
    }


    let arr = cart.items
    let totalQuantity = 0
    for(let i=0; i<arr.length;i++){
       totalQuantity += arr[i].quantity
    }
objectcreate.totalQuantity = totalQuantity

if(data.status || data.status === ""){
    data.status= data.status.trim()
    if(!Validator.isValid(data.status)) return res.status(400).send({status: false, message:"status is empty"})
    if(data.status=="cancled" || data.status=="completed") return res.status(400).send({status:false,message:"status cannot be cancelled or completed while creating"})
    if (["pending", "completed", "cancled"].indexOf(data.status) == -1 ) {
        return res.status(400).send({ status: false, data: "Enter a valid status pending or completed or cancled", })
    };
    objectcreate.status = data.status
}

if(data.cancellable || data.cancellable=== ""){
data.cancellable= data.cancellable.trim()
if(!Validator.isValid(data.cancellable)) return res.status(400).send({status: false, message:"cancellable is empty"})
if(!["true","false"].includes(data.cancellable)) return res.status(400).send({status:false, message:"cancellable must be a boolean value"})
if(data.cancellable != true){
    return res.status(400).send({ status: false, data: "Enter a valid status pending or completed or cancled", })
};
objectcreate.cancellable = data.cancellable
}


objectcreate.userId= cart.userId
objectcreate.items= cart.items
objectcreate.totalPrice= cart.totalPrice
objectcreate.totalItems= cart.totalItems

let orderplace = await orderModel.create(objectcreate)
 await cartModel.findOneAndUpdate({_id:data.cartId}, {items: [],totalPrice:0, totalItems: 0})

return res.status(201).send({status:true, message:"Order created successfully", data:orderplace})



        }
        catch (err) {
            console.log(err)
            return res.status(500).send({ status: false, error: err.message })
        }
        
        }


        const updateOrder = async function (req,res){
            try {
                let userId = req.params.userId
                let data = req.body


                if (!Validator.isValid(data)) {
                    return res.status(400).send({
                      status: false,
                      message: "Cart data is required for order",
                    });
                  }
                  if(userId != req.dtoken) res.status(403).send({status: false, message: "Unauthorized access"})

        const {orderId, status} = data;

        if(!Validator.isValid(orderId)){  return res.status(400).send({
            status: false,
            message: "orderId must be present in the requestbody",
          });
        }


        if(!Validator.isValidObjectId(orderId)){  return res.status(400).send({
            status: false,
            message: "please enter valid orderId",
          });
        }

        const orderDetailsByOrderId = await orderModel.findOne({userId: userId,_id:orderId, isDeleted: false})
        if (!orderDetailsByOrderId)
        return res
          .status(400)
          .send({ status: false, msg: "No order exist with this userId" });
          

          
        if (!["pending", "completed", "cancelled"].includes(status)) {
          return res.status(400).send({
              status: false,
              message: "status should be from [pending, completed, cancelled]",
          });
      }

      if (status === "completed" && orderDetailsByOrderId.status === "completed") {
          return res.status(400).send({
              status: false,
              message: "Order completed, now its status can not be updated",
          });
      }

      if (status === "cancelled" && orderDetailsByOrderId.cancellable === false) {
          return res
              .status(400)
              .send({ status: false, message: "This order can not be cancelled" });
      }

      const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status } }, { new: true });

      res.status(200).send({
          status: true,
          message: "order status updated",
          data: updateStatus,
      });
                
            } catch (err) {
                return res.status(500).send({ status: false, error: err.message })
            }
        }

        module.exports = {orderCreate,updateOrder}

        