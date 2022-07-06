
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



 exports.isValidObjectId = (objectId) => {
   return mongoose.Types.ObjectId.isValid(objectId)
 };