const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');


router.get('/expenses/:orgID', (req, res) => {
	controller.grabExpenses(req, res);
});

module.exports = router;
