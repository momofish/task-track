// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , APIError = require('./errors/apierror');

function Strategy(options, verify) {
  options = options || {};
  var baseURL = options.baseURL || 'https://sso.bingosoft.net';
  options.authorizationURL = options.authorizationURL || (baseURL + '/oauth/2/authorize');
  options.tokenURL = options.tokenURL || (baseURL + '/oauth/2/token');
  options.userProfileURL = options.userProfileURL || (baseURL + '/oauth/checktoken');
  options.clientID = options.clientID || 'clientId';
  options.clientSecret = options.clientSecret || 'clientSecret';
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
