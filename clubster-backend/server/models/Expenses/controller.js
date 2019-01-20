const Expenses = require('./model');

//Method to grab expenses of an eventID.
exports.grabExpenses = (req, res) => {
	const { orgID } = req.params;
	// Find the expenses based on the organization ID
	Expenses.find({ idOfClub: orgID }).populate({ path: 'idOfEvent', populate: { path: 'image' }} ).then((expenses) => {
		// if the expenses are not found
		if (!expenses)
		{
			return res.status(400).json({'Error':'No expenses found'});
		}
		// return expenses
		else {
			return res.status(201).json({'expenses': expenses});
		}
	});

};
