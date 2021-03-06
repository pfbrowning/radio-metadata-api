const proxyquire = require('proxyquire')
const spyFactories = require('../utilities/spy-factories')

describe('index.ts', () => {
  let express
  let logger
  let corsMiddlewareSpy
  let jwtMiddlewareSpy
  let swaggerMiddlewareSpy
  let errorMiddlewareSpy

  beforeEach(() => {
    express = jasmine.createSpyObj('express', ['listen', 'use'])
    corsMiddlewareSpy = jasmine.createSpy('corsMiddleware')
    jwtMiddlewareSpy = jasmine.createSpy('jwtMiddleware')
    swaggerMiddlewareSpy = jasmine.createSpy('swaggerMiddleware')
    errorMiddlewareSpy = jasmine.createSpy('errorMiddleware')
    logger = spyFactories.createLoggerSpy()
    // Clear each env variable that we care about before each test
    delete process.env.PORT
    delete process.env.audience
    delete process.env.issuer
  })

  it('should listen on port 3000 by default', () => {
    // Act: Initialize the index
    proxyquire('../index', {
      express: () => express,
      './logger': logger,
      './middlewares/cors': corsMiddlewareSpy,
      './middlewares/jwt': jwtMiddlewareSpy,
      './middlewares/swagger': swaggerMiddlewareSpy,
      './middlewares/error': errorMiddlewareSpy,
      './routes/routes': {}
    })
    // Assert: express.listen should have been called once specifying port 3000
    expect(express.listen).toHaveBeenCalledTimes(1)
    expect(express.listen.calls.mostRecent().args[0]).toBe(3000)
  })

  it('should listen on the port specified by PORT', () => {
    // Arrange: Set a custom port value
    process.env.PORT = 42
    // Act: Initialize the index
    proxyquire('../index', {
      express: () => express,
      './logger': logger,
      './middlewares/cors': corsMiddlewareSpy,
      './middlewares/jwt': jwtMiddlewareSpy,
      './middlewares/swagger': swaggerMiddlewareSpy,
      './middlewares/error': errorMiddlewareSpy,
      './routes/routes': {}
    })
    // Assert: Listen should have specified the custom port
    expect(express.listen).toHaveBeenCalledTimes(1)
    expect(express.listen.calls.mostRecent().args[0]).toBe('42')
  })

  it('should apply the expected middlewares', () => {
    // Act: Init index with the relevant express & middleware spies
    proxyquire('../index', {
      express: () => express,
      './logger': logger,
      './middlewares/cors': corsMiddlewareSpy,
      './middlewares/jwt': jwtMiddlewareSpy,
      './middlewares/swagger': swaggerMiddlewareSpy,
      './middlewares/error': errorMiddlewareSpy,
      './routes/routes': {}
    })

    // Assert that the middleware spies were passed to 'app.use', but not actually called
    expect(express.use).toHaveBeenCalledWith(corsMiddlewareSpy)
    expect(express.use).toHaveBeenCalledWith(jwtMiddlewareSpy)
    expect(express.use).toHaveBeenCalledWith('/swagger', jasmine.anything(), swaggerMiddlewareSpy)
    expect(express.use).toHaveBeenCalledWith(errorMiddlewareSpy)
    expect(corsMiddlewareSpy).not.toHaveBeenCalled()
    expect(jwtMiddlewareSpy).not.toHaveBeenCalled()
    expect(swaggerMiddlewareSpy).not.toHaveBeenCalled()
    expect(errorMiddlewareSpy).not.toHaveBeenCalled()
  })

  it('should use our route configuration', () => {
    // Arrange: Set up a dummy route config object
    const testObj = { test: 'test' }

    // Act: Initialize index with the relevant spies
    proxyquire('../index', {
      express: () => express,
      './logger': logger,
      './middlewares/cors': corsMiddlewareSpy,
      './middlewares/jwt': jwtMiddlewareSpy,
      './middlewares/swagger': swaggerMiddlewareSpy,
      './middlewares/error': errorMiddlewareSpy,
      './routes/routes': testObj
    })

    // Assert that the dummy route configuration was set up
    expect(express.use).toHaveBeenCalledWith('/', testObj)
  })
})
