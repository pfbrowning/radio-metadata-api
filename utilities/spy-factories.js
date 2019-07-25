exports.createAppInsightsSpy = () => {
  return jasmine.createSpyObj('appInsights', ['start'])
}

exports.createWinstonSpy = () => {
  return jasmine.createSpyObj('winston', ['createLogger'])
}

exports.createLoggerSpy = () => {
  return jasmine.createSpyObj('logger', ['warn'])
}
