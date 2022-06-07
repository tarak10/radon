const mongoose = require('mongoose');
module.exports = mongoose.model('User', userSchema)

const userSchema = new mongoose.Schema({

bookName: String,
authorName: string,
category: String,

    year: Number,


}, { timestamps: true });

module.exports = mongoose.model('Book', userSchema) //users


// String, Number
// Boolean, Object/json, array