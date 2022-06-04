const printDate = function(){
    let currentDate  = new Date()
    console.log(currentDate)
}

const printMonth = function(){
    let currentdate = new Date()
    let currentMonth  = currentdate.getMonth()
    console.log('The current month is'+currentMonth)

}
   
const getBatchInfo = function(){
let batchInformation = 'Radon, W3D3, the topic for today session was Nodejs'
console.log(batchInformation)
}

module.exports.printDate = printDate
module.exports.getCurrentMonth = printMonth
module.exports.getcohortData = getBatchInfo