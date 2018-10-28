/*
* This is the routes file for the Organizations folder.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');

router.get('/organizations/all', (req, res) => {
	controller.getAllClubs(req, res);
});

router.post('/organizations/new', (req, res) => {
	controller.addOrg(req, res);
});

router.get('/organizations', passport.authenticate('jwt', { session: false }), (req, res) => {
	console.log('just bhe');
	controller.getUserClubs(req, res);
});

module.exports = router;
