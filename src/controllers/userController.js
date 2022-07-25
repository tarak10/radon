const usermodel = require('../models/userModel')
const Validator = require('../validators/validator')
const jwt = require('jsonwebtoken')
const aws = require('../validators/aws')
const bcrypt = require('bcrypt')
 
//const saltRounds = 10




const createUser = async function(req,res){
    try {
        let data= req.body
        let { fname,lname,email,phone,password,address, ...rest} = data

        // bcrypt.genSalt(saltRounds, function(err, saltRounds)) {
        
    

        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await aws.uploadFile( files[0] )
            data.profileImage = uploadedFileURL

            const saltRounds = 10
            let encryptedpassword = bcrypt
            .hash(data.password, saltRounds)
            .then((hash) => {
                console.log(`Hash: ${hash}`)
                return hash;
            });

            data.password = await encryptedpassword


            let result= await usermodel.create(data)
            res.status(201).send({status: true, message:"User created successfully", data:result})
            
    

            // res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
    
    //    const createBook = await BookModel.create(requestBody)
    //     return res.status(201).send({ status: true, msg: "Book created Successfully", data: createBook })

    } 

        // let result= await usermodel.create(data)
        // res.status(201).send({status: true, message:"User created successfully", data:"result"})
        
    catch (error) {
        res.status(500).send({status:false, message: "error"})
        
    }
}


const loginUser = async function (req, res) {

    const requestbody = req.body
    // if (!Validator.isvalidRequestBody(requestbody)) { return res.status(400).send({ status: false, msg: 'Please enter mailId and password ' }) }
     const { email, password } = requestbody
    
    // // to check the email is present 
    // if (!Validator.isValidBody(email)) { return res.status(400).send({ status: false, msg: 'Please enter the Email Id' }) }
    
    // // to validate the emailId 
    // if (!Validator.isValidEmail(email)) { return res.status(400).send({ status: false, msg: 'Please enter valid emailId' }) }
    
    // // to check the password is Present
    // if (!Validator.isValidBody(password)) { return res.status(400).send({ status: false, msg: 'Please enter the password' }) }
    
    // // to validate the password in given length
    // if (!Validator.isValidpassword(password)) { return res.status(400).send({ status: false, msg: "password should be have minimum 8 character and max 15 character" }) }



    
    const user=await usermodel.findOne({email:email,password:password})
    console.log(user)
    await bcrypt.compare(password, user.password )
    if(!user) {return res.status(404).send({status:false,msg:'No such user found'})}

    let token =jwt.sign({
        userId:user._id.toString(),
        project: "Project-5",
        iat:Math.floor(Date.now() / 1000),
        exp:Math.floor(Date.now() / 1000) + 10*60*60
    }, "Project-5 productManagementGroup42 ");

    res.setHeader('x-api-key',token)
    res.status(200).send({
        status:true,
        message:'SuccessFully loggedIn',
        token:token,
    })
}

module.exports = { createUser, loginUser };
