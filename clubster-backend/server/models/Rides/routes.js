/*
* This is the routes file for the Profile folder.
*/

// lets me use GET POST requests for profile route
const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });

module.exports = router;
