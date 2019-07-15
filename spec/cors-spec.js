const proxyquire = require('proxyquire')

describe('CORS Middleware', () => {
  beforeEach(() => {
    delete process.env.allowedCorsOrigins
  })

  it('should enable CORS with the expected origin based on the value of allowedCorsOrigins', (done) => {
    // Arrange: Define a set of expectations
    const testEntries = [
      { allowedCorsOrigins: null, expectedCorsParams: [] },
      { allowedCorsOrigins: 'http://localhost:4200', expectedCorsParams: [] },
      { allowedCorsOrigins: '{"origin":"http://localhost:4200"}', expectedCorsParams: [] },
      { allowedCorsOrigins: '{}', expectedCorsParams: [] },
      {
        allowedCorsOrigins: '["http://localhost:4200","http://publishedspa.com"]',
        expectedCorsParams: [{ origin: ['http://localhost:4200', 'http://publishedspa.com'] }]
      },
      {
        allowedCorsOrigins: '["http://localhost:4200"]',
        expectedCorsParams: [{ origin: ['http://localhost:4200'] }]
      }
    ]

    // For each expectation
    testEntries.forEach(testEntry => {
      // Arrange
      // If the input value is non-null, set the environment variable accordingly
      if (testEntry.allowedCorsOrigins) process.env.allowedCorsOrigins = testEntry.allowedCorsOrigins
      /* Recreate the CORS spy once for each iteration so that we can always check
                that it's been called exactly once. */
      const cors = jasmine.createSpy('cors')
      // Initialize the middleware with the cors spy
      const corsMiddleware = proxyquire('../middlewares/cors', {
        cors: cors
      })
      // Act: Run the created CORS middleware function
      corsMiddleware()

      // Assert that CORS was called with the expected params
      expect(cors).toHaveBeenCalledTimes(1)
      expect(cors.calls.mostRecent().args).toEqual(testEntry.expectedCorsParams)
    })

    done()
  })
})
