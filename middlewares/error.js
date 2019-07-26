const httpErrors = require('../utilities/http-errors')
const logger = require('../logger')

module.exports = function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json(new httpErrors.Unauthorized(err.message))
  } else {
    logger.error('Error Caught By Express Middleware', {
      errorMessage: err.message,
      stack: err.stack
    })
    res.status(500).json(new httpErrors.InternalServerError(err.message))
  }
  next()
}
