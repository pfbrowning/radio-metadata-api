const proxyquire = require('proxyquire')
const spyFactories = require('../utilities/spy-factories')
const testHelpers = require('../utilities/test-helpers')
const httpErrors = require('../utilities/http-errors')

describe('error middleware', () => {
  let logger
  let response
  let next
  let errorMiddleware

  beforeEach(() => {
    logger = spyFactories.createLoggerSpy()
    response = spyFactories.createExpressResponseSpy()
    next = jasmine.createSpy('next')
    errorMiddleware = proxyquire('../middlewares/error', {
      '../logger': logger
    })
  })

  it('should return a 401 for unauthorized errors', () => {
    // Arrange: Set up a dummy unauthorized error to pass in
    const error = {
      name: 'UnauthorizedError',
      message: 'Test Message'
    }

    /* Act: Pass the dummy error and the appropriate spies
        to the middleware function. */
    errorMiddleware(error, null, response, next)

    // Assert that the expected 401 and associated JSON response were passed
    testHelpers.assertExpressStatusCode(response.status, 401)
    testHelpers.assertExpressJsonResponse(response.json, new httpErrors.Unauthorized(error.message))
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should return a 500 and log the error for all other errors', () => {
    // Arrange: Set up a dummy error to pass in
    const error = {
      name: 'Dummy Error',
      message: 'Test Message 2',
      stack: 'Dummy Stack'
    }

    /* Act: Pass the dummy error and the appropriate spies
        to the middleware function. */
    errorMiddleware(error, null, response, next)

    /* Assert that the expected 500 and associated JSON response were
        passed and that the error was logged. */
    testHelpers.assertExpressStatusCode(response.status, 500)
    testHelpers.assertExpressJsonResponse(response.json, new httpErrors.InternalServerError(error.message))
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
