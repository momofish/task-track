// Module dependencies.
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var OAuth2Strategy = require('passport-oauth2').Strategy;
var OpenIDStrategy = require('passport-openid').Strategy;
var colors = require('colors');
var mongoose = require('mongoose');
var request = require('request');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var swig = require('swig');
var flash = require('connect-flash');
var config = require('./config');
var models = require('./models');
var authenticate = require('./middlewares/authenticate');

// global config
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// global vars
var production = process.env.NODE_ENV === 'production';

// express
var app = express();

// mongoose init
mongoose.connect(config.database);
mongoose.connection.on('error', function () {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// passport
passport.use(new LocalStrategy(
  function (loginId, password, done) {
    models.User.findOne({ loginId: loginId }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { msg: 'user not found' }); }
      if (user.password != password) { return done(null, false, { msg: 'invalid password' }); }

      return done(null, user);
    });
  }));

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://link.bingocc.cc:8080/sso/oauth/2/authorize',
  tokenURL: 'https://link.bingocc.cc:8080/sso/oauth/2/token',
  clientID: 'clientId',
  clientSecret: 'clientSecret',
  callbackURL: "http://localhost:4000/auth/oauth/callback",
  passReqToCallback: true,
  scope: 'read'
},
  function (req, accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null, profile);
  }
));

passport.use(new OpenIDStrategy({
    apiKey: process.env.STEAM_KEY,
    providerURL: 'https://link.bingocc.cc:8080/sso',
    returnURL: 'http://localhost:4000/auth/openid/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, done) {
    done(null, {});
  }
));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (req, id, done) {
  var user = req.session.user;
  if (user && user._id == id) {
    done(null, req.session.user);
    return;
  }

  models.User.findById(id, function (err, user) {
    if (err) { return done(err); }

    req.session.user = user;
    done(null, user);
  });
});

// server config
app.set('port', process.env.PORT || 4000);
app.set('view engine', 'html');
if (!production) swig.setDefaults({ cache: false });
app.engine('html', swig.renderFile);
app.use(require('compression')());
if (!production) app.use(require('morgan')('dev'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(require('serve-favicon')(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// router
require('./controllers')(app);

app.get('/login', function (req, res) {
  res.render('login', { error: req.flash('error') });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'login failed'
}));

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/oauth', passport.authenticate('oauth2'));
app.get('/auth/oauth/callback', passport.authenticate('oauth2', {
  successRedirect: '/', failureRedirect: '/login'
}));

app.get('/auth/openid', passport.authenticate('openid'));
app.get('/auth/openid/return', passport.authenticate('openid', {
  successRedirect: '/', failureRedirect: '/login'
}));

app.use(authenticate.ensureLoggedIn(), function (req, res) {
  if (config.disableServerRender) {
    res.render('index');
    return;
  }

  // Babel ES6/JSX Compiler
  require('babel-register');
  var routes = require('./app/routes');

  Router.match({ routes: routes.default, location: req.url }, function (err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      renderProps.params.user = req.user;
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      // var page = swig.renderFile('views/index.html', { html: html });
      // res.status(200).send(page);
      res.render('index', { html: html })
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

app.use(function (err, req, res, next) {
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

io.sockets.on('connection', function (socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function () {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
