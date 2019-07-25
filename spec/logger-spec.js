// const proxyquire = require('proxyquire')

// describe('Logger', () => {
//   it('should start appInsights if and only if a key was provided', () => {
//     // Arrange: Define a few test expectations
//     const testEntries = [
//       { key: undefined, shouldStart: false },
//       { key: null, shouldStart: false },
//       { key: '', shouldStart: false },
//       { key: '     ', shouldStart: false },
//       { key: 'string that is not blank', shouldStart: true }
//     ]

//     testEntries.forEach(testEntry => {
//       /* Arrange: For each expectation, create a fresh appInsights spy and
//       set the key env variable according to the test expectation. */
//       const appInsights = jasmine.createSpyObj('appInsights', ['start'])
//       if (testEntry.key != null) {
//         process.env.APPINSIGHTS_INSTRUMENTATIONKEY = testEntry.key
//       } else {
//         delete process.env.APPINSIGHTS_INSTRUMENTATIONKEY
//       }

//       // Act: Initialize the logger with the appInsights spy
//       proxyquire('../logger', {
//         applicationinsights: appInsights
//       })

//       /* Assert that appInsights should have been started only if
//         stated in the expectation. */
//       if (testEntry.shouldStart) {
//         expect(appInsights.start).toHaveBeenCalledTimes(1)
//       } else {
//         expect(appInsights.start).not.toHaveBeenCalled()
//       }
//     })
//   })
// })
