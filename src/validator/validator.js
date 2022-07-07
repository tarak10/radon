const mongoose =require('mongoose')
 exports.isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false 
     return true
}

exports.validString = (String) => {
   if (/\d/.test(String)) {
     return true
   } else {
     return false;
   };
 };


 exports.isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
}
 exports.isValidObjectId = (objectId) => {
   return mongoose.Types.ObjectId.isValid(objectId)
 };

 
 exports.isvalidDate = (date) => {
  
 }