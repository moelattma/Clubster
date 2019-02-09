/*
* This is the routes file for the Organizations folder.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const router = require('express').Router();	//express router, useful for toggling between routes
const controller = require('./controller');	//import controller method
const passport = require('passport');	//import passport, useful for authentication
const multer = require('multer');	//multer, needed for image uploading
var upload = multer({ dest: 'uploads/' });	//upload in this folder

router.get('/events/:organizationID', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getEvents(req, res); // If url is of the form ../events/jewiofheifjwof the getEvents method will run
});

router.get('/events/:eventID/like', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getLikes(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.post('/events/:organizationID/new',upload.single('fileData'), passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addEvent(req, res); // If url is of the form ../events/jewiofheifjwof/new the addEvent method will run
});

router.post('/events/:eventID', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addMemberToEvent(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.post('/events/:eventID/like', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addLikeToEvent(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

//Export
module.exports = router;
