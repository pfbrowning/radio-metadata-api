const appInsights = require('applicationinsights')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')
const isBlank = require('is-blank')
const appInsightsKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY

// Use Azure App Insights if and only if an instrumentation key is present
if (!isBlank(appInsightsKey)) {
  appInsights.start()
}

// Log to the console and a daily rolling log
module.exports = winston.createLogger({
  transports: [
    new winston.transports.Console({ handleExceptions: true }),
    new DailyRotateFile({ filename: 'logs/log-%DATE%.log', handleExceptions: true })
  ]
})
