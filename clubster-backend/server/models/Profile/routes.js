/*
* This is the routes file for the Profile folder.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/

// lets me use GET POST requests for profile route
const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');
// user submitting their info
router.post('/profile',passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('here');
    controller.profileSubmission(req,res);
});

// user requesting their profile on screen
router.get('/profile',(req, res) => {

});

module.exports = router;
