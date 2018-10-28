const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Expenses = new Schema({
	idOfClub: {
		type: Schema.Types.ObjectId,
		ref: 'organizations',
		required: true
	},

	amount: {
		type: Schema.Types.Decimal128,
		required: true
	}
});


module.exports = mongoose.model('Expenses', Expenses);