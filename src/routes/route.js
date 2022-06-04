const express = require('express');
const myHelper = require('../util/helper')
const  myformatter = require('../validator/formatter')
const router = express.Router();

router.get('/test-me', function (req, res) {
  
   //  externalModule.printDate()
    //externalModule.getCurrentMonth()
   //externalModule.getcohortData()
   
   
     myformatter.Lower()
     myformatter.Upper()
   // externalModule.log()
    res.send('My first ever api!')

});

module.exports = router;

 router.get('/test-me1', function (req, res) {
    res.send('My second ever api!')
});

router.get('/test-me2', function (req, res) {
    res.send('My third api!')
});

router.get('/test-me3', function (req, res) {
    res.send('My 4th api!')
});

router.get('/test-me4', function (req, res) {
    res.send('My last api!')
});

module.exports = router;
// adding this comment for no reason