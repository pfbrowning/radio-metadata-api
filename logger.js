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

// Use Azure App Insights if and only if an instrumentation key is present
if (!isBlank(appInsightsKey)) {
  appInsights.setup(appInsightsKey).start()
  transports.push(new AzureApplicationInsightsLogger({
    insights: appInsights
  }))
}

// Log to the console and a daily rolling log
const logger = winston.createLogger({
  transports: transports
})

logger.stream = {
  write: function (message, encoding) {
    logger.debug(message)
  }
}

module.exports = logger
