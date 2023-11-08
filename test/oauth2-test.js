require('./test-helper')
var SendosoStrategy = require('../lib/passport-sendoso-oauth/oauth2');


describe('SendosoStrategy', function() {
  beforeEach(function() {
    this.strategy = new SendosoStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
  })

  it('should be named sendoso', function() {
    this.strategy.name.should.equal('sendoso')
  })

  describe('strategy authorization params', function() {

    describe('tests that were always failing', function() {
      it('should return empty object when parsing invalid options', function() {
        var params = this.strategy.authorizationParams({foo: 'bar'})
        Object.keys(params).length.should.equal(0)
      })

      // NOTE: The following tests no longer apply
      xit('should return access_type', function () {
        var params = this.strategy.authorizationParams({ accessType: 'offline' });
        params.access_type.should.equal('offline');
      })

      xit('should return approval_prompt', function () {
        var params = this.strategy.authorizationParams({ approvalPrompt: 'force' });
        params.approval_prompt.should.equal('force');
      })

      xit('should return prompt', function () {
        var params = this.strategy.authorizationParams({ prompt: 'consent' });
        params.prompt.should.equal('consent')
      })

      xit('should return login_hint', function () {
        var params = this.strategy.authorizationParams({ loginHint: 'bob@gmail.com' });
        params.login_hint.should.equal('bob@gmail.com')
      })
      xit('should return user_id', function () {
        var params = this.strategy.authorizationParams({ userID: 'bob@gmail.com' });
        params.user_id.should.equal('bob@gmail.com')
      })
      xit('should return hd from hostedDomain option', function () {
        var params = this.strategy.authorizationParams({ hostedDomain: 'mycollege.edu' });
        params.hd.should.equal('mycollege.edu')
      })
      xit('should return hd from hd option', function () {
        var params = this.strategy.authorizationParams({ hd: 'mycollege.edu' });
        params.hd.should.equal('mycollege.edu')
      })
      xit('should return access_type and approval_prompt', function () {
        var params = this.strategy.authorizationParams({ accessType: 'offline', approvalPrompt: 'force' });
        params.access_type.should.equal('offline')
        params.approval_prompt.should.equal('prompt')
      })
    })
  })

  describe('strategy when loading user profile', function() {
    beforeEach(function() {
      var self = this
      this.go = function(cb) {
        process.nextTick(function() {
          self.strategy.userProfile('access-token', function(err, profile) {
            self.error = err
            self.profile = profile
            cb()
          })
        })
      }
    })

    describe('successfully', function() {
      beforeEach(function(done) {
        this.strategy._oauth2.get = function(x, y, callback) {
          var body = '{ \
           "id": "00000000000000", \
           "emails": [ \
             { \
                "email": "fred.example@gmail.com", \
                "verified": true, \
                "primary": true \
             } \
           ], \
           "name": "Fred Example", \
           "first_name": "Fred", \
           "last_name": "Example", \
           "image_id": "00000000" \
          }';

          callback(null, body, undefined);
        }
        this.go(done)
      })

      it('should not error', function() {
        (this.error == null).should.equal(true, 'expected error to be undefined')
      })
      it('should load profile', function() {
        this.profile.provider.should.equal('sendoso');
        this.profile.id.should.equal('00000000000000');
        this.profile.emails[0].email.should.equal('fred.example@gmail.com');
      })
    })

    describe('unsuccessfully', function() {
      beforeEach(function(done) {
        this.strategy._oauth2.get = function(x, y, callback) {
          callback(new Error('something-went-wrong'))
        }
        this.go(done)
      })

      it('should error', function() {
        (this.error != null).should.equal(true, 'expected err to be defined, instead was null')
      })

      it('should wrap error in InternalOAuthError', function() {
        this.error.constructor.name.should.equal('InternalOAuthError')
      })

      it('should not load profile', function() {
        (this.profile == null).should.equal(true, 'expected profile to be undefined')
      })
    })
  })
})
