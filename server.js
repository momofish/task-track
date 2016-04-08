var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-authtkt').Strategy;
var colors = require('colors');
var mongoose = require('mongoose');
var request = require('request');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var swig = require('swig');
var xml2js = require('xml2js');
var _ = require('underscore');

var config = require('./config');
var authenticate = require('./middlewares/authenticate');

var app = express();
var production = process.env.NODE_ENV === 'production';


// mongoose init
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});


// passport
var strategy = new Strategy('mysecret', { timeout: 60 * 60, encodeUserData: true, jsonUserData: true });
passport.use(strategy);


// server config
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
if (!production) swig.setDefaults({ cache: false });
app.engine('html', swig.renderFile);
app.use(require('compression')());
app.use(require('morgan')('dev'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('serve-favicon')(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


// router
require('./controllers/routes')(app);

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var user = { id: req.body.username, username: req.body.username };
  var ticket = strategy.authtkt.createTicket(user.id, { userData: user });
  res.cookie(strategy.key, strategy.authtkt.base64Encode(ticket));
  res.redirect('/');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.use(passport.authenticate('authtkt', { session: false, failureRedirect: '/login' }), function(req, res) {
  if (config.disableServerRender) {
    res.render('index');
    return;
  }

  // Babel ES6/JSX Compiler
  require('babel-register');
  var routes = require('./app/routes');

  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      renderProps.params.user = req.user;
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

app.use(function(err, req, res, next) {
  console.log(err.stack.red);
  res.status(err.status || 500);
  res.send({ message: err.message });
});

/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
