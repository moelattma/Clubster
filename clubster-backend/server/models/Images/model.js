var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const Images = new Schema({
    img: { data: Buffer, contentType: String}
}, {
    timestamps: true
});
module.exports = mongoose.model('images', Images);
