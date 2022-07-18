const express = require('express');
const bodyParser = require('body-parser');
const route = require('./src/routes/route');
const  mongoose = require('mongoose');
const multer = require ('multer')
const app = express();

app.use(bodyParser.json());
const{AppConfig}=require('aws-sdk');
app.use(multer().any())



mongoose.connect("mongodb+srv://avenger:rajatrajat12@cluster0.wuyw0.mongodb.net/group53Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch (err => console.log(err) )

app.use('/', route);

app.listen( process.env.PORT || 3000, function () {
    console.log('Express app running on port ' +( process.env.PORT || 3000))
});


