/*
* This is the routes file for the Images schema. Based on the url axios has inside, the appropriate function will execute
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/
const fs = require('fs');
const multer = require('multer');
const router = require('express').Router();
const controller = require('./controller');

router.get('/:orgID/SideGraphs', function(req, res) {
    controller.getSideGraphs(req, res);
});

router.get('/:orgID/ActiveChart', function(req, res) {
    controller.getActiveChart(req, res);
});

router.get('/:orgID/EventAttendance', function(req, res) {
    controller.getEventAttendance(req, res);
});

module.exports = router;
