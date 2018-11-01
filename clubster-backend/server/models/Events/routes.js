/*
* This is the routes file for the Organizations folder.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

const router = require('express').Router();
const controller = require('./controller');

router.get('/events/:organizationID', (req, res) => {
	controller.getEvents(req, res);
});

router.post('/events/:organizationID/new', (req, res) => {
	controller.addEvent(req, res);
});

module.exports = router;