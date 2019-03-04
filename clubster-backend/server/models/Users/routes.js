/*
* This is the routes file for the Users schema. In this file, we will handle what should happen at each request of this component.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');

router.post('/register', (req, res) => {
	controller.createUser(req, res);
});

router.post('/login', (req, res) => {
	controller.findUser(req, res);
});

router.post('/changePhoto', passport.authenticate('jwt', { session: false }), (req, res) => {
	controller.changePhoto(req, res);
});

// user submitting their info
router.post('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
	controller.submitProfile(req, res);
});

// user posts a photo
router.post('/profile/photo', passport.authenticate('jwt', { session: false }), (req, res) => {
	controller.submitProfile(req, res);
});

// user requesting their profile on screen
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
	controller.retrieveProfile(req, res);
});

module.exports = router;
