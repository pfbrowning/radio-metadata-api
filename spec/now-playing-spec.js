const proxyquire = require('proxyquire')
const httpErrors = require('../utilities/http-errors.js')
const testHelpers = require('../utilities/test-helpers.js')

describe('now-playing controller', () => {
  let validatorCheck
  let errorsSpy
  let response
  let responseStatus
  let nodeInternetRadio
  let nowPlaying
  let station
  let error
  const dummyRequest = {
    query: {
      url: 'http://testurl.com',
      method: 'test method'
    }
  }

  beforeEach(() => {
    // Configure express-validator spies
    validatorCheck = jasmine.createSpyObj('validatorCheck', ['validationResult'])
    errorsSpy = jasmine.createSpyObj('errorsSpy', ['isEmpty', 'array'])
    validatorCheck.validationResult.and.returnValue(errorsSpy)
    // Unless told otherwise, this spy should represent no validation errors
    errorsSpy.isEmpty.and.returnValue(true)

    // Configure Express spies
    response = jasmine.createSpyObj('response', ['status'])
    responseStatus = jasmine.createSpyObj('resonseStatus', ['json'])
    response.status.and.returnValue(responseStatus)

    // Configure the node-internet-radio spy
    nodeInternetRadio = jasmine.createSpyObj('node-internet-radio', ['getStationInfo'])
    nodeInternetRadio.getStationInfo.and.callFake((uri, callback, method) => callback(error, station))
    error = station = null

    // Initialize the now-playing module with the relevant spies
    nowPlaying = proxyquire('../routes/controllers/now-playing', {
      'express-validator/check': validatorCheck,
      'node-internet-radio': nodeInternetRadio
    })
  })

  it('should return bad request on validation error', () => {
    // Arrange
    // Configure a dummy set of validation errors and a dummy BadRequest object.
    const dummyErrors = [
      { name: 'error 1' },
      { name: 'error 2' }
    ]
    const expectedResponse = new httpErrors.BadRequest('Validation Error', dummyErrors)
    // Configure the express-validators spies to give us some validation errors
    errorsSpy.isEmpty.and.returnValue(false)
    errorsSpy.array.and.returnValue(dummyErrors)

    // Act: Simulate a GET
    nowPlaying.apiGET(dummyRequest, response)

    /* Assert that the appropriate Bad Request response was passed
        to the Express response spies. */
    testHelpers.assertExpressStatusCode(response.status, 400)
    testHelpers.assertExpressJsonResponse(responseStatus.json, expectedResponse)
  })

  it('should return a Bad Gateway response on a node-internet-radio error', () => {
    // Arrange: Set a dummy error to be used by the getStationInfo spy callback
    error = { message: 'dummy error' }

    // Act: Simulate a GET
    nowPlaying.apiGET(dummyRequest, response)

    // Assert that the expected Bad Gateway response was set
    testHelpers.assertExpressStatusCode(response.status, 502)
    testHelpers.assertExpressJsonResponse(responseStatus.json, new httpErrors.BadGateway('node-internet-radio error', 'dummy error'))
  })

  it('should return a 200 on a successful station fetch', () => {
    // Arrange: Set a dummy station object to be used by the getStationInfo spy callback
    station = { name: 'station info object' }

    // Act: Simulate a GET
    nowPlaying.apiGET(dummyRequest, response)

    // Assert that the station object was returned with a 200
    testHelpers.assertExpressStatusCode(response.status, 200)
    testHelpers.assertExpressJsonResponse(responseStatus.json, station)
  })

  it('should properly pass in the url and method parameters from the query', () => {
    // Arrange: Set up some test data
    const testEntries = [
      { url: 'http://station1.com', method: 'first method' },
      { url: 'http://anotherstation.com', method: 'another method' },
      { url: 'http://station3.com' },
      { url: 'http://station4.com', method: 'method 4' }
    ]

    testEntries.forEach(testEntry => {
      // Arrange: Construct an Express request with the provided test entry
      const request = {
        query: {
          url: testEntry.url,
          method: testEntry.method
        }
      }

      // Act: Simulate a GET
      nowPlaying.apiGET(request, response)

      // Assert that the expected url and method were passed to getStationInfo
      expect(nodeInternetRadio.getStationInfo.calls.mostRecent().args[0]).toBe(testEntry.url)
      expect(nodeInternetRadio.getStationInfo.calls.mostRecent().args[2]).toBe(testEntry.method)
    })

    // Assert that we properly acted on each test entry
    expect(nodeInternetRadio.getStationInfo).toHaveBeenCalledTimes(testEntries.length)
  })

  it('should properly decode the provided encoded URLs', () => {
    // Arrange: Define a set of encoded & decoded URLs to test with
    const testEntries = [
      {
        encodedUrl: 'http%3A%2F%2F188.165.212.92%3A8000%2Fheavy128mp3',
        decodedUrl: 'http://188.165.212.92:8000/heavy128mp3'
      },
      {
        encodedUrl: 'http%3A%2F%2F79.111.119.111%3A9107%2F%3B',
        decodedUrl: 'http://79.111.119.111:9107/;'
      },
      {
        encodedUrl: 'http%3A%2F%2Fbbcwssc.ic.llnwd.net%2Fstream%2Fbbcwssc_mp1_ws-eieuk',
        decodedUrl: 'http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk'
      },
      {
        encodedUrl: 'http%3A%2F%2Fstream.wqxr.org%2Fwqxr',
        decodedUrl: 'http://stream.wqxr.org/wqxr'
      }
    ]

    testEntries.forEach(testEntry => {
      // Arrange: Construct an Express request object based on the encoded url
      const request = {
        query: {
          url: testEntry.encodedUrl
        }
      }

      // Act: Simulate a GET
      nowPlaying.apiGET(request, response)

      // Assert that the decoded URL was passed to getStationInfo
      expect(nodeInternetRadio.getStationInfo.calls.mostRecent().args[0]).toBe(testEntry.decodedUrl)
    })

    // Assert that we acted on each test entry
    expect(nodeInternetRadio.getStationInfo).toHaveBeenCalledTimes(testEntries.length)
  })
})
