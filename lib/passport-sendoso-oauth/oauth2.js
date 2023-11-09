/**
 * Module dependencies.
 */
const util = require('util');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const InternalOAuthError = require('passport-oauth').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Sendoso authentication strategy authenticates requests by delegating to
 * Sendoso using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Sendoso application's client id
 *   - `clientSecret`  your Sendoso application's client secret
 *   - `callbackURL`   URL to which Sendoso will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new SendosoStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/api/sendoso/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://app.sendoso.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://app.sendoso.com/oauth/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'sendoso';
  this._skipUserProfile = true;
  this._passReqToCallback = true;
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Adds extra properties to the authorization URL.
 *
 *
 * @param {object} options
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
  const params = {};
  if (options.state) {
    Object.assign(params, {
      state: options.state
    });
  }

  if (options.grant_type) {
    params['grant_type'] = options.grant_type;
  }

  return params;
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
