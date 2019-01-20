/*
* This is the routes file for the Expenses schema. Based on the url axios has inside, the appropriate function will execute
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/
const router = require('express').Router();	//express router, useful for toggling between routes
const controller = require('./controller'); //import controller method
const passport = require('passport'); //import passport, useful for authentication

/*
* If url is of the form '../expenses/iodhpewjf;lkfew;' this method wil run
*/
router.get('/expenses/:orgID', (req, res) => {
	controller.grabExpenses(req, res);
});

module.exports = router;
