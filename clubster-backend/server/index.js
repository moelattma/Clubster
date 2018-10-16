/*
* Index.js file for server. This file gets run when we do require(./server).
* Author: ayunus@ucsc.edu
*/

const express = require('express');                               //Express(API Construction)
const mongoose = require('mongoose');                             //Mongoose, node library helper for backend to frontend communication
const bodyParser = require('body-parser');                        //Body-parser helps us parse body requests
const {databasePassword, databaseUsername} = require('../config') //Mongodb connection fields

/*
* Configure promises so that we can use then catch blocks and secures a connection to mongodb database
*/
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${databaseUsername}:${databasePassword}@ds131963.mlab.com:31963/clubster`);
mongoose.connection
    .once('open', () => console.log('Mongodb running'))
    .on('error', err => console.log(err))

/*
* Bare minimum boilerplate code needed to utilize express
*/
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, err => {
  if(err) {
    console.log(err);
  } else {
    console.log(`App is listening on port: ${PORT}`);
  }
});
