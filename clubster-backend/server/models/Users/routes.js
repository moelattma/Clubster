/*
* This is the routes file for the Users schema. In this file, we will handle what should happen at each request of this component.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const router = require('express').Router();
const controller = require('./controller');

router.post('/register', (req, res) => {
	controller.createUser(req, res);
});

router.post('/login', (req, res) => {
	controller.findUser(req, res);
});

module.exports = router;