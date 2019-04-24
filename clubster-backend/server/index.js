
const express = require('express');
const loginRoutes = require('./models/Users/routes');
const organizationRoutes = require('./models/Organizations/routes');
const eventRoutes = require('./models/Events/routes');
const ridesRoutes = require('./models/Rides/routes');
const conversationRoutes = require('./models/Conversations/routes');
const galleriesRoutes = require('./models/Galleries/routes');
const messageRoutes = require('./models/Messages/routes');
const notificationRoutes = require('./models/Notifications/routes');
const Conversations = require('./models/Conversations/model');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const multer = require('multer');
const graphRoutes = require('./models/Graphs/routes');

mongoose.Promise = global.Promise; // let's us use then catch
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb://${process.env.databaseUsername}:${process.env.databasePassword}@ds131963.mlab.com:31963/clubster`, { useNewUrlParser: true });
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

app.get('/', (req, res) => res.send('Hello, World!'));

app.use('/api', [loginRoutes, organizationRoutes,
  notificationRoutes, eventRoutes, ridesRoutes,
  conversationRoutes, messageRoutes, graphRoutes,
  galleriesRoutes
]);

const PORT = process.env.PORT || 3000;
const server = require("http").createServer(app);
var io = require('socket.io').listen(server);
var url = require('url');

io.sockets.on('connection', socket => {
  clientId=socket.handshake.query.id;
  socket.on("input", msg => {
    Conversations.findOne({idOfClub: mongoose.Types.ObjectId(socket.handshake.query.groupId)}).populate({ path: 'messages', populate: { path: 'user' } }).then((conversation) => {
      socket.emit('output', conversation.messages[conversation.messages.length - 1]);
    })
  });
});

server.listen(PORT, () => console.log('server'));
