exports.createAppInsightsSpy = () => {
  const spy = jasmine.createSpyObj('appInsights', [
    'start',
    'setup',
    'setAutoDependencyCorrelation',
    'setAutoCollectDependencies',
    'setAutoCollectExceptions'
  ])
  spy.setup.and.returnValue(spy)
  spy.setAutoDependencyCorrelation.and.returnValue(spy)
  spy.setAutoCollectDependencies.and.returnValue(spy)
  spy.setAutoCollectExceptions.and.returnValue(spy)
  return spy
}

exports.createWinstonSpy = () => {
  const spy = jasmine.createSpyObj('winston', ['createLogger'])
  spy.createLogger.and.returnValue({ stream: null })
  return spy
}

exports.createLoggerSpy = () => {
  return jasmine.createSpyObj('logger', ['warn', 'error'])
}

exports.createExpressResponseSpy = () => {
  const spy = jasmine.createSpyObj('response', ['status', 'json'])
  spy.status.and.returnValue(spy)
  spy.json.and.returnValue(spy)
  return spy
}
