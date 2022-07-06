
 exports.isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false 
     return true
}

exports.isValidrequestBody = function (data) {
   return Object.keys(data).length > 0;
 };