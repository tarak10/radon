const validateEmail = require('email-validator');
const validatePassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;



exports.userLogin = async (req,res) => {
    try{
        let data = req.body;

        let {email ,password}= data;

        if(!email) return res.status(400).send({status: false, message: "Email ID is required"});

        if(!password) return res.status(400).send({status: false, message: "Password is required"});

        if(!validateEmail.validate(email)) return res.status(400).send({status: false, message: "Enter valid Email ID" });

       if(!validatePassword.test(password)) return res.status(400).send({status: false, message: "Enter valid Password" });

       let validUser = await userSchema.findOne({ email: email, password: password });

       if (!validUser)  //checking user data is available or not    
           return res.status(400).send({
               status: false,
               msg: "User not found",
           });
       let token = jwt.sign({ userId: validUser._id }, 'lama', { expiresIn: '6d' }); //generate jwt token at succesfull login 
      return res.status(200).send({ status: true, message: "Login Successfull", data: { token } });
}catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}