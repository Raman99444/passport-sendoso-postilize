# Passport-Sendoso-postilize

[Passport](http://passportjs.org/) strategies for authenticating with [Sendoso](http://www.hubspot.com/)
using OAuth 2.0.

This module lets you authenticate using Sendoso credentials in your Node.js applications.
By plugging into Passport, Sendoso authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install Passport-Sendoso-postilize

## Usage of OAuth 2.0

#### Configure Strategy

The Sendoso OAuth 2.0 authentication strategy authenticates users using a Sendoso
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```Javascript
var SendosoStrategy = require( 'Passport-Sendoso-postilize' ).Strategy;

passport.use(new SendosoStrategy({
    clientID:     SENDOSO_CLIENT_ID,
    clientSecret: SENDOSO_CLIENT_SECRET,
    callbackURL: "http://yourdomain:3000/auth/sendoso/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // Information is sent back here.
  }
));
```
#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'sendoso'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```Javascript
app.get('/auth/sendoso',
  passport.authenticate('google', { scope: 'contacts content' }
));

app.get( '/auth/sendoso/callback',
	passport.authenticate( 'sendoso', {
		successRedirect: '/auth/sendoso/success',
		failureRedirect: '/auth/sendoso/failure'
}));
```


## License

[The MIT License](http://opensource.org/licenses/MIT)
