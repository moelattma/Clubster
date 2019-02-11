
const express = require('express');
const loginRoutes = require('./models/Users/routes');
const organizationRoutes = require('./models/Organizations/routes');
const profileRoutes = require('./models/Profile/routes');
const eventRoutes = require('./models/Events/routes');
const imageRoutes = require('./models/Images/routes');
const notificationRoutes = require('./models/Notifications/routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const {databasePassword, databaseUsername} = require('../config')
const multer = require('multer');


mongoose.Promise = global.Promise; // let's us use then catch
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb://${databaseUsername}:${databasePassword}@ds131963.mlab.com:31963/clubster`, { useNewUrlParser: true });
mongoose.connection
    .once('open', () => console.log('Mongodb running'))
    .on('error', err => console.log(err)); // to use routes
const app = express();

//lets us access/write JSON objects and push to database
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));
app.use(morgan('dev')); //debugging for HTTP requests

// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./utils/passport')(passport);

app.use('/api', [loginRoutes, organizationRoutes, profileRoutes, notificationRoutes, eventRoutes,  imageRoutes]);

const PORT = process.env.PORT || 3000;
const server = require("http").createServer(app);
var io = require('socket.io').listen(server);
const port = 3000;

io.sockets.on('connection', socket => {
  console.log("url"+socket.handshake.url);
  clientId=socket.handshake.query.id;
  console.log("connected clientId:"+clientId);
  console.log('a user connected');
  socket.on("chat message", msg => {
    console.log(msg);
    io.emit('chat message', msg);
  });
});

server.listen(port, () => console.log('server'));
