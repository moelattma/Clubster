/*
* This is the routes file for the Organizations folder.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/events/:organizationID', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getEvents(req, res);
});

router.post('/events/:organizationID/new',upload.single('fileData'), passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addEvent(req, res);
});

router.post('/events/:eventID/:idOfAttender', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addMemberToEvent(req, res);
});

module.exports = router;
