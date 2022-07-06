const jwt = require('jsonwebtoken');
const mongoose  = require('mongoose');
const userModel =require
exports.authentication = async (req,res) => {
    
}









exports.authorise = async function(req,res,next){

    try {
        
const userId = req.body.userId

if(!mongoose.Types.ObjectId.isValid(userId)){
    return res.status(403).send("Provide valid userId")
}

const data = await userModel.findById()
    } catch (error) {
        
    }
}