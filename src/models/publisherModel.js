const mongoose  = require ('mongoose');

const publisherSchema = new mongoose.Schema({
    name: String,
    headquarte: String,
}, 
{ timestamps: true})

module.exports = mongoose.model('newpublisher', publisherSchema)

