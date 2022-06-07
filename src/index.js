const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Tarkeshwar:uy9PusEJInNuEpVf@cluster0.que2z.mongodb.net/Tarkeshwar10-DB?retryWrites=true&w=majority",{
useNewUrlparser: true
})
.then( () => console.log("mongoDb is connected"))
.catch (err => console.log())

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
