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
  return jasmine.createSpyObj('winston', ['createLogger'])
}

exports.createLoggerSpy = () => {
  return jasmine.createSpyObj('logger', ['warn', 'error', 'info'])
}

exports.createExpressResponseSpy = () => {
  const spy = jasmine.createSpyObj('response', ['status', 'json'])
  spy.status.and.returnValue(spy)
  spy.json.and.returnValue(spy)
  return spy
}
