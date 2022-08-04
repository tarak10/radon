const mongoose = require('mongoose')

const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
   // if (typeof (value) === 'object'|| Object.values(value) === 0) return false
    return true
}

const isValidName = (name) => {
    if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z])$/i.test(name))
        return true
}

const isValidTitle = (name) => {
    if (/^[a-zA-Z\s\,\.\-\[.*\]\(.*\)\d]+$/i.test(name))
        return true
}


const isValidimg= (img) =>{
    const reg = /image\/png|image\/jpeg|image\/jpg/;
    return reg.test(img)
}

const isValidEmail = (email) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
        return true
}

function isValidPhone(phone) {
    if (/^[6-9][0-9]{9}$/.test(phone))
        return true
    else return false
}
const isValidPrice = function(data){
    if ((/^[0-9]{2,5}\.[0-9]{2}$/).test(data)) {
  return true
    }
    return false
  }

  const isValidInstallment = (pincode) => {
    if (/^[0-9]{1,36}$/.test(pincode))
        return true
}



// const isValidPassword = (pw) => {
//     if (/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[#$^+=!*()@%&]).{8,15}$/.test(pw))
//         return true
// }

const isValidpassword = function (password) {

    let checkPassword = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/
    if (checkPassword.test(password)) {
        return true
    }
    return false
}


const isValidPinCode = (pincode) => {
    if (/^[1-9][0-9]{5}$/.test(pincode))
        return true
}

const isValidObjectId = function (userId) {
    return mongoose.Types.ObjectId.isValid(userId)
}


const isvalidQuantity = function isInteger(value) {
    if(value < 1) return false
     if(value % 1 == 0 ) return true
}

module.exports = { isValid, isValidEmail, isValidName, isValidPhone, isValidpassword, isValidimg,isValidTitle,isValidPinCode, isValidObjectId, isValidPrice, isValidInstallment, isvalidQuantity}









