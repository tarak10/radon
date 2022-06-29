const internModel = require('../model/internModel')
const validator = require('validator')
const collegeModel = require('../model/collegeModel')

const nullValue = function(value) {
    if (typeof value == undefined || typeof value == null) return false
    return true
}

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
        return res.status(400).send({ status: false, message: "Kindly enter your details." })
    }

    if (!nullValue(name)) {
        return res.status(400).send({ status: false, message: "Intern name is required" })
    }
    if (stringV(name)) {
        return res.status(400).send({ status: false, message: "Intern name is not valid" })
    }
    result.name = name


    if (!nullValue(email)) {
        return res.status(400).send({ status: false, message: "Intern email is required" })
    }
    if (stringV(email) || !validator.isEmail(email)) {
        return res.status(400).send({ status: false, message: "Intern email is incorrect" })
    }
    let duplicateEmail = await internModel.findOne({ email: email }) //findOne will give us null so null is used as false in boolean
    if (duplicateEmail) {
        return res.status(400).send({ status: false, message: "Intern email already exists." })
    }
    result.email = email


    if (!nullValue(mobile)) {
        return res.status(400).send({ status: false, message: "Intern mobile is required" })
    }
    if (!validator.isMobilePhone(mobile)) {
        return res.status(400).send({ status: false, message: "Intern mobile number not valid" })
    }
    let duplicateMobile = await internModel.findOne({ mobile: mobile })
    if (duplicateMobile) {
        return res.status(400).send({ status: false, message: "Intern mobile number already exists." })
    }
    result.mobile = mobile


    let a = await collegeModel.findOne({ name: collegeName }).select({ _id: 1 })
    if (!a) {
        return res.status(400).send({ status: false, message: "Enter a valid college name." })
    }
    result.collegeId = a
    let saveData = await internModel.create(result)
    return res.status(201).send({ status: true, data: { saveData } })
}


const getInterns = async function(req, res) {

    let collegeName = req.query.collegeName

    if (!nullValue(collegeName)) {
        res.status(400).send({ status: false, message: 'College name is require' })
    }

    let collegeId = await collegeModel.findOne({ name: collegeName }).select({ _id: 1, name: 1, fullName: 1, logoLink: 1 })

    console.log(collegeId)
    let data = {}

    let intern = await internModel.find({ collegeId: collegeId._id }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
    console.log(intern)
    data['name'] = collegeId.name
    data['fullName'] = collegeId.fullName
    data['logolink'] = collegeId.logoLink
    data["intern"] = intern

    return res.status(200).send({ status: true, data })
}

module.exports.createIntern = createIntern
module.exports.getInterns = getInterns