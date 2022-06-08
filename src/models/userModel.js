const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {
    firstName: String
    //lastName: String,
    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema) //users



// String, Number
// Boolean, Object/json, array