/*
* First file that gets run. It requires babel libraries and runs server/index.js
* Author: ayunus@ucsc.edu
*/
require('babel-register');
require('babel-polyfill');
require('./server');
