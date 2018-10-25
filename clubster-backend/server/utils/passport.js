/*
* Integration of Passport.js. With this we can secure routes and get the information of logged in users.
* author: ayunus@ucsc.edu
*/
const JwtStrategy = require('passport-jwt').Strategy;   //Necessary to utlize passport
const ExtractJwt = require('passport-jwt').ExtractJwt;  //Library to extract tokens
const User = require('../models/Users/model');                    //User Schema

module.exports = passport => {
  passport.use(
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),     //JWT and secret configuration
      secretOrKey : 'secret'
    }, (jwt_payload, done) => {
      User.findById(jwt_payload._id)                                //Find user by id and return if found
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
