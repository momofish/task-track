// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , APIError = require('./errors/apierror');

function Strategy(options, verify) {
  options = options || {};
  var baseURL = options.baseURL || 'https://sso.bingosoft.net';
  options.authorizationURL = options.authorizationURL || baseURL && (baseURL + '/oauth/2/authorize');
  options.tokenURL = options.tokenURL || baseURL && (baseURL + '/oauth/2/token');
  options.userProfileURL = options.userProfileURL || baseURL && (baseURL + '/oauth/checktoken');
  options.clientID = options.clientID || 'clientId',
    options.clientSecret = options.clientSecret || 'clientSecret',
    options.scope = options.scope || 'read';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-bingo';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'bingo';
  this._userProfileURL = options.userProfileURL;
  this._oauth2.useAuthorizationHeaderforGET(true);

  var self = this;
  var _oauth2_getOAuthAccessToken = this._oauth2.getOAuthAccessToken;
  this._oauth2.getOAuthAccessToken = function (code, params, callback) {
    _oauth2_getOAuthAccessToken.call(self._oauth2, code, params, function (err, accessToken, refreshToken, params) {
      if (err) { return callback(err); }
      if (!accessToken) {
        return callback({
          statusCode: 400,
          data: JSON.stringify(params)
        });
      }
      callback(null, accessToken, refreshToken, params);
    });
  }
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.useAuthorizationHeaderforGET(false);
  this._oauth2.get(this._userProfileURL
    + '?access_token=' + accessToken + '&resource_id=', accessToken,
    function (err, body, res) {
      if (err) {
        return done(new InternalOAuthError('Failed to fetch user profile', err));
      }

      var loginId = body.trim('\n').split('\n').find(item => item.indexOf('userPrincipal') == 0).split(':')[1];
      done(null, { loginId: loginId });
    });
}


// Expose constructor.
module.exports = Strategy;
