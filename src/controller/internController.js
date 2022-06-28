const internModel = require('../model/internModel')
const validator = require('validator')

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
    const { name, email, mobile, collegeId } = req.body

    if (Object.keys(req.body).length == 0) {
        resturn.status(400).send({ status: false, message: "Kindly enter your details." })
    }

    if (stringV(name) || idV(name)) {
        return res.status(400).send({ status: false, message: "Intern name is incorrect" })
    }

    if (stringV(email) || !validator.isEmail(email)) {
        return res.status(400).send({ status: false, message: "Intern email is incorrect" })
    }

    if ((typeof(mobile) !== Number || mobile.length < 10)) {
        return res.status(400).send({ status: false, message: "Intern mobile number is incorrect" })
    }

    let saveData = await internModel.create(req.body)
    return res.status(201).send({ status: true, data: { saveData } })
}

module.exports.createIntern = createIntern