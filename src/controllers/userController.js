const usermodel = require('../models/userModel')
const Validator = require('../validators/validator')
const jwt = require('jsonwebtoken')
const aws = require('../validators/aws')
const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

//const saltRounds = 10




const createUser = async function (req, res) {
     try {
        //console.log(req)
        let data = req.body
        let { fname, lname, email, phone, password, address, ...rest } = data
        if(!rest)res.status(400).send({ status: false, message: "No others key is allowed" }) 
    
        if (Object.keys(data).length == 0) res.status(400).send({ status: false, message: "No others key is allowed" })

        // bcrypt.genSalt(saltRounds, function(err, saltRounds)) {
        //if (!data) res.status(400).send({ status: false, message: "please enter some details" })
        if (!Validator.isValid(fname)) return res.status(400).send({ status: false, message: "please enter fname" })
        if (!Validator.isValidName(fname)) return res.status(400).send({ status: false, message: "please valid fname" })
        if (!Validator.isValid(lname)) return res.status(400).send({ status: false, message: "please enter lname" })
        if (!Validator.isValidName(lname)) return res.status(400).send({ status: false, message: "please valid lname" })
        if (!Validator.isValid(email)) return res.status(400).send({ status: false, message: "please enter email" })
        if (!Validator.isValidEmail(email))return  res.status(400).send({ status: false, message: "please enter valid email" })
        if (!Validator.isValid(phone))return  res.status(400).send({ status: false, message: "please enter phonenumber" })
        if (!Validator.isValidPhone(phone))return  res.status(400).send({ status: false, message: "please enter valid phonenumber" })
        if (!Validator.isValid(password))return  res.status(400).send({ status: false, message: "please enter password" })
        if (!Validator.isValidpassword(password)) return res.status(400).send({ status: false, message: "please enter valid password" })

        if (!Validator.isValid(address)) return res.status(400).send({ status: false, message: "please enter address" })
        // if(!Validator.isValid(address.shipping))res.status(400).send({status:false, message:"please valid lname"}) 
        let shipping = address.shipping
        let billing = address.billing

        if (!Validator.isValid(shipping.street)) return res.status(400).send({ status: false, msg: "shipping street is missing" })
        if (!Validator.isValid(shipping.city)) return res.status(400).send({ status: false, msg: "shipping city is missing" })
        if (!Validator.isValid(shipping.pincode)) return res.status(400).send({ status: false, msg: "shipping pincode is missing" })


        if (!Validator.isValid(billing.street)) return res.status(400).send({ status: false, msg: "billing street is missing" })
        if (!Validator.isValid(billing.city)) return res.status(400).send({ status: false, msg: "billing city is missing" })
        if (!Validator.isValid(billing.pincode)) return res.status(400).send({ status: false, msg: "billing pincode is missing" })


        if (!Validator.isValidName(shipping.street)) return res.status(400).send({ status: false, msg: "shipping street is not valid, this is only in alphabet format" })

        if (!Validator.isValidName(billing.street)) return res.status(400).send({ status: false, msg: "billing street is not valid, this is only in alphabet format" })


        if (!Validator.isValidName(shipping.city)) return res.status(400).send({ status: false, msg: "shipping city is not valid, this is only in alphabet format" })

        if (!Validator.isValidName(billing.city)) return res.status(400).send({ status: false, msg: "billing city is not valid, this is only in alphabet format" })


        if (!Validator.isValidPinCode(shipping.pincode))
            return res.status(400).send({ status: false.valueOf, message: "pincode format not correct in shipping pincode" })

        if (!Validator.isValidPinCode(billing.pincode))
            return res.status(400).send({ status: false.valueOf, message: "pincode format not correct in billing pincode" })

        const uniqueemail = await userModel.findOne({email:email})
        if (uniqueemail) return res.status(400).send({ status: false, message: "emailId already exist" })
        const uniquephone = await userModel.findOne({phone:phone})
        if (uniquephone) return res.status(400).send({ status: false, message: "phonenumber already exist" })


// let updateobject = {}
// profileImage.updateobject = data.profileImage


        let files = req.files
        if (!Validator.isValidimg(files[0].mimetype))
            return res.status(400).send({ status: false, msg: "Please Provide Valid Image Files in Format of [ jpg , jpge ,png ]" })
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await aws.uploadFile(files[0])
            data.profileImage = uploadedFileURL

            const saltRounds = 10
            let encryptedpassword = bcrypt
                .hash(data.password, saltRounds)
                .then((hash) => {
                    console.log(`Hash: ${hash}`)
                    return hash;
                });

            data.password = await encryptedpassword


            let result = await userModel.create(data)
            return res.status(201).send({ status: true, message: "User created successfully", data: result })
        }
        else {
            return res.status(400).send({ msg: "No file found" })
        }

    }

  
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}


const loginUser = async function (req, res) {
try{

    const requestbody = req.body
     if (!Validator.isValid(requestbody)) { return res.status(400).send({ status: false, msg: 'Please enter mailId and password ' }) }
    const { email, password } = requestbody

    // // to check the email is present 
    if (!Validator.isValid(email)) { return res.status(400).send({ status: false, msg: 'Please enter the Email Id' }) }

    // // to validate the emailId 
     if (!Validator.isValidEmail(email)) { return res.status(400).send({ status: false, msg: 'Please enter valid emailId' }) }

    // // to check the password is Present
     if (!Validator.isValid(password)) { return res.status(400).send({ status: false, msg: 'Please enter the password' }) }

    // // to validate the password in given length
     if (!Validator.isValidpassword(password)) { return res.status(400).send({ status: false, msg: "password should be have minimum 8 character and max 15 character" }) }




    const user = await userModel.findOne({ email: email })
    if (!user) { return res.status(404).send({ status: false, msg: 'No such user found' }) }
    let comparepassword = await bcrypt.compare(password, user.password).then((res) => {
        return res
    })
    if (!comparepassword) { return res.status(400).send({ status: false, msg: 'Incorrect PASSWORD' }) }

    let token = jwt.sign({
        userId: user._id.toString(),
        project: "Project-5",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
    }, "Project-5 productManagementGroup42");

    res.header('Authorization',  "Bearer:" + token)
    return res.status(200).send({
        status: true,
        message: 'SuccessFully loggedIn',
        data: { userId: user._id, token: token }

    })
}
catch (error) {
    return res.status(500).send({ status: false, message: "error" })

}
}



const getuserdata = async function (req, res) {
   try{
    let result = req.params.userId
    //if(!result) return  res.status(400).send({status:false, message:`please enter ${userId}`})
   if(!Validator.isValidObjectId(userId)) return res.status(400).send({status:false, message:"please enter valid userId"})

    if (result != req.dtoken) { return res.status(404).send({ status: false, message: "UserId doesn't match" }) }
    
        const dbcall = await userModel.findById({ _id: result })
        if(!dbcall) return  res.status(400).send({status: false, message:"No user found with this userId"})
        return res.status(200).send({ status: true, message: "User profile details", data: dbcall })
    }
    
    catch (error) {
        return res.status(500).send({ status: false, message: "error" })

    }
}



const updateuser = async function (req, res) {
        try{

            let userId = req.params.userId
        let files = req.files
        var data = req.body
        let { fname, lname, password, address } = data
         console.log(address)
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, msg: "provided userId is not valid" })

        var userDoc = await userModel.findOne({ _id: userId })
        if (!userDoc) { return res.status(404).send({ status: false, msg: "no such product available" }) }


        else if (userDoc._id != req.dtoken) {
            return res.status(403).send({
                status: false,
                message: "Unauthorized access."
            })
        }

        if (files.length > 0) {
            if (!Validator.isValidimg(files[0].mimetype))
                return res.status(400).send({ status: false, msg: "Please Provide Valid Image Files in Format of [ jpg , jpge ,png ]" })
            let profileImage = await aws.uploadFile(req.files[0])
            let updateProfile = await userModel.findOneAndUpdate({ _id: userId }, { profileImage: profileImage }, { new: true })

            if (Object.keys(data).length == 0) {
                if (updateProfile) {
                    return res.send(updateProfile)
                }
            }
        }

        if ("fname" in data) {
            if (!Validator.isValid(fname)) { return res.status(400).send({ status: false, msg: "First Name can't be Empty" }) }
            if (!Validator.isValidName(fname))
                return res.status(400).send({ status: false, msg: "Please enter valid First Name" })
            let uniquefname = await userModel.findOne({ fname: fname })
            if (uniquefname) { return res.status(400).send({ status: false, msg: "First Name is already exist" }) }
            userDoc.fname = fname
        }


        if ("lname" in data) {
            if (!Validator.isValid(lname)) { return res.status(400).send({ status: false, msg: "Last Name can't be Empty" }) }
            if (!Validator.isValidName(lname))
                return res.status(400).send({ status: false, msg: "Please enter valid Last Name" })
            let uniquelname = await userModel.findOne({ lname: lname })
            if (uniquelname) { return res.status(400).send({ status: false, msg: "Last Name is already exist" }) }
            userDoc.lname = lname
        }

        if ("password" in data) {
            if (!Validator.isValid(password)) { return res.status(400).send({ status: false, msg: "Password can't be Empty" }) }
            if (!Validator.isValidpassword(password))
                return res.status(400).send({ status: false, msg: "Please enter valid Password" })

            const saltRounds = 10;
            let encryptedPassword = bcrypt
                .hash(data.password, saltRounds)
                .then((hash) => {
                    console.log(`Hash: ${hash}`);
                    return hash;
                });

            userDoc.password = await encryptedPassword;
        }

        const findAddress = await userModel.findOne({ _id: userId });



        if("address" in data){
       if(address.shipping){
        if (address.shipping.street) {
            if (!Validator.isValid(address.shipping.street))
              return res.status(400).send({ status: false, msg: "shipping street is not valid " });
            findAddress.address.shipping.street = address.shipping.street;
          }
          if (address.shipping.city) {
            if (!Validator.isValid(address.shipping.city))
              return res.status(400).send({ status: false, msg: "shipping city is not valid " });
            findAddress.address.shipping.city = address.shipping.city;
          }
          if (address.shipping.pincode) {
            if (!Validator.isValidPinCode(address.shipping.pincode))
              return res.status(400).send({ status: false, msg: "shipping pincode is not valid " });
            findAddress.address.shipping.pincode =address.shipping.pincode;
          }
        }
           
          
          if(address.billing){
          if (address.billing.street) {
            if (!Validator.isValid(address.billing.street))
              return res.status(400).send({ status: false, msg: "billing street is not valid " });
            findAddress.address.billing.street = address.billing.street;
          }
          if (address.billing.city) {
            if (!Validator.isValid(address.billing.city))
              return res.status(400).send({ status: false, msg: "billing city is not valid " });
            findAddress.address.billing.city = address.billing.city;
          }
          if (address.billing.pincode) {
            if (!Validator.isValidPinCode(address.billing.pincode))
              return res.status(400).send({ status: false, msg: "billing pincode is not valid " });
            findAddress.address.billing.pincode =address.billing.pincode;
          }
        }
    }
        
        userDoc.address = findAddress.address;                          
      
        userDoc.save()
        return res.status(200).send({ status: false, msg: "success ", data: userDoc })

         } catch (err) {
            console.log(err)
        res.status(500).send({ status: false, message: err.message });
    }
}
module.exports = { createUser, loginUser, getuserdata, updateuser };
