const appInsights = require('applicationinsights')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')
const { AzureApplicationInsightsLogger } = require('winston-azure-application-insights')
const isBlank = require('is-blank')
const appInsightsKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY

const transports = [
  new winston.transports.Console({ handleExceptions: true }),
  new DailyRotateFile({ filename: 'logs/log-%DATE%.log', handleExceptions: true })
]

let appInsightsInitialized = false;
// Use Azure App Insights if and only if an instrumentation key is present
if (!isBlank(appInsightsKey)) {
  // Initialize the official appinsights api
  appInsights.setup(appInsightsKey)
    .setAutoDependencyCorrelation(false)
    .setAutoCollectDependencies(false)
    .setAutoCollectExceptions(false)
    .start()

  // Configure the App Insights Winston transport
  transports.push(new AzureApplicationInsightsLogger({
    insights: appInsights
  }))

  appInsightsInitialized = true;
}

// Log to the console and a daily rolling log
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports
})

module.exports = logger

logger.info('Logger Initialized', {
  'appInsightsKey': appInsightsKey,
  'appInsightsInitialized': appInsightsInitialized
})