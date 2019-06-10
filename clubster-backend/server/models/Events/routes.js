/*
* This is the routes file for the Organizations folder.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const router = require('express').Router();	//express router, useful for toggling between routes
const controller = require('./controller');	//import controller method
const passport = require('passport');	//import passport, useful for authentication
const multer = require('multer');	//multer, needed for image uploading
var upload = multer({ dest: 'uploads/' });	//upload in this folder

router.post('/events/:eventID/delete', (req, res) => {
	controller.delEvent(req, res);
});

router.get('/events/:organizationID', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getEvents(req, res); // If url is of the form ../events/jewiofheifjwof the getEvents method will run
});

router.get('/events', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getAllEvents(req, res); // If url is of the form ../events/jewiofheifjwof the getEvents method will run
});

router.get('/events/:eventID/comments', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getComments(req, res); // If url is of the form ../events/jewiofheifjwof the getEvents method will run
});

router.get('/events/:eventID/likers', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getLikers(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addLikers method will run
});

router.get('/events/:eventID/photo', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getPhotos(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.post('/events/:organizationID/new', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addEvent(req, res); // If url is of the form ../events/jewiofheifjwof/new the addEvent method will run
});

router.post('/events/:eventID/going', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.handleGoing(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.get('/events/:eventID/going', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getGoing(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.post('/events/:eventID/photo', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addPhotoToEvent(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.post('/events/:eventID/likers', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.handleLike(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.post('/events/:eventID/comments', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addCommentToEvent(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.post('/events/modEventPic/:eventID', upload.single('fileData'), (req, res) => {
	controller.changeEventPicture(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

router.post('/events/:eventID', (req, res) => {
	controller.updateEvent(req, res);
});

router.get('/events/getClubEvent/:eventID', (req, res) => {
	controller.getClubEvent(req, res);
});


router.post('/events/:eventID/:userID', (req, res) => {
	controller.addWentUser(req, res); // If url is of the form ../events/nekfmwefelfk;3lf3w the addMemberToEvent method will run
});

//Export
module.exports = router;
