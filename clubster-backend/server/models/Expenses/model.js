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


module.exports = mongoose.model('expenses', Expenses);
