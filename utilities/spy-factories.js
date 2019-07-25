exports.createAppInsightsSpy = () => {
  return jasmine.createSpyObj('appInsights', ['start'])
}

exports.createWinstonSpy = () => {
  const spy = jasmine.createSpyObj('winston', ['createLogger'])
  spy.createLogger.and.returnValue({ stream: null })
  return spy
}

exports.createLoggerSpy = () => {
  return jasmine.createSpyObj('logger', ['warn'])
}
