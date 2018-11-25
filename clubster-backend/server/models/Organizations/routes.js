/*
* This is the routes file for the Organizations folder.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/organizations/all', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getAllClubs(req, res);
});

router.post('/organizations/new', upload.single('fileData'), passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.addOrg(req, res);
});

router.get('/organizations', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.getUserClubs(req, res);
});

router.get('/organizations/:orgID/members', (req, res) => {
	controller.getMembers(req, res);
});

router.post('/organizations/:orgID/:idOfMember', (req, res) => {
	controller.deleteClubMember(req, res);
});

router.post('/organizations/isMember', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.isMember(req, res);
});

module.exports = router;
