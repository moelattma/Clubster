
const express = require('express');
const loginRoutes = require('./models/Users/routes');
const organizationRoutes = require('./models/Organizations/routes');
const profileRoutes = require('./models/Profile/routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {databasePassword, databaseUsername} = require('../config')

mongoose.Promise = global.Promise;
// connects to database
mongoose.connect(`mongodb://${databaseUsername}:${databasePassword}@ds131963.mlab.com:31963/clubster`);
mongoose.connection
    .once('open', () => console.log('Mongodb running'))
    .on('error', err => console.log(err));

    // to use routes
const app = express();
// lets us access write json objects 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'))

app.use('/api', [loginRoutes,organizationRoutes, profileRoutes]);

const PORT = process.env.PORT || 3000;

app.listen(PORT, err => {
  if(err) {
    console.log(err);
  } else {
    console.log(`App is listening on port: ${PORT}`);
  }
});
