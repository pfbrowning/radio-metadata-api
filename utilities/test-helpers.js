exports.assertExpressStatusCode = (responseSpy, statusCode) => {
  expect(responseSpy).toHaveBeenCalledTimes(1)
  expect(responseSpy.calls.mostRecent().args[0]).toBe(statusCode)
  expect(responseSpy.calls.mostRecent().args.length).toBe(1)
}

exports.assertExpressJsonResponse = (responseJsonSpy, expectedResponse) => {
  expect(responseJsonSpy).toHaveBeenCalledTimes(1)
  expect(responseJsonSpy.calls.mostRecent().args[0]).toEqual(expectedResponse)
  expect(responseJsonSpy.calls.mostRecent().args.length).toBe(1)
}
