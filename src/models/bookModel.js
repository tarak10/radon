
const mongoose  = require('mongoose');
const bookSchema  = new mongoose.Schema({
    name: String,
    author_id:  {
        type:  Number,
        requirew: true
    },
    price: Number,
    rating: Number
},{ timestamps:  true});
module.exports = mongoose .model('bokSchema', bookSchema)

    



