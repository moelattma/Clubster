/*
* Model For Comments.
* Author: klam18@ucsc.edu
* Class: CS116
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comments = new Schema ({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    content: {
        type: String
    }
});

module.exports = mongoose.model('comments', Comments);
