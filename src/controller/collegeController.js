const collegeModel = require('../model/collegeModel')
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

const createCollege = async function(req, res) {
    const { name, fullname, logoLink } = req.body

    if (Object.keys(req.body).length == 0) {
        resturn.status(400).send({ status: false, message: "Kindly enter your details." })
    }

    if (stringV(name) || idV(name)) {
        return res.status(400).send({ status: false, message: "Invalid College Name" })
    }

    if (stringV(fullName) || idV(fullName)) {
        return res.status(400).send({ status: false, message: "Invalid Full Name of the college" })
    }

    let saveData = await collegeModel.create(req.body)
    return res.status(201).send({ status: true, data: { saveData } })

}
module.exports.createCollege = createCollege