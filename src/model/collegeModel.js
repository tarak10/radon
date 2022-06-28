const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    logoLink: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamp: true });

module.exports = mongoose.model('Colleges', collegeSchema);