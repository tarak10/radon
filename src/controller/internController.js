const internModel = require('../model/internModel')
const validator = require('validator')
const collegeModel = require('../model/collegeModel')

const stringV = function(value) {
    let a = typeof(value)
    if (a !== 'string') {
        return true
    }
    return false
}

const idV = function(value) {
    if (!validator.isAlpha(value)) {
        return true
    }
    return false
}

const createIntern = async function(req, res) {
    let result = {}
    const { name, email, mobile, collegeName } = req.body

    if (Object.keys(req.body).length == 0) {
        resturn.status(400).send({ status: false, message: "Kindly enter your details." })
    }

    if (Object.keys(name).length == 0) {
        return res.status(400).send({ status: false, message: "Intern name is required" })
    }

    if (stringV(name) || idV(name)) {
        return res.status(400).send({ status: false, message: "Intern name is not valid" })
    }
    result.name = name

    if (Object.keys(email).length == 0) {
        return res.status(400).send({ status: false, message: "Intern email is required" })
    }

    if (stringV(email) || !validator.isEmail(email)) {
        return res.status(400).send({ status: false, message: "Intern email is incorrect" })
    }

    let duplicateEmail = await internModel.find({ email: email })
    if (duplicateEmail) {
        return res.status(400).send({ status: false, message: "Intern email already exists." })
    }
    result.email = email

    if (Object.keys(mobile).length == 0) {
        return res.status(400).send({ status: false, message: "Intern mobile is required" })
    }

    if ((typeof(mobile) !== Number || mobile.length < 10)) {
        return res.status(400).send({ status: false, message: "Intern mobile number is incorrect" })
    }

    let duplicateMobile = await internModel.find({ mobile: mobile })
    if (duplicateMobile) {
        return res.status(400).send({ status: false, message: "Intern mobile number already exists." })
    }
    result.mobile = mobile

    let a = await collegeModel.find({ name: collegeName }).select({ _id: 1 })
    if (!a) {
        return res.status(400).send({ status: false, message: "Enter a valid college name." })
    }
    result.collegeId = a
    let saveData = await (await internModel.create(rresult)).populate('collegeId')
    return res.status(201).send({ status: true, data: { saveData } })
}

module.exports.createIntern = createIntern