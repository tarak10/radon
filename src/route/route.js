const express = require('express');
const { get } = require('http');
const route = express.Router()
const collegeController = require('../controller/collegeController')
const internController = require('../controller/internController')

route.post('/functionup/colleges', collegeController.createCollege)

route.post('/functionup/colleges', collegeController.createCollege)

route.get('/functionup/colleges', collegeController.createCollege)

module.exports = route;