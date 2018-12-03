const Expenses = require('./model')
exports.grabExpenses = (req, res) => {
	const {organizationId} = req.params;
	// Find the expenses based on the organization ID
	Expenses.find({idOfClub: organizationId}).populate({path:'idOfEvent',populate:{path:'image'}}).then((expenses) => {
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
