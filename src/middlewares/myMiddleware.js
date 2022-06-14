const headerCheck  = function (req,res,next){
    if(req.headers.isfreeappuser)
     next()
    else res.send("please  provide header")
}

module.exports.headerChek= headerCheck
