/*
* This is the model file for the Expenses schema. Each document has an idOfClub, idOfEvent, time and amount field set.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Float = require('mongoose-float').loadType(mongoose);

const Expenses = new Schema({
	idOfClub: {
		type: Schema.Types.ObjectId,
		ref: 'organizations',
		required: true
	},
	idOfEvent: {
		type: Schema.Types.ObjectId,
		ref: 'events',
		required: true
	},
	time : { type : Date, default: Date.now },
	amount: { type: Float }
});

/*
* Export Model
*/
module.exports = mongoose.model('expenses', Expenses);
