// Module dependencies.
var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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
var OAuth2Strategy = require('./libs/passport-bingo').Strategy;
var moment = require('moment');
var crypto = require('./utils/crypto');

// global config
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
moment.locale('zh-cn');

// global vars
var production = process.env.NODE_ENV === 'production';

// express
var app = express();

// mongoose init
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri);
mongoose.connection.on('error', function (err) {
  console.error(err);
  process.exit(1);
});

// passport
passport.use(new LocalStrategy(
  function (loginId, password, done) {
    models.User.findOne({ loginId: loginId.trim().toLowerCase() }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { msg: 'user not found' }); }
      if (!crypto.hashMatch(undefined, password, user.password)) { return done(null, false, { msg: 'invalid password' }); }

      return done(null, user);
    });
  }));

passport.use(new OAuth2Strategy({
  baseURL: config.ssoUri,
  callbackURL: config.siteURL + '/auth/oauth/callback',
  passReqToCallback: true
},
  function (req, accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (req, authUser, done) {
  var user = req.session.user;
  if (user && user.loginId.trim().toLowerCase() == authUser.loginId.trim().toLowerCase()) {
    done(null, req.session.user);
    return;
  }

  models.User.findOne({ loginId: authUser.loginId.trim().toLowerCase() }, function (err, user) {
    if (err) { return done(err); }
    if (!user) return done(new Error(`用户${authUser.loginId}不存在`));

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

// static
app.use(require('serve-favicon')(path.join(__dirname, 'public', 'favicon.png'), { maxAge: 36000000 }));
app.use('/public', express.static('public', { fallthrough: false, etag: false }));
app.use('/lib', express.static('bower_components', { fallthrough: false, etag: false, maxAge: 36000000 }));
app.use('/assets', express.static(config.assetRoot, { fallthrough: false, etag: false, maxAge: 36000000 }));

app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'working', resave: false, saveUninitialized: false,
  store: new MongoStore({
    url: config.mongoUri,
    autoReconnect: true
  })
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/auth/oauth', passport.authenticate('bingo'));
app.get('/auth/oauth/callback', passport.authenticate('bingo', {
  successRedirect: '/', failureRedirect: '/auth/oauth'
}));

// router
require('./controllers')(app);

app.use(function (err, req, res, next) {
  console.log(err.stack.red);
  res.status(err.status || 500);
  res.send({ message: err.message });
});

app.use(authenticate.ensureLoggedIn({ redirectTo: config.loginPath }), function (req, res) {
  if (config.disableServerRender) {
    res.render('index');
    return;
  }

  // Babel ES6/JSX Compiler
  require('babel-register');
  require("babel-polyfill");
  var routes = require('./app/routes');

  Router.match({ routes: routes.default, location: req.url }, function (err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      renderProps.params.user = req.user;
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      res.render('index', { html: html })
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

var server = require('http').createServer(app);
if (config.enableHttps) {
  var fs = require('fs');
  var privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
  var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
  var credentials = { key: privateKey, cert: certificate };
  server = require('https').createServer(credentials, app);
}

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Socket.io stuff.
 */
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
