const express = require('express');
const router = express.Router();
//const externalModule = require('./routes')

// router.get('/test-me', function (req, res) {
//     console.log('The constant in logger route has a value '+externalModule.endpoint)
//     console.log('The current batch is '+externalModule.batch)
//     externalModule.log()
//     res.send('My first ever api!')
// const router = express.Router();
// })
router.get('/hello',function (req, res) {
    res.send('my second api')

    const cde = require("lodash")
    let month = ['jan','feb','mar','apr','may','jun','july','aug','sep','oct','nov','dec']
    console.log(cde.chunk(month,3))

    let array = [1, 3, 7, 9, 11, 13, 15, 17, 21, 23]

    console.log(cde.tail(array))


    const a = [2, 3, 1, 5, 1, 7, 8, 9]
    const b = [2, 3, 1, 5, 1, 7, 8, 9]
    const c = [2, 3, 1, 5, 1, 7, 8, 9]
    const d = [2, 3, 1, 5, 1, 7, 8, 9]
    const e = [2, 3, 1, 5, 1, 7, 8, 9]
    console.log(cde.union(a, b, c, d, e))

    const object = [["horror","The shinning"],["drams","titanic"],["thriller","shutter Island"],["fantasy","Pans Labyrinth"]]
    console.log(cde.fromPairs(object))
})
module.exports = router;

// adding this comment for no reason





