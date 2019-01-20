/*
* This is the model file for the Images schema. Each document has a img buffer reference and a timestamp.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const Images = new Schema({
    img: { data: Buffer, contentType: String}
}, {
    timestamps: true
});

// Export the model
module.exports = mongoose.model('images', Images);
