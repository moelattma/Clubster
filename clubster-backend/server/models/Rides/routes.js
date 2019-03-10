//Rides POST / GET

const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });

//post new ride
router.post('/:eventID/createRide', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.createRide(req, res); 
});

//post join ride
router.post('/:rideID/joinRide', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.joinRide(req, res); 
});

//get all rides for a specific event
router.get('/:eventID/rides', (req, res) => {
	controller.getRides(req, res);
});

module.exports = router;
