const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')

const authenticated =function (req,res,next){

try{
    let token= req.headers['authorization']
    console.log(token)
    if(!token) return res.status(400).send({status:false,msg:"Please enter token"})
    let token1 = token.split(" ").pop()
    console.log(token1)
    let validtoken = jwt.verify(token1, "Project-5 productManagementGroup42")
    console.log(validtoken)
    if (!validtoken) return res.status(401).send({ status: false, msg: "Please enter valid Token " })
    req.dtoken= validtoken.userId
}catch (err) {
    return res.status(500).send({
        status: false,
        msg: err.message,
    })
}
next()
}




 module.exports={authenticated}