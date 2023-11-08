require('./test-helper')
var sendoso = require( '../lib/passport-sendoso-oauth' );

describe( 'passport-sendoso-oauth', function() {
  describe('module', function() {
    it('should report a version', function() {
      _.isString(sendoso.version).should.equal(true)
    })

    it('should export 0Auth 2.0 strategy', function() {
      sendoso.OAuth2Strategy.should.be.an.instanceOf(Function)
    })
  })
})
