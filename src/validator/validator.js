const mongoose = require('mongoose')
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


exports.isValidDate = (Date) => {
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(Date)) {
    return true
  } else {
    return false;
  };
}

exports.isValidIsbn = (ISBN) => {
  if (/^(\d{13})?$/.test(ISBN)) {
    return true
  } else {
    return false;
  };
}