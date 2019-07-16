const proxyquire = require('proxyquire')

describe('jwt', () => {
  it('should configure jwt authentication based on the provided values for issuer & audience', () => {
    // Arrange: Define a dummy set of input & expectation data
    const testEntries = [
      { issuer: null, audience: null, useJwt: false },
      { issuer: null, audience: 'audience', useJwt: false },
      { issuer: 'issuer', audience: null, useJwt: false },
      { issuer: '     ', audience: '    ', useJwt: false },
      {
        issuer: 'http://issuer.com',
        audience: 'fancy-audience',
        useJwt: true,
        expectedJwtParams: {
          secret: 'jwks-factory',
          audience: 'fancy-audience',
          issuer: 'http://issuer.com/',
          algorithms: ['RS256']
        },
        expectedJwksParams: {
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `http://issuer.com/.well-known/jwks.json`
        }
      },
      {
        issuer: 'http://another-issuer.com/',
        audience: 'another-audience',
        useJwt: true,
        expectedJwtParams: {
          secret: 'jwks-factory',
          audience: 'another-audience',
          issuer: 'http://another-issuer.com/',
          algorithms: ['RS256']
        },
        expectedJwksParams: {
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `http://another-issuer.com/.well-known/jwks.json`
        }
      }
    ]

    // For each dummy input / expectation
    testEntries.forEach(testEntry => {
      // Arrange
      // Clear & reassign 'audience' & 'issuer' based on the test input
      delete process.env.audience
      delete process.env.issuer
      if (testEntry.issuer) process.env.issuer = testEntry.issuer
      if (testEntry.audience) process.env.audience = testEntry.audience
      // Configure spies to test the jwt configuration
      const unless = jasmine.createSpy('unless')
      const jwt = jasmine.createSpy('jwt').and.returnValue({ unless })
      const jwksRsa = jasmine.createSpyObj('jwks-rsa', ['expressJwtSecret'])
      jwksRsa.expressJwtSecret.and.returnValue('jwks-factory')

      // Act: Initialize the index
      const corsMiddleware = proxyquire('../middlewares/jwt', {
        'express-jwt': jwt,
        'jwks-rsa': jwksRsa
      })

      // Assert that jwt was configured as per expectations
      if (testEntry.useJwt) {
        expect(jwt).toHaveBeenCalledTimes(1)
        expect(jwt.calls.mostRecent().args[0]).toEqual(testEntry.expectedJwtParams)

        expect(jwksRsa.expressJwtSecret).toHaveBeenCalledTimes(1)
        expect(jwksRsa.expressJwtSecret.calls.mostRecent().args[0]).toEqual(testEntry.expectedJwksParams)

        expect(unless).toHaveBeenCalledTimes(1)
      } else {
        expect(jwt).not.toHaveBeenCalled()
        expect(jwksRsa.expressJwtSecret).not.toHaveBeenCalled()
      }
    })
  })
});