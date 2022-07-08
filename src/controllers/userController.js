
const validateEmail = require('email-validator');
const validatePassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
const jwt = require('jsonwebtoken');
const { isValid } = require('../validator/validator')
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")


exports.createUser = async (req, res) => {

    try {

        let userData = req.body;

        const { title, name, phone, email, password,} = userData

        if (Object.keys(userData).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Invalid request parameters. Please provide user details",
            });
        }

        if (!title) return res.status(404).send({ status: false, message: "title missing" })

        let validTitle = ['Mr', 'Mrs', 'Miss']; //validating the title

        //checking if the title is valid
        if (!validTitle.includes(title))
            return res.status(400).send({ status: false, message: "Title should be one of Mr, Mrs, Miss" });


        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required" });
        }
        if (!/^[ a-z ]+$/i.test(name)) {
            res.status(400).send({ status: false, message: "Name should be in valid format" });
            return;
        }

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "Phone number is required" });
        }
        if (!/^[6-9]\d{9}$/.test(phone)) {

            return res.status(400).send({
                status: false,
                message: "Phone number should be in valid format",
            });
        }

        const isPhone = await userModel.findOne({ phone: phone });

        if (isPhone) {
            res.status(400).send({ status: false, message: "Phone number already registered" });
            return;
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }

        if (!validateEmail.validate(email))
            return res.status(400).send({ status: false, msg: "Enter a valid email" })

        const emailUsed = await userModel.findOne({ email: email });
        if (emailUsed) {
            return res.status(400).send({ status: false, message: "Email is already registered" });
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" });

        }

        if (!validatePassword.test(password))
            return res.status(400).send({ status: false, message: "Enter valid Password" });


        const saveUser = await userModel.create(userData)
        return res.status(201).send({ status: true, message: "User successfully created", data: saveUser })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};

exports.userLogin = async (req, res) => {
    try {
        let data = req.body;

        let { email, password } = data;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: " Please provide user details",
            });
        }
        if (!email) return res.status(400).send({ status: false, message: "Email ID is required" });

        if (!password) return res.status(400).send({ status: false, message: "Password is required" });

        let validUser = await userModel.findOne({ email: email, password: password });

        if (!validUser)  //checking user data is available or not    
            return res.status(400).send({
                status: false,
                msg: "User not found",
            });
        let token = jwt.sign({ userId: validUser._id }, 'lama', { expiresIn: '6d' }); //generate jwt token at succesfull login 
        return res.status(200).send({ status: true, message: "Login Successfully", data: { token } });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}