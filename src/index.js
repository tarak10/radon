const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

const Lower = function(){
    const str = "steel city jamshedpur"
    const str1 = console.log(str.toLocaleLowerCase()) 
}
    const Upper = function(){



    const  xyz = "steel city jamshedpur"
    const  klm = console.log(xyz.toLocaleUpperCase()) 

  }


module.exports.Lower = Lower
module.exports.Upper = Upper